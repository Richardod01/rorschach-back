import { prisma } from "../database/prisma";
import bcrypt from "bcrypt";

export class DoctorService {
  static async getDoctores() {
    return prisma.usuarios.findMany({
      where: { rol: "DOCTOR" },
      include: { doctores: true },
    });
  }

  static async registerDoctor(data: any) {
    const {
      email,
      password,
      nombres,
      apellido_paterno,
      apellido_materno,
      cedula_profesional,
      especialidad,
    } = data;

    const existingUser = await prisma.usuarios.findUnique({
      where: { email },
    });

    if (existingUser) {
      throw new Error("El correo ya está en uso");
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    // Transacción anidada: Crea el usuario y el doctor vinculado
    const newUser = await prisma.usuarios.create({
      data: {
        uuid: crypto.randomUUID(),
        email,
        password: hashedPassword,
        rol: "DOCTOR",
        doctores: {
          create: {
            uuid: crypto.randomUUID(),
            nombres,
            apellido_paterno,
            apellido_materno,
            cedula_profesional,
            especialidad,
          },
        },
      },
      include: {
        doctores: true, 
      },
    });

    const { password: _, ...userWithoutPassword } = newUser;
    return userWithoutPassword;
  }
}
