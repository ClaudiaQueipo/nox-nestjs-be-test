import { Restaurant } from '../entities/restaurant.entity'

export type TRestaurantResponse = {
  data: Restaurant[]
  total: number
  page: number
  lastPage: number
}
