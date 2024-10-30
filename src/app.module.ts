import { AuthModule } from '@modules/auth/auth.module'
import { ClientModule } from '@modules/client/client.module'
import { Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import { AppController } from './app.controller'
import { AppService } from './app.service'
import config from './config'
import { OrderModule } from './modules/order/order.module'
import { RestaurantModule } from './modules/restaurant/restaurant.module'

@Module({
  imports: [
    ConfigModule.forRoot({
      load: [config],
      isGlobal: true
    }),
    AuthModule,
    ClientModule,
    RestaurantModule,
    OrderModule
  ],
  controllers: [AppController],
  providers: [AppService]
})
export class AppModule {}
