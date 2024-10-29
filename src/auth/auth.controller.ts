import { Body, Controller, Post } from '@nestjs/common'
import { ApiOperation, ApiTags } from '@nestjs/swagger'
import { AuthService } from './auth.service'
import { LoginDto } from './dto/login-auth.dto'
import { RegisterDto } from './dto/register-auth.dto'
@ApiTags('AUTHENTICATION')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @ApiOperation({ summary: 'Login User' })
  @Post('login')
  async login(@Body() user: LoginDto) {
    return this.authService.login(user)
  }

  @ApiOperation({ summary: 'Register User' })
  @Post('register')
  async register(@Body() user: RegisterDto) {
    return this.authService.register(user)
  }
}
