import { DatabaseModule } from '@modules/database/database.module'
import { Module } from '@nestjs/common'
import { ClientController } from './client.controller'
import { ClientProvider } from './client.provider'
import { ClientService } from './client.service'

@Module({
  imports: [DatabaseModule],
  controllers: [ClientController],
  providers: [ClientService, ...ClientProvider]
})
export class ClientModule {}
