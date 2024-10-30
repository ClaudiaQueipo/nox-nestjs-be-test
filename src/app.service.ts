import { Injectable } from '@nestjs/common'

@Injectable()
export class AppService {
  health(): string {
    return 'Server is up and running!'
  }
}
