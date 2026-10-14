import { FastifyInstance, FastifyRequest, FastifyReply } from 'fastify'

interface GlucoseMeasurement {
  id: string
  value: number
  unit: 'mg/dL' | 'mmol/L'
  timestamp: string
  notes?: string
}

// Mock data for development
const mockMeasurements: GlucoseMeasurement[] = [
  {
    id: '1',
    value: 120,
    unit: 'mg/dL',
    timestamp: new Date(Date.now() - 1000 * 60 * 5).toISOString(),
    notes: 'After breakfast',
  },
  {
    id: '2',
    value: 95,
    unit: 'mg/dL',
    timestamp: new Date(Date.now() - 1000 * 60 * 30).toISOString(),
  },
  {
    id: '3',
    value: 140,
    unit: 'mg/dL',
    timestamp: new Date(Date.now() - 1000 * 60 * 60).toISOString(),
    notes: 'Before lunch',
  },
]

export async function glucoseRoutes(fastify: FastifyInstance) {
  // GET /api/v1/glucose - Get glucose measurements
  fastify.get<{ Querystring: { limit?: string; offset?: string } }>(
    '/measurements',
    async (_request: FastifyRequest, reply: FastifyReply) => {
      try {
        return reply.status(200).send({
          success: true,
          data: mockMeasurements,
          pagination: {
            total: mockMeasurements.length,
            limit: 10,
            offset: 0,
          },
        })
      } catch {
        return reply.status(500).send({
          error: 'Internal server error',
          message: 'Failed to fetch glucose measurements',
        })
      }
    }
  )

  // POST /api/v1/glucose - Create glucose measurement
  fastify.post<{ Body: { value: number; unit: string; notes?: string } }>(
    '/measurements',
    async (request: FastifyRequest<{ Body: { value: number; unit: string; notes?: string } }>, reply: FastifyReply) => {
      try {
        const { value, unit, notes } = request.body as { value: number; unit: string; notes?: string }

        if (!value || !unit) {
          return reply.status(400).send({
            error: 'Bad request',
            message: 'value and unit are required',
          })
        }

        const newMeasurement: GlucoseMeasurement = {
          id: Date.now().toString(),
          value,
          unit: unit as 'mg/dL' | 'mmol/L',
          timestamp: new Date().toISOString(),
          notes,
        }

        mockMeasurements.unshift(newMeasurement)

        return reply.status(201).send({
          success: true,
          data: newMeasurement,
          message: 'Glucose measurement created successfully',
        })
      } catch {
        return reply.status(500).send({
          error: 'Internal server error',
          message: 'Failed to create glucose measurement',
        })
      }
    }
  )

  // GET /api/v1/glucose/:id - Get specific measurement
  fastify.get<{ Params: { id: string } }>(
    '/measurements/:id',
    async (request: FastifyRequest, reply: FastifyReply) => {
      try {
        const { id } = request.params as { id: string }
        const measurement = mockMeasurements.find((m) => m.id === id)

        if (!measurement) {
          return reply.status(404).send({
            error: 'Not found',
            message: 'Glucose measurement not found',
          })
        }

        return reply.status(200).send({
          success: true,
          data: measurement,
        })
      } catch {
        return reply.status(500).send({
          error: 'Internal server error',
          message: 'Failed to fetch glucose measurement',
        })
      }
    }
  )
}
