import { Controller, Get } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { AppService } from './app.service';

@ApiTags('')
@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @ApiOperation({
    description: 'Ping',
  })
  @ApiResponse({ type: String })
  @Get('ping')
  getHello(): string {
    return this.appService.getPing();
  }
}
