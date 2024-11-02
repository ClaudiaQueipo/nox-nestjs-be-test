import { Module } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { databaseProvider } from './database.provider'

@Module({
  providers: [...databaseProvider, ConfigService],
  exports: [...databaseProvider]
})
export class DatabaseModule {}
