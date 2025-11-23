import winston from 'winston'
import expressWinston from 'express-winston'

// Configuración del logger para solicitudes
const requestLogger = expressWinston.logger({
  transports: [new winston.transports.File({ filename: 'logs/request.log' })],
  format: winston.format.json(),
})

// Configuración del logger para errores
const errorLogger = expressWinston.errorLogger({
  transports: [new winston.transports.File({ filename: 'logs/error.log' })],
  format: winston.format.json(),
})

export { requestLogger, errorLogger }
