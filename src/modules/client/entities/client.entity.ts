import { Restaurant } from '@modules/restaurant/entities/restaurant.entity'
import {
  IsEmail,
  IsInt,
  IsNotEmpty,
  IsPhoneNumber,
  Max,
  Min
} from 'class-validator'
import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn
} from 'typeorm'

@Entity('clients')
export class Client {
  @PrimaryGeneratedColumn('uuid')
  id: string

  @Column()
  @IsNotEmpty({ message: 'Name cannot be empty.' })
  name: string

  @Column()
  @IsEmail({}, { message: 'Invalid email format.' })
  email: string

  @Column()
  @IsPhoneNumber(null, { message: 'Invalid phone number.' })
  phone: string

  @Column()
  @IsInt({ message: 'Age must be an integer.' })
  @Min(0, { message: 'Age cannot be less than 0.' })
  @Max(120, { message: 'Age cannot be greater than 120.' })
  age: number

  @ManyToOne(() => Restaurant, (restaurant) => restaurant.clients)
  restaurant: Restaurant

  @CreateDateColumn()
  createdAt: Date

  @UpdateDateColumn()
  updatedAt: Date
}
