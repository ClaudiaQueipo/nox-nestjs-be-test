import { ApiProperty } from '@nestjs/swagger'
import { IsString, IsNotEmpty } from 'class-validator'

export class LoginDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    example: 'admin',
    description: 'Username'
  })
  username: string

  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    example: 'admin',
    description: 'Password'
  })
  password: string
}
