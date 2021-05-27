import { ConfigType, registerAs } from '@nestjs/config';

export const amoConfigsFactory = registerAs('amocrm', () => ({
  clientId: process.env.CLIENT_ID,
  clientSecret: process.env.CLIENT_SECRET,
  clientCode: process.env.CODE,
  redirectUrl: process.env.REDIRECT_URL,
  subdomain: process.env.SUBDOMAIN,
}));

export const AMOCRM_CONFIGS_KEY = amoConfigsFactory.KEY;

export type AmocrmConfigType = ConfigType<typeof amoConfigsFactory>;
