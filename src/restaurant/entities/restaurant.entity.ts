import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm'

@Entity('restaurants')
export class Restaurant {
  @PrimaryGeneratedColumn()
  id: number

  @Column()
  name: string

  @Column()
  address: string

  @Column()
  capacity: number
}
