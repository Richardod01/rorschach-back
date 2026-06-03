import bcrypt from 'bcrypt';
import { prisma } from '../database/prisma';
import crypto from 'crypto';

export class UserService {
  static async createPaciente(data: any, id_doctor: number) {
    const { email, password, nombres, apellido_paterno, apellido_materno, fecha_nacimiento, sexo, telefono, ocupacion } = data;

    const existingUser = await prisma.usuarios.findUnique({
      where: { email },
    });

    if (existingUser) {
      throw new Error('El correo ya está en uso');
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
        rol: 'PACIENTE',
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

    const { password: _, ...userWithoutPassword } = newUser;
    return userWithoutPassword;
  }



  static async getPacientes(id_doctor?: number) {
    const whereClause: any = { rol: 'PACIENTE' };
    
    // Si se pasa un id_doctor, filtramos los pacientes por ese doctor
    if (id_doctor) {
        whereClause.pacientes = {
            id_doctor: id_doctor
        };
    }

    return prisma.usuarios.findMany({
      where: whereClause,
      include: { pacientes: true },
    });
  }
}
