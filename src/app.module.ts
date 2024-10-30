import { Module } from '@nestjs/common'
import { ConfigModule, ConfigService } from '@nestjs/config'
import { TypeOrmModule } from '@nestjs/typeorm'
import { AppController } from './app.controller'
import { AppService } from './app.service'
import { RestaurantModule } from './modules/restaurant/restaurant.module'
import { OrderModule } from './modules/order/order.module'
import config from './config'
import { ClientModule } from '@modules/client/client.module'

@Module({
  imports: [
    ConfigModule.forRoot({
      load: [config],
      isGlobal: true
    }),
    TypeOrmModule.forRootAsync({
      useFactory: (configService) => ({
        type: 'postgres',
        host: configService.get('database.host'),
        port: configService.get('database.port'),
        username: configService.get('database.username'),
        password: configService.get('database.password'),
        database: configService.get('database.database'),
        synchronize: true
      }),
      inject: [ConfigService]
    }),
    ClientModule,
    RestaurantModule,
    OrderModule
  ],
  controllers: [AppController],
  providers: [AppService]
})
export class AppModule {}
