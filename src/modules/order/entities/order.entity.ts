import { Client } from '@modules/client/entities/client.entity'
import { Restaurant } from '@modules/restaurant/entities/restaurant.entity'
import { IsNotEmpty, IsString } from 'class-validator'
import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn
} from 'typeorm'

@Entity('orders')
export class Order {
  @PrimaryGeneratedColumn('uuid')
  id: string

  @Column()
  @IsString()
  @IsNotEmpty({ message: 'Description cannot be empty.' })
  description: string

  @ManyToOne(() => Client, (client) => client.id)
  client: Client

  @ManyToOne(() => Restaurant, (restaurant) => restaurant.id)
  restaurant: Restaurant

  @CreateDateColumn()
  createdAt: Date

  @UpdateDateColumn()
  updatedAt: Date
}
