import { ApiProperty } from '@nestjs/swagger'
import { IsNotEmpty, IsString, IsUUID } from 'class-validator'

export class CreateOrderDto {
  @ApiProperty({
    description: 'Descripción de la orden',
    maxLength: 100,
    example: '2 cheeseburger con una coca cola'
  })
  @IsString()
  @IsNotEmpty({ message: 'La descripción de la orden es obligatoria' })
  description: string

  @ApiProperty({
    description: 'ID del Cliente',
    maxLength: 150
  })
  @IsUUID('all', { message: 'El ID del cliente debe ser un UUID válido' })
  @IsNotEmpty()
  clientId: string

  @ApiProperty({
    description: 'ID del Restaurante',
    maxLength: 150
  })
  @IsUUID('all', { message: 'El ID del restaurant debe ser un UUID válido' })
  @IsNotEmpty()
  restaurantId: string
}
