import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { prisma } from "../../database/prisma";
import crypto from "crypto";

const JWT_SECRET =
  process.env.JWT_SECRET || "super_secret_key_change_me_in_production";

export class AuthService {
  static async registerAdmin(data: any) {
    const { email, password } = data;

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
        rol: "ADMIN",
      },
    });

    const { password: _, ...userWithoutPassword } = newUser;
    return userWithoutPassword;
  }


  static async login(data: any) {
    const { email, password } = data;

    const user = await prisma.usuarios.findUnique({
      where: { email },
    });

    if (!user || !user.password) {
      throw new Error("Credenciales inválidas");
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      throw new Error("Credenciales inválidas");
    }

    const token = jwt.sign(
      {
        id: user.id_usuario,
        uuid: user.uuid,
        email: user.email,
        role: user.rol,
      },
      JWT_SECRET,
      { expiresIn: "1d" },
    );

    const { password: _, ...userWithoutPassword } = user;

    return {
      user: userWithoutPassword,
      token,
    };
  }
}
