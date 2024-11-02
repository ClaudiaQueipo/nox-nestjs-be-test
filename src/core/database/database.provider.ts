import { ConfigService } from '@nestjs/config'
import { join } from 'path'
import { DataSource } from 'typeorm'

export const databaseProvider = [
  {
    provide: 'DATA_SOURCE',
    useFactory: async (configService: ConfigService) => {
      const dataSource = new DataSource({
        type: 'postgres',
        host: configService.get('app_config.db_host'),
        port: configService.get('app_config.db_port'),
        username: configService.get('app_config.db_username'),
        password: configService.get('app_config.db_password'),
        database: configService.get('app_config.db_database'),
        entities: [join(__dirname, '../../**/*.entity{.ts,.js}')],
        synchronize: true
      })

      return dataSource.initialize()
    },
    inject: [ConfigService]
  }
]
