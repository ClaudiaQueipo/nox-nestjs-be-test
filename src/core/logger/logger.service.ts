import { Injectable } from '@nestjs/common'
import * as fs from 'fs'
import * as path from 'path'
import * as winston from 'winston'
import 'winston-daily-rotate-file'

@Injectable()
export class LoggerService {
  private logger: winston.Logger

  constructor() {
    const logDir = path.join(process.cwd(), 'logs')

    this.createLogDirectory(logDir)

    const fileTransport = new winston.transports.DailyRotateFile({
      filename: path.join(logDir, 'application-%DATE%.log'),
      datePattern: 'YYYY-MM-DD',
      maxFiles: '14d',
      zippedArchive: false,
      level: 'info'
    })

    fileTransport.on('error', (err) => {
      console.error('Error en transporte de archivo:', err)
    })

    this.logger = winston.createLogger({
      level: 'debug',
      format: winston.format.combine(
        winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
        winston.format.printf(({ timestamp, level, message }) => {
          return `${timestamp} [${level.toUpperCase()}]: ${message}`
        })
      ),
      transports: [
        new winston.transports.Console({
          level: 'debug'
        }),
        fileTransport
      ]
    })

    this.logger.on('error', (err) => {
      console.error('Error escribiendo el log:', err)
    })
  }

  private createLogDirectory(logDir: string) {
    if (!fs.existsSync(logDir)) {
      fs.mkdirSync(logDir, { recursive: true })
    }
  }

  log(message: string) {
    this.logger.info(message)
  }

  error(message: string, trace?: string) {
    this.logger.error(`${message} -> Trace: ${trace}`)
  }

  warn(message: string) {
    this.logger.warn(message)
  }

  debug(message: string) {
    this.logger.debug(message)
  }
}
