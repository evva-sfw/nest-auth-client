import { ConfigurableModuleBuilder } from '@nestjs/common';
import { AuthClientModuleOptions } from './authclient.module-options';

export const { ConfigurableModuleClass, MODULE_OPTIONS_TOKEN } =
  new ConfigurableModuleBuilder<AuthClientModuleOptions>().setClassMethodName('forRoot').build();