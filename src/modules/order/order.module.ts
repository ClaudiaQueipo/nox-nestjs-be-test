import { ClientModule } from '@modules/client/client.module'
import { ClientProvider } from '@modules/client/client.provider'
import { DatabaseModule } from '@modules/database/database.module'
import { LoggerService } from '@modules/logger/logger.service'
import { RestaurantModule } from '@modules/restaurant/restaurant.module'
import { RestaurantProvider } from '@modules/restaurant/restaurant.provider'
import { Module } from '@nestjs/common'
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
