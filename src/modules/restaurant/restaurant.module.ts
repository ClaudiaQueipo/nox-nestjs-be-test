import { DatabaseModule } from '@modules/database/database.module'
import { Module } from '@nestjs/common'
import { RestaurantController } from './restaurant.controller'
import { RestaurantProvider } from './restaurant.provider'
import { RestaurantService } from './restaurant.service'
import { ClientModule } from '@modules/client/client.module'
import { ClientProvider } from '@modules/client/client.provider'

@Module({
  imports: [DatabaseModule, ClientModule],
  controllers: [RestaurantController],
  providers: [RestaurantService, ...RestaurantProvider, ...ClientProvider]
})
export class RestaurantModule {}
