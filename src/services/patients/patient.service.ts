import bcrypt from "bcrypt";
import { prisma } from "../../database/prisma";
import crypto from "crypto";
import { UpdatePatientDto } from "../../dtos/patient/patient.dto";

export class PatientService {
  static async createPaciente(data: any, id_doctor: number) {
    const {
      email,
      password,
      nombres,
      apellido_paterno,
      apellido_materno,
      fecha_nacimiento,
      sexo,
      telefono,
      ocupacion,
    } = data;

    const existingUser = await prisma.usuarios.findUnique({
      where: { email },
    });

    if (existingUser) {
      throw new Error("El correo ya está en uso");
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    // Validar formato de fecha si viene
    let fechaNac = null;
    if (fecha_nacimiento) {
      fechaNac = new Date(fecha_nacimiento);
    }

    const newUser = await prisma.usuarios.create({
      data: {
        uuid: crypto.randomUUID(),
        email,
        password: hashedPassword,
        rol: "PACIENTE",
        pacientes: {
          create: {
            uuid: crypto.randomUUID(),
            id_doctor: id_doctor,
            nombres,
            apellido_paterno,
            apellido_materno,
            fecha_nacimiento: fechaNac,
            sexo,
            telefono,
            ocupacion,
          },
        },
      },
      include: {
        pacientes: true,
      },
    });

    const { pacientes: dataPatient } = newUser;

    return dataPatient;
  }

  static async getPacientes(id_doctor?: number) {
    const whereClause: any = { rol: "PACIENTE" };

    if (id_doctor) {
      whereClause.pacientes = {
        id_doctor: id_doctor,
      };
    }

    return prisma.usuarios.findMany({
      where: whereClause,
      include: { pacientes: true },
    });
  }

  static async getPacienteByUuid(uuid: string, id_doctor?: number) {
    const whereClause: any = { uuid, rol: "PACIENTE" };

    if (id_doctor) {
      whereClause.pacientes = {
        id_doctor: id_doctor,
      };
    }

    const patient = await prisma.usuarios.findFirst({
      where: whereClause,
      include: { pacientes: true },
    });

    if (!patient) {
      throw new Error("Paciente no encontrado");
    }

    const { pacientes: dataPatient } = patient;

    return dataPatient;
  }

  static async updatePaciente(
    uuid: string,
    data: UpdatePatientDto,
    id_doctor?: number,
  ) {
    const patient = await this.getPacienteByUuid(uuid, id_doctor);

    if (!patient) {
      throw new Error("Paciente no encontrado");
    }

    const updatedPatient = await prisma.pacientes.update({
      where: { id_paciente: patient.id_paciente },
      data: {
        nombres: data.nombres,
        apellido_paterno: data.apellido_paterno,
        apellido_materno: data.apellido_materno,
        fecha_nacimiento: data.fecha_nacimiento,
        sexo: data.sexo,
        telefono: data.telefono,
        ocupacion: data.ocupacion,
        updated_at: new Date(),
        direccion: data.direccion,
        motivo_de_consulta: data.motivo_de_consulta,
        observaciones_iniciales: data.observaciones_iniciales,
        condiciones_medicas: data.condiciones_medicas,
        medicamentos_actuales: data.medicamentos_actuales,
      },
    });

    return updatedPatient;
  }
}
