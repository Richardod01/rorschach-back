import { Router } from 'express';
import { 
  crearTest, 
  actualizarEstadoTest, 
  guardarRespuesta, 
  evaluarTest, 
  obtenerTestsPorUsuario 
} from '../controllers/test.controller';
import { authenticate, requireRole } from '../middlewares/auth.middleware';

const router = Router();

// Proteger todas las rutas de test
router.use(authenticate);

// Listar tests del doctor o paciente (dependiendo del token)
router.get('/', obtenerTestsPorUsuario);

// Doctor asigna un test a un paciente
router.post('/asignar', requireRole(['DOCTOR']), crearTest);

// Actualizar estado del test (Doctor o sistema) a 'PROCESO' ('en_aplicacion')
router.put('/:testId/status', requireRole(['DOCTOR']), actualizarEstadoTest);

// Guardar respuestas de láminas (Generalmente desde la app en 'PROCESO')
router.post('/:testId/respuestas', requireRole(['DOCTOR', 'PACIENTE']), guardarRespuesta);

// Doctor evalúa el test (Cambia status a EVALUADO y guarda conclusión)
router.put('/:testId/evaluar', requireRole(['DOCTOR']), evaluarTest);

export default router;
