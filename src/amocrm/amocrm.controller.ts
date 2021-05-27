import { Controller, Get } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { AmocrmSerivce } from './amocrm.service';

@ApiTags('amocrm')
@Controller('amocrm')
export class AmocrmController {
  constructor(private readonly amocrmService: AmocrmSerivce) {}

  @ApiOperation({
    description: 'Получить ключи для amoCRM',
    summary: 'Получить ключи для amoCRM',
  })
  @ApiResponse({
    schema: { example: { access_token: 'string', subdomain: 'string' } },
  })
  @Get()
  async getKeys() {
    return await this.amocrmService.refreshTokens();
  }
}
