import { FastifyRequest, FastifyReply } from 'fastify'

/**
 * Middleware de autorización por vínculo médico-paciente.
 *
 * TODO(SLOT C + SLOT E): implementar antes del Hito 1.
 *
 * Regla: un médico solo puede acceder a datos de un paciente si existe
 * un doctor-patient-link con status='active' entre ambos en Strapi.
 *
 * Debe:
 * 1. Leer patientId de req.params.patientId
 * 2. Leer doctorId de req.user.doctorProfileId (custom claim Firebase)
 * 3. Consultar Strapi: findActiveLink(doctorId, patientId)
 * 4. Si no existe → reply.status(403).send({ error: 'Forbidden' })
 *    (no distinguir "no existe" de "no autorizado" — seguridad)
 * 5. Registrar audit log de forma async (nunca bloquear la respuesta):
 *    auditService.log({ doctorId, patientId, action, timestamp }).catch(() => {})
 *
 * Este archivo requiere code review de Isabel antes de cualquier merge a develop.
 */
export async function authorizePatient(
  _req: FastifyRequest<{ Params: { patientId: string } }>,
  _reply: FastifyReply
): Promise<void> {
  // TODO: implementar — ver comentario arriba
}
