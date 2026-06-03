import { Router } from 'express';
import { login, registerAdmin } from '../controllers/auth/auth.controller';
import { validateSchema } from '../middlewares/validate.middleware';
import { LoginSchema, RegisterAdminSchema } from '../dtos/auth.dto';

const router = Router();

router.post('/register-admin', validateSchema(RegisterAdminSchema), registerAdmin);
router.post('/login', validateSchema(LoginSchema), login);

export default router;
