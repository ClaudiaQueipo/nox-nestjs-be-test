import { IsNotEmpty, IsString } from 'class-validator'

export class CreateOrderDto {
  @IsString()
  @IsNotEmpty()
  description: string

  @IsNotEmpty()
  clientId: number

  @IsNotEmpty()
  restaurantId: number
}
