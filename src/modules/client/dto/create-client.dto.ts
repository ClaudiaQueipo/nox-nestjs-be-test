import { ApiProperty } from '@nestjs/swagger'
import {
  IsEmail,
  IsInt,
  IsNotEmpty,
  IsPhoneNumber,
  IsString,
  Length,
  Max,
  Min
} from 'class-validator'

export class CreateClientDto {
  @ApiProperty({ description: 'name', example: 'Luis' })
  @IsString()
  @IsNotEmpty({ message: 'Name cannot be empty.' })
  @Length(2, 50, { message: 'Name must be between 2 and 50 characters.' })
  name: string

  @ApiProperty({ description: 'email', example: 'example@example.com' })
  @IsEmail({}, { message: 'Invalid email format.' })
  email: string

  @ApiProperty({ description: 'phone number', example: '+5355558899' })
  @IsPhoneNumber(null, { message: 'Invalid phone number.' })
  phone: string

  @ApiProperty({ description: 'age', minimum: 0, example: 30 })
  @IsInt({ message: 'Age must be an integer.' })
  @Min(0, { message: 'Age cannot be less than 0.' })
  @Max(120, { message: 'Age cannot be greater than 120.' })
  age: number
}
