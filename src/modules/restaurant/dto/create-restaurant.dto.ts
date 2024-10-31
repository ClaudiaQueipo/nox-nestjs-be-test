import { ApiProperty } from '@nestjs/swagger'
import { IsInt, IsNotEmpty, IsString, MaxLength, Min } from 'class-validator'

export class CreateRestaurantDto {
  @ApiProperty({
    description: 'Nombre del restaurante',
    maxLength: 100,
    example: 'Restaurante El Buen Sabor'
  })
  @IsString()
  @IsNotEmpty({ message: 'El nombre es obligatorio' })
  @MaxLength(100, { message: 'El nombre no puede exceder los 100 caracteres' })
  name: string

  @ApiProperty({
    description: 'Dirección del restaurante',
    maxLength: 150,
    example: 'Avenida Siempre Viva 123'
  })
  @IsString()
  @IsNotEmpty({ message: 'La dirección es obligatoria' })
  @MaxLength(150, {
    message: 'La dirección no puede exceder los 150 caracteres'
  })
  address: string

  @ApiProperty({
    description:
      'Capacidad máxima de clientes que el restaurante puede albergar',
    minimum: 1,
    example: 50
  })
  @IsInt({ message: 'La capacidad debe ser un número entero' })
  @Min(1, { message: 'La capacidad debe ser al menos 1' })
  capacity: number
}
