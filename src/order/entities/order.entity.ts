import { Client } from 'src/client/entities/client.entity'
import { Restaurant } from 'src/restaurant/entities/restaurant.entity'
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm'

@Entity('orders')
export class Order {
  @PrimaryGeneratedColumn()
  id: number

  @Column()
  description: string

  @ManyToOne(() => Client, (client) => client.id)
  client: Client

  @ManyToOne(() => Restaurant, (restaurant) => restaurant.id)
  restaurant: Restaurant
}
