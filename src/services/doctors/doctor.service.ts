import { prisma } from "../../database/prisma";
import bcrypt from "bcrypt";
import { RegisterDoctorDto, UpdateDoctorDto } from "../../dtos/doctor/doctor.dto";

export class DoctorService {
  
  static async getDoctores() {
    return prisma.usuarios.findMany({
      where: { rol: "DOCTOR" },
      include: { doctores: true },
    });
  }

  static async registerDoctor(data: RegisterDoctorDto) {  
    const {
      email,
      password,
      nombres,
      apellido_paterno,
      apellido_materno,
      cedula_profesional,
      especialidad,
      telefono,
    } = data;

    const existingUser = await prisma.usuarios.findUnique({
      where: { email },
    });

    if (existingUser) {
      throw new Error("El correo ya está en uso");
    }

    const hashedPassword = await bcrypt.hash(password, 10);

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
            telefono,
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

  static async getDoctorByUuid(uuid: string, id_usuario_sesion?: number) {
    const whereClause: any = { 
      rol: "DOCTOR",
      doctores: {
        uuid: uuid
      }
    };

    if (id_usuario_sesion) {
      whereClause.id_usuario = id_usuario_sesion;
    }

    const user = await prisma.usuarios.findFirst({
      where: whereClause,
      include: { doctores: true },
    });

    if (!user) {
      throw new Error("Doctor no encontrado");
    }

    return user.doctores;
  }

  static async updateDoctor(uuid: string, data: UpdateDoctorDto, id_usuario_sesion?: number) {
    // Primero validamos que el doctor existe y pertenece a la sesión si aplica
    const doctorTarget = await this.getDoctorByUuid(uuid, id_usuario_sesion);

    if (!doctorTarget) {
      throw new Error("Doctor no encontrado");
    }

    // Actualizamos únicamente la información de la tabla doctores usando el id_doctor 
    // porque uuid no es @unique en el schema de prisma
    const updatedDoctor = await prisma.doctores.update({
      where: { id_doctor: doctorTarget.id_doctor },
      data: {
        nombres: data.nombres,
        apellido_paterno: data.apellido_paterno,
        apellido_materno: data.apellido_materno,
        cedula_profesional: data.cedula_profesional,
        especialidad: data.especialidad,
        telefono: data.telefono,
        direccion: data.direccion,
        updated_at: new Date(),
      },
    });

    return updatedDoctor;
  }
}
