import { z } from "zod";
import { Especialidades } from "../../enums/doctor/specialty";

export const RegisterDoctorSchema = z.object({
  body: z.object({
    email: z.string().email("Debe ser un correo electrónico válido"),
    password: z
      .string()
      .min(6, "La contraseña debe tener al menos 6 caracteres"),
    nombres: z.string().min(1, "El nombre es requerido"),
    apellido_paterno: z.string().min(1, "El apellido paterno es requerido"),
    apellido_materno: z.string().optional(),
    cedula_profesional: z
      .string()
      .min(7, "La cédula debe tener al menos 7 caracteres")
      .max(8, "La cédula debe tener máximo 8 caracteres"),
    especialidad: z.enum(Especialidades, {
      message: "Especialidad no válida",
    }),
  }),
});
