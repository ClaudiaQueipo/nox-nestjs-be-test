import { IsInt, IsNotEmpty, IsString } from 'class-validator'

export class CreateRestaurantDto {
  @IsString()
  @IsNotEmpty()
  name: string

  @IsString()
  @IsNotEmpty()
  address: string

  @IsInt()
  capacity: number
}
