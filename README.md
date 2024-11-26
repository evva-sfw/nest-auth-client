# Nest Auth Client

[![NPM Version](https://img.shields.io/npm/v/%40evva%2Fnest-auth-client)](https://www.npmjs.com/package/@evva/nest-auth-client)
[![NPM Downloads](https://img.shields.io/npm/dy/%40evva%2Fnest-auth-client)](https://www.npmjs.com/package/@evva/nest-auth-client)
![NPM Unpacked Size (with version)](https://img.shields.io/npm/unpacked-size/%40evva%2Fnest-auth-client/latest)
![GitHub last commit](https://img.shields.io/github/last-commit/evva-sfw/nest-auth-client)
[![GitHub branch check runs](https://img.shields.io/github/check-runs/evva-sfw/nest-auth-client/main)]([URL](https://github.com/evva-sfw/nest-auth-client/actions))
[![EVVA License](https://img.shields.io/badge/license-EVVA_License-yellow.svg?color=fce500&logo=data:image/svg+xml;base64,PCEtLSBHZW5lcmF0ZWQgYnkgSWNvTW9vbi5pbyAtLT4KPHN2ZyB2ZXJzaW9uPSIxLjEiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyIgd2lkdGg9IjY0MCIgaGVpZ2h0PSIxMDI0IiB2aWV3Qm94PSIwIDAgNjQwIDEwMjQiPgo8ZyBpZD0iaWNvbW9vbi1pZ25vcmUiPgo8L2c+CjxwYXRoIGZpbGw9IiNmY2U1MDAiIGQ9Ik02MjIuNDIzIDUxMS40NDhsLTMzMS43NDYtNDY0LjU1MmgtMjg4LjE1N2wzMjkuODI1IDQ2NC41NTItMzI5LjgyNSA0NjYuNjY0aDI3NS42MTJ6Ij48L3BhdGg+Cjwvc3ZnPgo=)](LICENSE)

Client implementation for the EVVA Auth Service.

## Install


## Usage

*In app.module.ts as imports*

```ts
import { ConfigModule, ConfigService } from '@nestjs/config';
import {
  AUTH_CLIENT,
  AUTH_ENDPOINT,
  AUTH_SECRET,
  AUTH_TENANT,
  AUTH_VALIDITY,
  AuthClientModule,
  AuthClientModuleOptions,
  VAULT_CA,
  VAULT_ENDPOINT,
  VAULT_JWTROLE_IDENTIFIER,
} from '@evva/nest-auth-client';

@Module({
  imports: [
    AuthClientModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) =>
        ({
          authEndpoint: configService.get<string>(AUTH_ENDPOINT), //use optional
          authTenant: configService.get<string>(AUTH_TENANT),
          authClientId: configService.get<string>(AUTH_CLIENT),
          authClientSecret: configService.get<string>(AUTH_SECRET),
          authValidity: parseInt(configService.get(AUTH_VALIDITY)), // in seconds, see spec
          vaultRoleId: configService.get<string>(VAULT_JWTROLE_IDENTIFIER),
          vaultEndpoint: configService.get<string>(VAULT_ENDPOINT),
          vaultCA: configService.get<string>(VAULT_CA),
        }) as AuthClientModuleOptions,
    }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
```

When using the ConfigService, make sure that the variables are loaded before accessing them.
This usually works as follows:
```ts
export class MyModule implements OnModuleInit {
  
  
  async onModuleInit() {
    await ConfigModule.envVariablesLoaded;
  }
}
```

## Build & Package
```bash
# Nest Build
$ nest build
```

## Support

## Stay in touch

## License

[Proprietary](LICENSE)
