import { registerAs } from '@nestjs/config'

export default registerAs('app_config', () => ({
  db_host: process.env.DATABASE_HOST || '127.0.0.1',
  db_port: parseInt(process.env.DATABASE_PORT, 10) || 5432,
  db_username: process.env.DATABASE_USER || 'postgres',
  db_password: process.env.DATABASE_PASSWORD || 'postgres123',
  db_database: process.env.DATABASE_NAME || 'mydatabase',
  secret_key: process.env.SECRET_KEY || 'mysecretkey'
}))
