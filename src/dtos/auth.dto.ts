import { z } from 'zod';

export const LoginSchema = z.object({
  body: z.object({
    email: z.string().email('Debe ser un correo electrónico válido'),
    password: z.string().min(6, 'La contraseña debe tener al menos 6 caracteres'),
  }),
});

export const RegisterDoctorSchema = z.object({
  body: z.object({
    email: z.string().email('Debe ser un correo electrónico válido'),
    password: z.string().min(6, 'La contraseña debe tener al menos 6 caracteres'),
    nombres: z.string().min(1, 'El nombre es requerido'),
    apellido_paterno: z.string().min(1, 'El apellido paterno es requerido'),
    apellido_materno: z.string().optional(),
    cedula_profesional: z.string().optional(),
    especialidad: z.string().optional(),
  }),
});

export const RegisterAdminSchema = z.object({
  body: z.object({
    email: z.string().email("Debe ser un correo electrónico válido"),
    password: z
      .string()
      .min(6, "La contraseña debe tener al menos 6 caracteres"),
  }),
});
