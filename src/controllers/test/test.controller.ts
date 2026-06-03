import { Request, Response } from 'express';
import { RespuestaModel } from '../../models/respuesta.model';
import { TestModel } from '../../models/test.model';


export const crearTest = async (req: Request, res: Response): Promise<void> => {
  try {
    const doctorId = req.user?.id;
    const { paciente_id } = req.body;

    if (!doctorId) {
      res.status(401).json({ message: 'No autorizado' });
      return;
    }

    const newTest = await TestModel.create(doctorId, paciente_id);
    res.status(201).json({ message: 'Test asignado', test: newTest });
  } catch (error: any) {
    res.status(500).json({ message: 'Error al crear el test', error: error.message });
  }
};

export const actualizarEstadoTest = async (req: Request, res: Response): Promise<void> => {
  try {
    const { testId } = req.params;
    const { status } = req.body; // Ej: 'PROCESO' o 'en_aplicacion' (aunque el schema dice PROCESO)

    const updatedTest = await TestModel.updateStatus(Number(testId), status);
    if (!updatedTest) {
      res.status(404).json({ message: 'Test no encontrado' });
      return;
    }

    res.status(200).json({ message: 'Estado del test actualizado', test: updatedTest });
  } catch (error: any) {
    res.status(500).json({ message: 'Error al actualizar el test', error: error.message });
  }
};

export const guardarRespuesta = async (req: Request, res: Response): Promise<void> => {
  try {
    const { testId } = req.params;
    const { numero_lamina, texto, emocion, confianza } = req.body;

    const respuesta = await RespuestaModel.create({
      test_id: Number(testId),
      numero_lamina,
      texto,
      emocion,
      confianza
    });

    res.status(201).json({ message: 'Respuesta guardada', respuesta });
  } catch (error: any) {
    res.status(500).json({ message: 'Error al guardar la respuesta', error: error.message });
  }
};

export const evaluarTest = async (req: Request, res: Response): Promise<void> => {
  try {
    const { testId } = req.params;
    const { resultado_doctor } = req.body;

    const testEvaluado = await TestModel.saveEvaluation(Number(testId), resultado_doctor);
    if (!testEvaluado) {
      res.status(404).json({ message: 'Test no encontrado' });
      return;
    }

    res.status(200).json({ message: 'Test evaluado con éxito', test: testEvaluado });
  } catch (error: any) {
    res.status(500).json({ message: 'Error al evaluar el test', error: error.message });
  }
};

export const obtenerTestsPorUsuario = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = req.user?.id;
    const role = req.user?.role;

    if (!userId) {
      res.status(401).json({ message: 'No autorizado' });
      return;
    }

    let tests;
    if (role === 'DOCTOR') {
      tests = await TestModel.findByDoctor(userId);
    } else if (role === 'PACIENTE') {
      tests = await TestModel.findByPaciente(userId);
    } else {
      res.status(403).json({ message: 'Rol no válido para obtener tests' });
      return;
    }

    res.status(200).json(tests);
  } catch (error: any) {
    res.status(500).json({ message: 'Error al obtener tests', error: error.message });
  }
};
