import { z } from 'zod';

// Glucose measurement schema and type
export const GlucoseMeasurementSchema = z.object({
  value: z.number().positive('Glucose value must be positive'),
  unit: z.enum(['mg/dL', 'mmol/L']),
  timestamp: z.date().or(z.string().datetime()),
  notes: z.string().optional(),
});

export type GlucoseMeasurement = z.infer<typeof GlucoseMeasurementSchema>;

// Doctor invite QR schema and type
export const DoctorInviteQrSchema = z.object({
  action: z.literal('SUGARCOACH_DOCTOR_LINK'),
  inviteCode: z.string().min(1, 'Invite code is required'),
  doctorId: z.string().uuid('Doctor ID must be a valid UUID'),
  expiresAt: z.date().or(z.string().datetime()),
});

export type DoctorInviteQr = z.infer<typeof DoctorInviteQrSchema>;

// Export validation functions
export const validateGlucoseMeasurement = (data: unknown) => {
  return GlucoseMeasurementSchema.parse(data);
};

export const validateDoctorInviteQr = (data: unknown) => {
  return DoctorInviteQrSchema.parse(data);
};
