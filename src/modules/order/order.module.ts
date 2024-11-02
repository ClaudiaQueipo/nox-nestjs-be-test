import { ClientModule } from '@modules/client/client.module'
import { ClientProvider } from '@modules/client/client.provider'
import { RestaurantModule } from '@modules/restaurant/restaurant.module'
import { RestaurantProvider } from '@modules/restaurant/restaurant.provider'
import { Module } from '@nestjs/common'
import { DatabaseModule } from 'src/core/database/database.module'
import { LoggerService } from 'src/core/logger/logger.service'
import { OrderController } from './order.controller'
import { OrderProvider } from './order.provider'
import { OrderService } from './order.service'

@Module({
  imports: [DatabaseModule, ClientModule, RestaurantModule],
  controllers: [OrderController],
  providers: [
    OrderService,
    ...OrderProvider,
    ...RestaurantProvider,
    ...ClientProvider,
    LoggerService
  ]
})
export class OrderModule {}
