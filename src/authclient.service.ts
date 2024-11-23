import { Inject, Injectable, Logger } from '@nestjs/common';
import { DateTime } from 'luxon';
import * as crypto from 'node:crypto';

import nodeVault from 'node-vault';
import { MODULE_OPTIONS_TOKEN } from './authclient.module-definition';
import { AuthClientModuleOptions } from './authclient.module-options';

const HKDF_HASH = 'sha256';
const HKDF_DERIVED_KEY_BYTELENGTH = 32;
const AUTH_TOKEN_SEPARATOR = '-';

@Injectable()
export class AuthClientService {
  private readonly logger = new Logger('AuthClientService');
  private authToken: string;
  private vault: nodeVault.client;
  constructor(@Inject(MODULE_OPTIONS_TOKEN) private authClientModuleOptions: AuthClientModuleOptions) {
  }

  /**
   * Fetch the vault token.
   */
  async getVaultToken() {
    this.logger.log('getVaultToken');
    if (!this.authToken) {
      this.logger.error('Proceeed to Authentication first.');
    }
    const vaultRoleId = this.authClientModuleOptions.vaultRoleId;
    const vaultEndpoint = this.authClientModuleOptions.vaultEndpoint;
    const vaultCA = this.authClientModuleOptions.vaultCA;

    const options = {
      apiVersion: 'v1',
      endpoint: vaultEndpoint,
      requestOptions: {
        ca: vaultCA,
      },
    };
    const vault = nodeVault(options);
    try {
      vault.jwtLogin({
        role: vaultRoleId,
        jwt: this.authToken,
      });
    } catch (e) {
      this.logger.error(e);
    }
    this.vault = vault;
  }

  /**
   * Fetches the JWT token for M2M authentication.
   */
  async fetchAuthToken(): Promise<string> {
    const authValidity = this.authClientModuleOptions.authValidity;
    const authEndpoint = this.authClientModuleOptions.authEndpoint;
    const authTenant = this.authClientModuleOptions.authTenant;
    const authClientIdentifier = this.authClientModuleOptions.authClientId;
    const secret = this.authClientModuleOptions.authClientSecret;

    this.logger.debug(`fetchAuthToken ${authEndpoint}, ${authTenant}, ${authClientIdentifier}`);
    try {
      const authToken = this._generateAuthToken(authTenant, authClientIdentifier, Buffer.from(secret, 'base64'));
      const authUrl = `${authEndpoint}/auth/2/${authTenant}/${authClientIdentifier}/${authToken}?validity=${authValidity}`;
      const response = await fetch(authUrl);
      this.authToken = await response.text();
    } catch (e) {
      this.logger.error(e);
      return 'OBVIOUSLYNOTOKEN';
    }
    return this.authToken;
  }

  /**
   * Getter for MQTT username.
   * @returns the username as required for the MQTT endpoint.
   */
  getAuthUsername(): string {
    const authTenant = this.authClientModuleOptions.authTenant;
    const authClientIdentifier = this.authClientModuleOptions.authClientId;

    return `sfw-auth/clients/${authTenant}/${authClientIdentifier}`;
  }

  /**
   * The vault token must be fetched first with getToken()
   * @param {String} path Vault path to secret. For example: secret/infrastructure/services/internal/bamboo/approles/approle-test
   * @async
   */
  async getSecret(path) : Promise<string>{
    return new Promise(function (resolve, reject) {
      this.vault.read(path)
        .then((value) => {
          resolve(value.data);
        })
        .catch(function (err) {
          this.logger.error(JSON.stringify(err));
          reject();
        });
    }.bind(this));
  }

  _keyDerive(key: Buffer, salt: Buffer, info: Buffer, length = HKDF_DERIVED_KEY_BYTELENGTH): Buffer {
    // 1. Extract
    const extract = crypto.createHmac(HKDF_HASH, salt).update(key).digest();

    // 2. Expand
    const infoLen = info.length;
    const steps = Math.ceil(length / 32);
    const t = Buffer.alloc(32 * steps + infoLen + 1);
    for (let c = 1, start = 0, end = 0; c <= steps; ++c) {
      // add info
      info.copy(t, end);
      // add counter
      t[end + infoLen] = c;

      crypto
        .createHmac(HKDF_HASH, extract)
        // use view: T(C) = T(C-1) | info | C
        .update(t.subarray(start, end + infoLen + 1))
        .digest()
        // put back to the same buffer
        .copy(t, end);

      start = end; // used for T(C-1) start
      end += 32; // used for T(C-1) end & overall end
    }
    return t.subarray(0, length);
  }
  _generateTimestamp() {
    const timestamp = DateTime.now()
      .toMillis()
      .toString(16)
      .padStart(16, '0');
    return timestamp;
  }
  _generateAuthToken(tenant: string, client: string, secret: Buffer): string {
    const timestamp = this._generateTimestamp();
    const salt = crypto.randomBytes(16);
    const info = Buffer.from([tenant, client, timestamp].join(''), 'ascii');
    const tokenKey = this._keyDerive(
      secret,
      salt,
      info
    )
      .toString('hex')
      .toLowerCase();

    const authToken = [timestamp, salt.toString('hex'), tokenKey].join(AUTH_TOKEN_SEPARATOR);
    return authToken;
  }
}
