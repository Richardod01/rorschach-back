import { Request, Response } from "express";
import { AuthService } from "../../services/auth.service";

export const registerAdmin = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const newUser = await AuthService.registerAdmin(req.body);
    res.status(201).json({
      message: "Administrador registrado exitosamente",
      user: newUser,
    });
  } catch (error: any) {
    res
      .status(400)
      .json({ message: "Error al registrar", error: error.message });
  }
};

export const login = async (req: Request, res: Response): Promise<void> => {
  try {
    const data = await AuthService.login(req.body);
    res.status(200).json({
      message: "Login exitoso",
      code: 0,
      ...data,
    });
  } catch (error: any) {
    res
      .status(401)
      .json({ message: "Error en el login", error: error.message });
  }
};
