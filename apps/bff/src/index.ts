import 'dotenv/config'
import Fastify from 'fastify'
import cors from '@fastify/cors'
import helmet from '@fastify/helmet'
import { authPlugin } from './plugins/auth'
import { linksRoutes } from './routes/links'

const PORT = parseInt(process.env.PORT || '3001', 10)
const HOST = process.env.HOST || '0.0.0.0'
const LOG_LEVEL = (process.env.LOG_LEVEL || 'info') as any

const fastify = Fastify({
  logger: {
    level: LOG_LEVEL,
  },
})

// Register security plugins
fastify.register(helmet, {
  contentSecurityPolicy: false,
})

fastify.register(cors, {
  origin: process.env.CORS_ORIGIN?.split(',') ?? ['http://localhost:5173'],
  // TODO(Isabel): cuando el dominio esté definido, agregar CORS_ORIGIN al .env de staging y producción
  // Ejemplo: CORS_ORIGIN=https://portal.sugarcoach.app,http://localhost:5173
  credentials: true,
})

// Register authentication plugin
fastify.register(authPlugin)

// Health check endpoint (no auth required)
fastify.get('/health', async (_request, _reply) => {
  return {
    status: 'ok',
    timestamp: new Date().toISOString(),
    service: 'SugarCoach BFF',
    version: '1.0.0',
  }
})

// API v1 routes
fastify.register(linksRoutes, { prefix: '/api/v1/links' })

// 404 handler
fastify.setNotFoundHandler((_request, reply) => {
  reply.status(404).send({
    error: 'Not found',
  })
})

// Error handler
fastify.setErrorHandler((error, _request, reply) => {
  fastify.log.error(error)

  const statusCode = error && typeof error === 'object' && 'statusCode' in error
    ? (error.statusCode as number)
    : 500

  const message = error && typeof error === 'object' && 'message' in error
    ? String(error.message)
    : 'Internal Server Error'

  reply.status(statusCode).send({
    error: 'Internal Server Error',
    message,
    statusCode,
  })
})

const start = async () => {
  try {
    await fastify.listen({ port: PORT, host: HOST })
    console.log(
      `✅ SugarCoach BFF listening on http://${HOST}:${PORT}`
    )
    console.log(`📍 Environment: ${process.env.NODE_ENV || 'development'}`)
  } catch (err) {
    fastify.log.error(err)
    process.exit(1)
  }
}

start()
