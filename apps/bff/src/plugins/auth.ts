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

let firebaseInitialized = false
let firebaseAvailable = false

function initializeFirebase() {
  if (firebaseInitialized) return
  firebaseInitialized = true

  const serviceAccountKey = process.env.FIREBASE_SERVICE_ACCOUNT_KEY
  const isDevelopment = process.env.NODE_ENV === 'development'

  if (!serviceAccountKey) {
    if (isDevelopment) {
      console.log('⏭️  Firebase not configured - running in mock mode (development)')
      // In development, we'll use mock auth
    } else {
      console.warn('⚠️  FIREBASE_SERVICE_ACCOUNT_KEY not set - auth will be disabled')
    }
    return
  }

  try {
    const serviceAccount = typeof serviceAccountKey === 'string'
      ? JSON.parse(serviceAccountKey)
      : serviceAccountKey

    if (admin.apps.length === 0) {
      admin.initializeApp({
        credential: admin.credential.cert(serviceAccount as admin.ServiceAccount),
      })
      firebaseAvailable = true
    }
    console.log('✅ Firebase Admin SDK initialized')
  } catch (error) {
    console.error(`❌ Firebase init failed: ${error instanceof Error ? error.message : 'Unknown error'}`)
  }
}

export const authPlugin = fp(
  async (fastify: FastifyInstance) => {
    // Initialize Firebase on first use
    initializeFirebase()

    // Hook to verify Bearer token before each request
    fastify.addHook('onRequest', async (request: FastifyRequest, reply: FastifyReply) => {
      // Skip auth for health check endpoint
      if (request.url === '/health') {
        return
      }

      try {
        const authHeader = request.headers.authorization

        // If Firebase is not available and we're in development, use mock auth
        if (!firebaseAvailable && process.env.NODE_ENV === 'development') {
          if (!authHeader || !authHeader.startsWith('Bearer ')) {
            // In dev mode without Firebase, create a mock user
            request.user = {
              uid: 'mock-user-dev-' + Date.now(),
              email: 'dev@sugarcoach.local',
              emailVerified: true,
            }
            return
          }

          // Parse mock token format: Bearer mock:<uid>:<email>
          const token = authHeader.slice(7)
          if (token.startsWith('mock:')) {
            const [, uid, email] = token.split(':')
            request.user = {
              uid: uid || 'mock-doctor-dev',
              email: email || 'doctor@sugarcoach.local',
              emailVerified: true,
            }
            return
          }
        }

        // Firebase mode
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
