import { Router } from "express";
import { validateSchema } from "../middlewares/validate.middleware";
import { RegisterDoctorSchema } from "../dtos/doctor/doctor.dto";
import { authenticate, requireRole } from "../middlewares/auth.middleware";
import { createDoctor, getDoctores } from "../controllers/doctors/doctor.controller";

const router = Router();

// Endpoints protegidos
router.use(authenticate);

router.get("/doctores", requireRole(["ADMIN"]), getDoctores);
router.post("/register-doctor", validateSchema(RegisterDoctorSchema), createDoctor);

export default router;
