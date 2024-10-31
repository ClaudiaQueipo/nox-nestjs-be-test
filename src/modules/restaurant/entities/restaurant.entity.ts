import { Client } from '@modules/client/entities/client.entity'
import { IsInt, IsNotEmpty, IsString, MaxLength, Min } from 'class-validator'
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm'

@Entity()
export class Restaurant {
  @PrimaryGeneratedColumn('uuid')
  id: string

  @Column({ length: 100 })
  @IsString()
  @IsNotEmpty()
  @MaxLength(100, { message: 'El nombre no puede exceder los 100 caracteres' })
  name: string

  @Column({ length: 150 })
  @IsString()
  @IsNotEmpty()
  @MaxLength(150, {
    message: 'La dirección no puede exceder los 150 caracteres'
  })
  address: string

  @Column('int')
  @IsInt()
  @Min(1, { message: 'La capacidad debe ser al menos 1' })
  capacity: number

  @OneToMany(() => Client, (client) => client.restaurant)
  clients: Client[]

  addClient(client: Client): boolean {
    if (this.clients.length >= this.capacity) {
      throw new Error('Capacidad máxima alcanzada')
    }
    if (client.age < 18) {
      throw new Error('Solo se permiten adultos')
    }
    this.clients.push(client)
    return true
  }
}
