import { Request, Response } from "express";
import { DoctorService } from "../../services/doctors/doctor.service";

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
      data,
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

export const getDoctorByUuid = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const { uuid } = req.params;
    const id_doctor = req.user?.role === "DOCTOR" ? req.user.id : undefined;

    const data = await DoctorService.getDoctorByUuid(uuid as string, id_doctor);

    res.status(200).json({
      message: "doctor obtenido exitosamente",
      code: 0,
      data: {
        id_doctor: data?.id_doctor,
        uuid: data?.uuid,
        nombres: data?.nombres,
        apellido_paterno: data?.apellido_paterno,
        apellido_materno: data?.apellido_materno,
        cedula_profesional: data?.cedula_profesional,
        especialidad: data?.especialidad,
        telefono: data?.telefono,
        direccion: data?.direccion,
        created_at: data?.created_at,
        updated_at: data?.updated_at,
        fullName: `${data?.nombres} ${data?.apellido_paterno} ${data?.apellido_materno}`,
      },
    });
  } catch (error: any) {
    if (error.message === "Doctor no encontrado") {
      res.status(404).json({ message: error.message });
    } else {
      res
        .status(500)
        .json({ message: "Error al obtener doctor", error: error.message });
    }
  }
};

export const updateDoctor = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const { uuid } = req.params;
    const id_doctor = req.user?.role === "DOCTOR" ? req.user.id : undefined;

    await DoctorService.updateDoctor(uuid as string, req.body, id_doctor);

    res.status(200).json({
      message: "Doctor actualizado exitosamente",
      code: 0,
    });
  } catch (error: any) {
    if (error.message === "Doctor no encontrado") {
      res.status(404).json({ message: "Doctor no encontrado", code: -1 });
    } else {
      res
        .status(400)
        .json({ message: "Error al actualizar doctor", code: -1 });
    }
  }
};
