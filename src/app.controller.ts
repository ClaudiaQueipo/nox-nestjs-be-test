import { Controller, Get } from '@nestjs/common'
import { ApiOperation } from '@nestjs/swagger'
import { AppService } from './app.service'

@Controller('health')
export class AppController {
  constructor(private readonly appService: AppService) {}

  @ApiOperation({ summary: 'Check server health' })
  @Get()
  getHealth(): string {
    return this.appService.health()
  }
}
