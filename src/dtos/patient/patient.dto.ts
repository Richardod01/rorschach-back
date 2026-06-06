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
    direccion: z.string().optional(),
    motivo_de_consulta: z.string().optional(),
    observaciones_iniciales: z.string().optional(),
    condiciones_medicas: z.string().optional(),
    medicamentos_actuales: z.string().optional(),
  }),
});

export type CreatePacienteSchema = z.infer<typeof CreatePacienteSchema>;

export const UpdatePatientSchema = z.object({
  body: z.object({
    nombres: z.string().min(1, "El nombre es requerido").optional(),
    apellido_paterno: z
      .string()
      .min(1, "El apellido paterno es requerido")
      .optional(),
    apellido_materno: z.string().optional(),
    fecha_nacimiento: z.string().optional(),
    sexo: z.enum(["MASCULINO", "FEMENINO", "OTRO"]).optional(),
    telefono: z.string().optional(),
    ocupacion: z.string().optional(),
    direccion: z.string().optional(),
    motivo_de_consulta: z.string().optional(),
    observaciones_iniciales: z.string().optional(),
    condiciones_medicas: z.string().optional(),
    medicamentos_actuales: z.string().optional(),
  }),
});

export type UpdatePatientDto = z.infer<typeof UpdatePatientSchema>["body"];
