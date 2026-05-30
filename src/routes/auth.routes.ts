import { Router } from 'express';
import { login, register, registerAdmin } from '../controllers/auth.controller';
import { validateSchema } from '../middlewares/validate.middleware';
import { LoginSchema, RegisterDoctorSchema, RegisterAdminSchema } from '../dtos/auth.dto';

const router = Router();

router.post('/register', validateSchema(RegisterDoctorSchema), register);
router.post('/register-admin', validateSchema(RegisterAdminSchema), registerAdmin);
router.post('/login', validateSchema(LoginSchema), login);

export default router;
