import { Router } from 'express';

import { authenticate, requireRole } from '../middlewares/auth.middleware';
import { validateSchema } from '../middlewares/validate.middleware';
import { CreatePacienteSchema } from '../dtos/user.dto';
import { getPacientes, createPaciente } from '../controllers/patients/patient.controller';

const router = Router();

// Endpoints protegidos
router.use(authenticate);

// DOCTOR puede ver pacientes y crear pacientes
router.get('/pacientes', requireRole(['DOCTOR']), getPacientes);
router.post('/create-paciente', requireRole(['DOCTOR']), validateSchema(CreatePacienteSchema), createPaciente);

export default router;
