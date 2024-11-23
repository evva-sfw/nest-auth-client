import {
  Global,
  Module,
} from '@nestjs/common';
import { AuthClientService } from './authclient.service';
import { ConfigurableModuleClass, MODULE_OPTIONS_TOKEN } from './authclient.module-definition';

@Global()
@Module({
  providers: [AuthClientService],
  exports: [AuthClientService, MODULE_OPTIONS_TOKEN],
})
export class AuthClientModule extends ConfigurableModuleClass {

}