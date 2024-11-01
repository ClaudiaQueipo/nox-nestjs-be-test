import { Order } from '../entities/order.entity'

export type TOrderResponse = {
  data: Order[]
  total: number
  page: number
  lastPage: number
}
