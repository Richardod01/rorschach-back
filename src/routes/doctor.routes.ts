import { Router } from "express";
import { validateSchema } from "../middlewares/validate.middleware";
import { RegisterDoctorSchema, UpdateDoctorSchema } from "../dtos/doctor/doctor.dto";
import { authenticate, requireRole } from "../middlewares/auth.middleware";
import { createDoctor, getDoctorByUuid, getDoctores, updateDoctor } from "../controllers/doctors/doctor.controller";

const router = Router();

// Endpoints protegidos
router.use(authenticate);

router.get("/doctores", requireRole(["ADMIN"]), getDoctores);
router.post("/register-doctor", requireRole(["ADMIN"]), validateSchema(RegisterDoctorSchema), createDoctor);
router.get('/doctor/:uuid', requireRole(['ADMIN', 'DOCTOR']), getDoctorByUuid);
router.put('/update-doctor/:uuid', requireRole(['ADMIN', 'DOCTOR']), validateSchema(UpdateDoctorSchema), updateDoctor);

export default router;
