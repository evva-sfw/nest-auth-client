## Description

Client implementation for the EVVA [Auth Service].

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
  SFW_AUTH_ENDPOINT,
  SFW_AUTH_TENANT,
  SFW_AUTH_CLIENT,
  SFW_AUTH_SECRET,
  SFW_AUTH_VALIDITY,
  VAULT_JWTROLE_IDENTIFIER,
  VAULT_ENDPOINT,
  VAULT_CA,
} from 'nest-sfw-auth-client';

 AuthClientModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => 
        ({
          sfwAuthEndpoint: configService.get<string>(SFW_AUTH_ENDPOINT), //use optional
          sfwAuthTenant: configService.get<string>(SFW_AUTH_TENANT),
          sfwAuthClientId: configService.get<string>(SFW_AUTH_CLIENT),
          sfwAuthClientSecret: configService.get<string>(SFW_AUTH_SECRET),
          sfwAuthValidity: parseInt(configService.get(SFW_AUTH_VALIDITY)), // in seconds, see spec
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

Proprietary
