import { DatabaseModule } from '@modules/database/database.module'
import { LoggerService } from '@modules/logger/logger.service'
import { Module } from '@nestjs/common'
import { ConfigModule, ConfigService } from '@nestjs/config'
import { JwtModule } from '@nestjs/jwt'
import { PassportModule } from '@nestjs/passport'
import { AuthController } from './auth.controller'
import { AuthService } from './auth.service'
import { JwtAuthGuard } from './guards/jwt-auth.guard'
import { JwtStrategy } from './jwt-strategy'
import { UserProvider } from './user.provider'

@Module({
  imports: [
    ConfigModule,
    DatabaseModule,
    PassportModule.register({ defaultStrategy: 'jwt' }),
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        secret: configService.get<string>('app_config.secret_key'),
        signOptions: { expiresIn: '1h' }
      }),
      inject: [ConfigService]
    })
  ],
  providers: [
    AuthService,
    JwtStrategy,
    JwtAuthGuard,
    ...UserProvider,
    LoggerService
  ],
  controllers: [AuthController]
})
export class AuthModule {}
