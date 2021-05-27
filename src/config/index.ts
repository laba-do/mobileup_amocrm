import { ConfigModuleOptions } from '@nestjs/config/dist/interfaces';
import { amoConfigsFactory } from './amocrm.config';
import { appConfigsFactory } from './app.config';

export const configModuleOptions: ConfigModuleOptions = {
  load: [appConfigsFactory, amoConfigsFactory],
  isGlobal: true,
};
