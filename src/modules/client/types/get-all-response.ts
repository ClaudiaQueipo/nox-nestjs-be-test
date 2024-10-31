import { Client } from '../entities/client.entity'

export type TClientResponse = {
  data: Client[]
  total: number
  page: number
  lastPage: number
}
