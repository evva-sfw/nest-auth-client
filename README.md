## Description

Client implementation for the EVVA Auth Service.

## Build & Package
```bash
# Nest Build
$ nest build
```

## Usage

```
  import {ConfigService } from '@nestjs/config';
  import { 
  AuthClientModule, 
  AuthClientService, 
  AuthClientOptions, 
  AUTH_ENDPOINT,
  AUTH_TENANT,
  AUTH_CLIENT,
  AUTH_SECRET,
  AUTH_VALIDITY,
  VAULT_JWTROLE_IDENTIFIER,
  VAULT_ENDPOINT,
  VAULT_CA,
} from '@evva/nest-auth-client';

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
          vaultRoleId: configService.get<string>(AULT_JWTROLE_IDENTIFIER),
          vaultEndpoint: configService.get<string>(VAULT_ENDPOINT),
          vaultCA: configService.get<string>(VAULT_CA)
        }) as AuthClientOptions,
    }),
```

When using the ConfigService, make sure that the variables are loaded before accessing them.
This usually works as follows:
```
export class MyModule implements OnModuleInit {
  
  
  async onModuleInit() {
    await ConfigModule.envVariablesLoaded;
  }
}
```

## Support

## Stay in touch

## License

[Proprietary](LICENSE)
