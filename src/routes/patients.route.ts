import { Router } from "express";

import { authenticate, requireRole } from "../middlewares/auth.middleware";
import { validateSchema } from "../middlewares/validate.middleware";
import {
  CreatePacienteSchema,
  UpdatePatientSchema,
} from "../dtos/patient/patient.dto";
import {
  getPacientes,
  createPaciente,
  getPacienteByUuid,
  updatePaciente,
} from "../controllers/patients/patient.controller";

const router = Router();

// Endpoints protegidos
router.use(authenticate);

// DOCTOR puede ver pacientes y crear pacientes
router.get("/get-all-patients", requireRole(["DOCTOR", "ADMIN"]), getPacientes);
router.get(
  "/get-patient/:uuid",
  requireRole(["DOCTOR", "ADMIN"]),
  getPacienteByUuid,
);
router.post(
  "/create-patient",
  requireRole(["DOCTOR", "ADMIN"]),
  validateSchema(CreatePacienteSchema),
  createPaciente,
);

router.put(
  "/update-patient/:uuid",
  requireRole(["DOCTOR", "ADMIN"]),
  validateSchema(UpdatePatientSchema),
  updatePaciente,
);

export default router;
