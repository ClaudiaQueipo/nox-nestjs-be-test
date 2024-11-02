import { Module } from '@nestjs/common'
import { DatabaseModule } from 'src/core/database/database.module'
import { LoggerService } from 'src/core/logger/logger.service'
import { ClientController } from './client.controller'
import { ClientProvider } from './client.provider'
import { ClientService } from './client.service'

@Module({
  imports: [DatabaseModule],
  controllers: [ClientController],
  providers: [ClientService, ...ClientProvider, LoggerService]
})
export class ClientModule {}
