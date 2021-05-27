import { HttpModule, Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AmocrmModule } from './amocrm/amocrm.module';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import { configModuleOptions } from './config';

@Module({
  imports: [
    ConfigModule.forRoot(configModuleOptions),
    TypeOrmModule.forRoot(),
    HttpModule,
    AmocrmModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
