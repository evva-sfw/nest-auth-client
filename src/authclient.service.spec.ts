import { Test, TestingModule } from '@nestjs/testing';
import { AuthClientService } from './authclient.service';
import { AuthClientModule } from './authclient.module';


/**
 * HKDF Test vectors
 */
const HKDF_TESTVECTORS = [
  {
    algorithm: 'SHA-256',
    input: '0b0b0b0b0b0b0b0b0b0b0b0b0b0b0b0b0b0b0b0b0b0b',
    salt: '000102030405060708090a0b0c',
    info: 'f0f1f2f3f4f5f6f7f8f9',
    length: 42,
    output:
      '3cb25f25faacd57a90434f64d0362f2a2d2d0a90cf1a5a4c5db02d56ecc4c5bf34007208d5b887185865',
  },
  {
    algorithm: 'SHA-256',
    input:
      '000102030405060708090a0b0c0d0e0f101112131415161718191a1b1c1d1e1f202122232425262728292a2b2c2d2e2f303132333435363738393a3b3c3d3e3f404142434445464748494a4b4c4d4e4f',
    salt: '606162636465666768696a6b6c6d6e6f707172737475767778797a7b7c7d7e7f808182838485868788898a8b8c8d8e8f909192939495969798999a9b9c9d9e9fa0a1a2a3a4a5a6a7a8a9aaabacadaeaf',
    info: 'b0b1b2b3b4b5b6b7b8b9babbbcbdbebfc0c1c2c3c4c5c6c7c8c9cacbcccdcecfd0d1d2d3d4d5d6d7d8d9dadbdcdddedfe0e1e2e3e4e5e6e7e8e9eaebecedeeeff0f1f2f3f4f5f6f7f8f9fafbfcfdfeff',
    length: 82,
    output:
      'b11e398dc80327a1c8e7f78c596a49344f012eda2d4efad8a050cc4c19afa97c59045a99cac7827271cb41c65e590e09da3275600c2f09b8367793a9aca3db71cc30c58179ec3e87c14c01d5c1f3434f1d87',
  },
  {
    algorithm: 'SHA-256',
    input: '0b0b0b0b0b0b0b0b0b0b0b0b0b0b0b0b0b0b0b0b0b0b',
    salt: '',
    info: '',
    length: 42,
    output:
      '8da4e775a563c18f715f802a063c5a31b8a11f5c5ee1879ec3454e5f3c738d2d9d201395faa4b61a96c8',
  },
  {
    algorithm: 'SHA-256',
    input: '4a1a5bf082915001d09314a7f25d294768be73885b1f9047aaf8b00fbe7f1fef',
    salt: 'bfc95280e34add1dd4a8d8114aaad91908ef5b7e90501db032c43a111ef5f948',
    info: '',
    length: 32,
    output: '08c027a0ecc6d04bd3a861f0d5dbe1bdc6eecd541c513ffe8e1cc1c846430023',
  },
];


describe('AuthClientService', () => {
  let authClientService: AuthClientService;
  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      imports: [AuthClientModule.forRoot({
        authEndpoint: 'https://test.service/auth',
        authTenant: 'test',
        authClientId: 'test',
        authClientSecret: 'testsecret'
      })],
      providers: [AuthClientService],
    }).compile();
    authClientService = app.get<AuthClientService>(AuthClientService);

  });

  it('#_keyDerive pass tests', async () => {
    for (const entry of HKDF_TESTVECTORS) {
      const derivedKey = authClientService._keyDerive(
        Buffer.from(entry.input, 'hex'),
        Buffer.from(entry.salt, 'hex'),
        Buffer.from(entry.info, 'hex'),
        entry.length,
      );
      const actual = derivedKey.toString('hex');
      const expected = String(entry.output);
      expect(actual).toEqual(expected);
    }
  });
});
