import Fastify from 'fastify'

const fastify = Fastify({
  logger: true,
})

// Health check endpoint
fastify.get('/health', async (_request, _reply) => {
  return { status: 'ok', timestamp: new Date().toISOString() }
})

// API endpoints for glucose measurements
fastify.get('/api/glucose', async (_request, _reply) => {
  // TODO: Implement glucose retrieval from Strapi via GraphQL
  return { measurements: [] }
})

fastify.post('/api/glucose', async (_request, _reply) => {
  // TODO: Implement glucose measurement creation
  // Use validation from @sugarcoach/shared
  return { success: true }
})

// Doctor invite QR validation
fastify.post('/api/verify-doctor-qr', async (_request, _reply) => {
  // TODO: Implement QR verification and doctor linking
  return { verified: false }
})

const start = async () => {
  try {
    await fastify.listen({ port: 3001, host: '0.0.0.0' })
    console.log('BFF Server listening on http://0.0.0.0:3001')
  } catch (err) {
    fastify.log.error(err)
    process.exit(1)
  }
}

start()
