import {
  IsEmail,
  IsInt,
  IsNotEmpty,
  IsPhoneNumber,
  IsString
} from 'class-validator'

export class CreateClientDto {
  @IsString()
  @IsNotEmpty()
  name: string

  @IsEmail()
  email: string

  @IsPhoneNumber()
  phone: string

  @IsInt()
  age: number
}
