import { HttpModule, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AmocrmEntity } from './amocrm-keys.entity';
import { AmocrmController } from './amocrm.controller';
import { AmocrmSerivce } from './amocrm.service';

@Module({
  imports: [HttpModule, TypeOrmModule.forFeature([AmocrmEntity])],
  controllers: [AmocrmController],
  providers: [AmocrmSerivce],
})
export class AmocrmModule {}
