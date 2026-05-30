import { Request, Response } from 'express';
import { UserService } from '../services/user.service';
import { AuthService } from '../services/auth.service';

export const getDoctores = async (req: Request, res: Response): Promise<void> => {
  try {
    const doctores = await UserService.getDoctores();
    res.status(200).json(doctores);
  } catch (error: any) {
    res.status(500).json({ message: 'Error al obtener doctores', error: error.message });
  }
};

export const getPacientes = async (req: Request, res: Response): Promise<void> => {
  try {
    // Si el que consulta es un DOCTOR, solo mostramos sus pacientes
    const id_doctor = req.user?.role === 'DOCTOR' ? req.user.id : undefined;
    const pacientes = await UserService.getPacientes(id_doctor);
    res.status(200).json(pacientes);
  } catch (error: any) {
    res.status(500).json({ message: 'Error al obtener pacientes', error: error.message });
  }
};

export const createDoctor = async (req: Request, res: Response): Promise<void> => {
  try {
    // ADMIN crea doctor
    const newUser = await AuthService.registerDoctor(req.body);
    res.status(201).json({ message: 'Doctor creado exitosamente', user: newUser });
  } catch (error: any) {
    res.status(400).json({ message: 'Error al crear doctor', error: error.message });
  }
};

export const createPaciente = async (req: Request, res: Response): Promise<void> => {
  try {
    // DOCTOR crea paciente
    const id_doctor = req.user?.id; // asumiendo que el middleware auth inyecta req.user
    if (!id_doctor) {
      res.status(401).json({ message: 'ID de doctor no encontrado en el token' });
      return;
    }
    const newUser = await UserService.createPaciente(req.body, id_doctor);
    res.status(201).json({ message: 'Paciente creado exitosamente', user: newUser });
  } catch (error: any) {
    res.status(400).json({ message: 'Error al crear paciente', error: error.message });
  }
};
