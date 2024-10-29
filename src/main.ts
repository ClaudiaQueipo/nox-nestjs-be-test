import { RequestMethod } from '@nestjs/common'
import { NestFactory } from '@nestjs/core'
import { AppModule } from './app.module'
import { setupSwagger } from './swagger.config'

async function bootstrap() {
  const app = await NestFactory.create(AppModule)
  const globalPrefix = process.env.GLOBAL_PREFIX || 'api/v1'

  app.setGlobalPrefix(globalPrefix, {
    exclude: [{ path: 'health', method: RequestMethod.GET }]
  })

  app.enableCors({
    origin: '*',
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true
  })

  setupSwagger(app)

  await app.listen(process.env.PORT ?? 3000)
}
bootstrap()
