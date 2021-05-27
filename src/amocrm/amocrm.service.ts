import { HttpService, Inject, Injectable, OnModuleInit } from '@nestjs/common';
import { ITokenReply } from './interfaces/access-token-reply.interface';
import { AxiosResponse } from 'axios';
import { AmocrmConfigType, AMOCRM_CONFIGS_KEY } from 'src/config/amocrm.config';
import { InjectRepository } from '@nestjs/typeorm';
import { AmocrmEntity } from './amocrm-keys.entity';
import { Repository } from 'typeorm';
import { IResponse } from './interfaces/response.interface';

@Injectable()
export class AmocrmSerivce implements OnModuleInit {
  constructor(
    @Inject(AMOCRM_CONFIGS_KEY) private readonly amocrmConfig: AmocrmConfigType,
    @InjectRepository(AmocrmEntity)
    private readonly amoCrmRepo: Repository<AmocrmEntity>,
    private readonly httpService: HttpService,
  ) {
    if (
      !this.amocrmConfig.clientCode ||
      !this.amocrmConfig.clientId ||
      !this.amocrmConfig.clientSecret ||
      !this.amocrmConfig.redirectUrl ||
      !this.amocrmConfig.subdomain
    ) {
      throw new Error('Fill the .env file with relevant keys');
    }
  }

  // Get tokens on application bootstap
  async onModuleInit(): Promise<void> {
    const entity = await this.amoCrmRepo.findOne(1);

    if (!entity) {
      await this.initAccessToken();
    } else {
      console.log(`[${AmocrmSerivce.name}] onModuleInit entity exists already`);
    }
  }

  // Exchanges amoCRM keys for the tokens
  async initAccessToken(): Promise<IResponse> {
    const data = {
      client_id: this.amocrmConfig.clientId,
      client_secret: this.amocrmConfig.clientSecret,
      grant_type: 'authorization_code',
      code: this.amocrmConfig.clientCode,
      redirect_uri: this.amocrmConfig.redirectUrl,
    };

    try {
      const res: AxiosResponse<ITokenReply> = await this.httpService
        .post(
          `https://${this.amocrmConfig.subdomain}.amocrm.com/oauth2/access_token`,
          data,
          {
            headers: {
              'Content-Type': 'application/json',
            },
          },
        )
        .toPromise();

      const saved = await this.amoCrmRepo.save({ id: 1, ...res.data });

      return {
        access_token: saved.access_token,
        subdomain: this.amocrmConfig.subdomain,
      };
    } catch (error) {
      this.logAxiosError(error);
    }
  }

  // Refreshes the tokens
  async refreshTokens(): Promise<IResponse> {
    const entity = await this.amoCrmRepo.findOne(1);

    if (!entity) {
      throw new Error('Refresh token was not in the database.');
    }

    const data = {
      client_id: this.amocrmConfig.clientId,
      client_secret: this.amocrmConfig.clientSecret,
      grant_type: 'refresh_token',
      refresh_token: entity.refresh_token,
      redirect_uri: this.amocrmConfig.redirectUrl,
    };

    try {
      const res: AxiosResponse<ITokenReply> = await this.httpService
        .post(
          `https://${this.amocrmConfig.subdomain}.amocrm.com/oauth2/access_token`,
          data,
          {
            headers: {
              'Content-Type': 'application/json',
            },
          },
        )
        .toPromise();

      entity.access_token = res.data.access_token;
      entity.refresh_token = res.data.refresh_token;
      entity.token_type = res.data.token_type;
      entity.expires_in = res.data.expires_in;
      await this.amoCrmRepo.save(entity);

      return {
        access_token: res.data.access_token,
        subdomain: this.amocrmConfig.subdomain,
      };
    } catch (error) {
      this.logAxiosError(error);
    }
  }

  private logAxiosError(error) {
    if (error.response) {
      console.error(error.response.data);
      console.error(error.response.status);
      console.error(error.response.headers);
    } else if (error.request) {
      console.error(error.request);
    } else {
      console.error('Error', error.message);
    }
  }
}
