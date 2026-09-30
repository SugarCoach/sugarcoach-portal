import { FastifyInstance, FastifyRequest, FastifyReply } from 'fastify'
import { DoctorInviteQrSchema } from '@sugarcoach/shared'
import { queryStrapiGraphQL } from '../services/strapi'
import crypto from 'crypto'

interface DoctorInviteResponse {
  createDoctorInvite?: {
    data: {
      id: string
      attributes: {
        inviteCode: string
        status: string
        expiresAt: string
      }
    }
  }
}

interface VerifyInviteResponse {
  doctorInvites?: {
    data: Array<{
      id: string
      attributes: {
        inviteCode: string
        status: string
        expiresAt: string
        doctor: {
          data: {
            id: string
          }
        }
      }
    }>
  }
}

interface ActivateLinkResponse {
  updateDoctorInvite?: {
    data: {
      id: string
      attributes: {
        status: string
      }
    }
  }
}

// Generate ephemeral invite code (valid for 15 minutes)
function generateInviteCode(): { code: string; expiresAt: Date } {
  const code = crypto.randomBytes(16).toString('hex')
  const expiresAt = new Date(Date.now() + 15 * 60 * 1000) // 15 minutes from now

  return { code, expiresAt }
}

// GraphQL mutation to create doctor invite in Strapi
const CREATE_DOCTOR_INVITE_MUTATION = `
  mutation CreateDoctorInvite($data: DoctorInviteInput!) {
    createDoctorInvite(data: $data) {
      data {
        id
        attributes {
          inviteCode
          status
          expiresAt
          doctor {
            data {
              id
            }
          }
        }
      }
    }
  }
`

// GraphQL query to verify invite code
const VERIFY_INVITE_CODE_QUERY = `
  query VerifyInviteCode($inviteCode: String!) {
    doctorInvites(filters: { inviteCode: { eq: $inviteCode } }) {
      data {
        id
        attributes {
          inviteCode
          status
          expiresAt
          doctor {
            data {
              id
            }
          }
        }
      }
    }
  }
`

// GraphQL mutation to activate patient-doctor link
const ACTIVATE_PATIENT_LINK_MUTATION = `
  mutation ActivatePatientLink($inviteId: ID!, $patientId: ID!) {
    updateDoctorInvite(id: $inviteId, data: { status: "active", patient: $patientId }) {
      data {
        id
        attributes {
          status
        }
      }
    }
  }
`

export async function linksRoutes(fastify: FastifyInstance) {
  // POST /api/v1/doctor/invites - Create invite code for patient
  fastify.post<{ Body: Record<string, unknown> }>(
    '/doctor/invites',
    async (request: FastifyRequest, reply: FastifyReply) => {
      try {
        // Verify user is authenticated and is a doctor
        if (!request.user) {
          return reply.status(401).send({ error: 'Unauthorized' })
        }

        // Generate ephemeral invite code
        const { code, expiresAt } = generateInviteCode()

        // Validate against schema
        const inviteData = DoctorInviteQrSchema.parse({
          action: 'SUGARCOACH_DOCTOR_LINK',
          inviteCode: code,
          doctorId: request.user.uid,
          expiresAt,
        })

        // Create invite in Strapi
        const expiresAtStr = typeof inviteData.expiresAt === 'string'
          ? inviteData.expiresAt
          : inviteData.expiresAt.toISOString()

        await queryStrapiGraphQL<DoctorInviteResponse>(CREATE_DOCTOR_INVITE_MUTATION, {
          data: {
            inviteCode: inviteData.inviteCode,
            doctor: request.user.uid,
            status: 'pending',
            expiresAt: expiresAtStr,
          },
        })

        return reply.status(201).send({
          success: true,
          data: {
            inviteCode: code,
            expiresAt,
            action: 'SUGARCOACH_DOCTOR_LINK',
          },
        })
      } catch (error) {
        console.error('Error creating doctor invite:', error)

        if (error instanceof Error && error.message.includes('validation')) {
          return reply.status(400).send({
            error: 'Invalid invite data',
            message: error.message,
          })
        }

        return reply.status(500).send({
          error: 'Internal server error',
          message: 'Failed to create invite',
        })
      }
    }
  )

  // POST /api/v1/patient/links/accept - Accept doctor invite via QR code
  fastify.post<{ Body: { inviteCode?: string } }>(
    '/patient/links/accept',
    async (request: FastifyRequest, reply: FastifyReply) => {
      try {
        // Verify user is authenticated and is a patient
        if (!request.user) {
          return reply.status(401).send({ error: 'Unauthorized' })
        }

        const body = request.body as { inviteCode?: string }
        const { inviteCode } = body

        if (!inviteCode || typeof inviteCode !== 'string') {
          return reply.status(400).send({
            error: 'Bad request',
            message: 'inviteCode is required',
          })
        }

        // Verify invite code exists and hasn't expired
        const inviteResult = await queryStrapiGraphQL<VerifyInviteResponse>(
          VERIFY_INVITE_CODE_QUERY,
          { inviteCode }
        )

        const invites = inviteResult?.doctorInvites?.data || []

        if (invites.length === 0) {
          return reply.status(404).send({
            error: 'Not found',
            message: 'Invalid or expired invite code',
          })
        }

        const invite = invites[0]
        const expiresAtDate = typeof invite.attributes.expiresAt === 'string'
          ? new Date(invite.attributes.expiresAt)
          : invite.attributes.expiresAt

        if (expiresAtDate < new Date()) {
          return reply.status(410).send({
            error: 'Gone',
            message: 'Invite code has expired',
          })
        }

        if (invite.attributes.status !== 'pending') {
          return reply.status(409).send({
            error: 'Conflict',
            message: 'Invite has already been used',
          })
        }

        // Activate the link
        await queryStrapiGraphQL<ActivateLinkResponse>(
          ACTIVATE_PATIENT_LINK_MUTATION,
          {
            inviteId: invite.id,
            patientId: request.user.uid,
          }
        )

        return reply.status(200).send({
          success: true,
          message: 'Patient-doctor link activated',
          data: {
            doctorId: invite.attributes.doctor.data.id,
            patientId: request.user.uid,
            status: 'active',
          },
        })
      } catch (error) {
        console.error('Error accepting doctor invite:', error)

        return reply.status(500).send({
          error: 'Internal server error',
          message: 'Failed to accept invite',
        })
      }
    }
  )
}
