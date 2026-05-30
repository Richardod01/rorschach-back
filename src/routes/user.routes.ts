import { Router } from 'express';
import { getDoctores, getPacientes, createDoctor, createPaciente } from '../controllers/user.controller';
import { authenticate, requireRole } from '../middlewares/auth.middleware';
import { validateSchema } from '../middlewares/validate.middleware';
import { RegisterDoctorSchema } from '../dtos/auth.dto';
import { CreatePacienteSchema } from '../dtos/user.dto';

const router = Router();

// Endpoints protegidos
router.use(authenticate);

// Solo ADMIN puede ver doctores y crear usuarios (ej: doctores)
router.get('/doctores', requireRole(['ADMIN']), getDoctores);
router.post('/create-doctor', requireRole(['ADMIN']), validateSchema(RegisterDoctorSchema), createDoctor);

// DOCTOR puede ver pacientes y crear pacientes
router.get('/pacientes', requireRole(['DOCTOR']), getPacientes);
router.post('/create-paciente', requireRole(['DOCTOR']), validateSchema(CreatePacienteSchema), createPaciente);

export default router;
