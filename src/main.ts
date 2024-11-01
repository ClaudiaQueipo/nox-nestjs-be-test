import { RequestMethod } from '@nestjs/common'
import { NestFactory } from '@nestjs/core'
import { AppModule } from './app.module'
import { setupSwagger } from './swagger.config'

async function bootstrap() {
  const app = await NestFactory.create(AppModule)
  const globalPrefix = process.env.GLOBAL_PREFIX || 'api/v1'

  app.enableCors({
    origin: '*',
    methods: '*',
    allowedHeaders: '*',
    credentials: true
  })

  app.setGlobalPrefix(globalPrefix, {
    exclude: [{ path: 'health', method: RequestMethod.GET }]
  })

  setupSwagger(app)

  await app.listen(process.env.API_PORT ?? 3000)
}
bootstrap()
