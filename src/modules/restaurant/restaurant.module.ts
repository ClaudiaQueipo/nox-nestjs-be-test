import { ClientModule } from '@modules/client/client.module'
import { ClientProvider } from '@modules/client/client.provider'
import { Module } from '@nestjs/common'
import { DatabaseModule } from 'src/core/database/database.module'
import { LoggerService } from 'src/core/logger/logger.service'
import { RestaurantController } from './restaurant.controller'
import { RestaurantProvider } from './restaurant.provider'
import { RestaurantService } from './restaurant.service'

@Module({
  imports: [DatabaseModule, ClientModule],
  controllers: [RestaurantController],
  providers: [
    RestaurantService,
    ...RestaurantProvider,
    ...ClientProvider,
    LoggerService
  ]
})
export class RestaurantModule {}
