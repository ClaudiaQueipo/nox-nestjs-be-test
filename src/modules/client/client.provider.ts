import { DataSource } from 'typeorm'
import { Client } from './entities/client.entity'

export const ClientProvider = [
  {
    provide: 'CLIENT_REPOSITORY',
    useFactory: (dataSource: DataSource) => dataSource.getRepository(Client),
    inject: ['DATA_SOURCE']
  }
]
