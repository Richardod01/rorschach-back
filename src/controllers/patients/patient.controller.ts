import { Request, Response } from "express";
import { PatientService } from "../../services/patients/patient.service";

export const getPacientes = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    // Si el que consulta es un DOCTOR, solo mostramos sus pacientes
    const id_doctor = req.user?.role === "DOCTOR" ? req.user.id : undefined;
    const pacientes = await PatientService.getPacientes(id_doctor);

    if (pacientes.length === 0) {
      res.status(200).json({
        message: "No tienes pacientes registrados",
        code: -1,
        data: [],
      });
      return;
    }

    res.status(200).json({
      message: "Pacientes obtenidos exitosamente",
      code: 1,
      data: pacientes,
    });
  } catch (error: any) {
    res
      .status(500)
      .json({ message: "Error al obtener pacientes", error: error.message });
  }
};

export const createPaciente = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    // DOCTOR crea paciente
    const id_doctor = req.user?.id;
    if (!id_doctor) {
      res
        .status(401)
        .json({ message: "ID de doctor no encontrado en el token" });
      return;
    }
    const newUser = await PatientService.createPaciente(req.body, id_doctor);
    res.status(201).json({
      message: "Paciente creado exitosamente",
      code: 1,
      patient: newUser,
    });
  } catch (error: any) {
    res.status(400).json({
      message: "Error al crear paciente",
      code: -1,
      error: error.message,
    });
  }
};

export const getPacienteByUuid = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const { uuid } = req.params;
    const id_doctor = req.user?.role === "DOCTOR" ? req.user.id : undefined;

    const paciente = await PatientService.getPacienteByUuid(
      uuid as string,
      id_doctor,
    );

    res.status(200).json({
      message: "Paciente obtenido exitosamente",
      code: 1,
      data: paciente,
    });
  } catch (error: any) {
    if (error.message === "Paciente no encontrado") {
      res.status(404).json({ code: -1, message: error.message });
    } else {
      res.status(500).json({
        code: -1,
        message: "Error al obtener paciente",
        error: error.message,
      });
    }
  }
};

export const updatePaciente = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const { uuid } = req.params;
    // Si es DOCTOR, pasamos el id_doctor para asegurar que sea de él.
    // Si es ADMIN, pasamos undefined para que pueda editar a cualquiera.
    const id_doctor = req.user?.role === "DOCTOR" ? req.user.id : undefined;

    const updatedPatient = await PatientService.updatePaciente(
      uuid as string,
      req.body,
      id_doctor,
    );

    res.status(200).json({
      message: "Paciente actualizado exitosamente",
      code: 1,
      patient: updatedPatient,
    });
  } catch (error: any) {
    if (error.message === "Paciente no encontrado") {
      res.status(404).json({ code: -1, message: error.message });
    } else {
      res.status(500).json({
        code: -1,
        message: "Error al actualizar paciente",
        error: error.message,
      });
    }
  }
};
