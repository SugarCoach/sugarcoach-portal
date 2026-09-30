import { FastifyInstance, FastifyRequest, FastifyReply } from 'fastify'
import fp from 'fastify-plugin'
import * as admin from 'firebase-admin'

declare module 'fastify' {
  interface FastifyRequest {
    user?: {
      uid: string
      email?: string
      emailVerified: boolean
    }
  }
}

// Initialize Firebase Admin if not already initialized
if (!admin.apps.length) {
  const serviceAccountKey = process.env.FIREBASE_SERVICE_ACCOUNT_KEY

  if (!serviceAccountKey) {
    throw new Error('FIREBASE_SERVICE_ACCOUNT_KEY environment variable is required')
  }

  try {
    const serviceAccount = typeof serviceAccountKey === 'string'
      ? JSON.parse(serviceAccountKey)
      : serviceAccountKey

    admin.initializeApp({
      credential: admin.credential.cert(serviceAccount as admin.ServiceAccount),
    })
  } catch (error) {
    throw new Error(`Failed to initialize Firebase Admin: ${error instanceof Error ? error.message : 'Unknown error'}`)
  }
}

export const authPlugin = fp(
  async (fastify: FastifyInstance) => {
    // Hook to verify Bearer token before each request
    fastify.addHook('onRequest', async (request: FastifyRequest, reply: FastifyReply) => {
      // Skip auth for health check endpoint
      if (request.url === '/health') {
        return
      }

      try {
        const authHeader = request.headers.authorization

        if (!authHeader || !authHeader.startsWith('Bearer ')) {
          return reply.status(401).send({
            error: 'Unauthorized',
            message: 'Missing or invalid Authorization header',
          })
        }

        const token = authHeader.slice(7) // Remove 'Bearer ' prefix

        // Verify the token with Firebase
        const decodedToken = await admin.auth().verifyIdToken(token)

        // Inject user info into request
        request.user = {
          uid: decodedToken.uid,
          email: decodedToken.email,
          emailVerified: decodedToken.email_verified || false,
        }

        // TODO(SLOT C): agregar verificación de custom claim doctorProfileId una vez que
        // Firebase tenga los claims configurados. Ejemplo:
        // if (!decodedToken.doctorProfileId) {
        //   return reply.status(403).send({ error: 'Not a verified doctor' })
        // }
        // req.user.doctorProfileId = decodedToken.doctorProfileId
      } catch (error) {
        return reply.status(401).send({
          error: 'Unauthorized',
          message: error instanceof Error ? error.message : 'Token verification failed',
        })
      }
    })
  },
  {
    name: 'auth-plugin',
  }
)

export default authPlugin
