import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm'

@Entity('clients')
export class Client {
  @PrimaryGeneratedColumn()
  id: number

  @Column()
  name: string

  @Column()
  email: string

  @Column()
  phone: string

  @Column()
  age: number
}
