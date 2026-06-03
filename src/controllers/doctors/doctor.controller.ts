import { Request, Response } from "express";
import { DoctorService } from "../../services/doctor.service";

export const getDoctores = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const doctores = await DoctorService.getDoctores();
    
    const data = doctores.map((doc: any) => {
      const doctor = doc.doctores;
      return {
        id_doctor: doctor?.id_doctor,
        uuid: doctor?.uuid,
        nombres: doctor?.nombres,
        apellido_paterno: doctor?.apellido_paterno,
        apellido_materno: doctor?.apellido_materno,
        cedula_profesional: doctor?.cedula_profesional,
        especialidad: doctor?.especialidad,
        created_at: doctor?.created_at,
        updated_at: doctor?.updated_at,
      };
    });

    res.status(200).json({
      message: "doctores obtenidos exitosamente",
      code: 0,
      data
    });
  } catch (error: any) {
    res
      .status(500)
      .json({ message: "Error al obtener doctores", error: error.message });
  }
};

export const createDoctor = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    // ADMIN crea doctor
    const newUser = await DoctorService.registerDoctor(req.body);
    res
      .status(201)
      .json({ message: "Doctor creado exitosamente", user: newUser });
  } catch (error: any) {
    res
      .status(400)
      .json({ message: "Error al crear doctor", error: error.message });
  }
};
