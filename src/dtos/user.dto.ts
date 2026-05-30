import { z } from "zod";

export const CreatePacienteSchema = z.object({
  body: z.object({
    email: z.string().email("Debe ser un correo electrónico válido"),
    password: z
      .string()
      .min(6, "La contraseña debe tener al menos 6 caracteres"),
    nombres: z.string().min(1, "El nombre es requerido"),
    apellido_paterno: z.string().min(1, "El apellido paterno es requerido"),
    apellido_materno: z.string().optional(),
    fecha_nacimiento: z.string().optional(),
    sexo: z.enum(["MASCULINO", "FEMENINO", "OTRO"]).optional(),
    telefono: z.string().optional(),
    ocupacion: z.string().optional(),
  }),
});
