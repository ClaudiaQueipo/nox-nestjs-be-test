import {
  BadRequestException,
  Inject,
  Injectable,
  NotFoundException
} from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import * as bcrypt from 'bcrypt'
import { Repository } from 'typeorm'
import { LoginDto } from './dto/login-auth.dto'
import { RegisterDto } from './dto/register-auth.dto'
import { User } from './entities/user.entity'

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    @Inject('USER_REPOSITORY')
    private readonly userRepository: Repository<User>
  ) {}

  async validateUser(username: string, password: string): Promise<User | null> {
    const user = await this.userRepository.findOne({ where: { username } })

    if (user && (await bcrypt.compare(password, user.password))) {
      return user
    }
    return null
  }

  async login(user: LoginDto) {
    const validUser = await this.validateUser(user.username, user.password)
    if (!validUser) {
      throw new NotFoundException(
        'Invalid credentials: Check your username and password or Sign up in the application'
      )
    }

    const payload = { id: validUser.id, username: validUser.username }
    return {
      access_token: this.jwtService.sign(payload)
    }
  }

  async register(user: RegisterDto) {
    const existingUser = await this.userRepository.findOne({
      where: { username: user.username }
    })

    if (existingUser) {
      throw new BadRequestException('User already exists')
    }

    const salt = await bcrypt.genSalt(10)
    const hashedPassword = await bcrypt.hash(user.password, salt)

    const newUser = this.userRepository.create({
      username: user.username,
      password: hashedPassword
    })

    await this.userRepository.save(newUser)

    return { message: 'User created successfully' }
  }

  async verifyToken(token: string): Promise<User> {
    try {
      const decoded = this.jwtService.verify(token)
      return { id: decoded.id, username: decoded.username, password: '' }
    } catch (error) {
      throw new BadRequestException(`Invalid token, ${error}`)
    }
  }
}
