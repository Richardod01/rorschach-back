import pool from '../config/db';

export interface Test {
  id?: number;
  doctor_id: number;
  paciente_id: number;
  status: 'ASIGNADO' | 'PROCESO' | 'CONTESTADO' | 'EVALUADO';
  resultado_doctor?: string;
  created_at?: Date;
  updated_at?: Date;
}

export class TestModel {
  static async create(doctorId: number, pacienteId: number): Promise<Test> {
    const result = await pool.query(
      'INSERT INTO tests (doctor_id, paciente_id, status) VALUES ($1, $2, $3) RETURNING *',
      [doctorId, pacienteId, 'ASIGNADO']
    );
    return result.rows[0];
  }

  static async findById(id: number): Promise<Test | null> {
    const result = await pool.query('SELECT * FROM tests WHERE id = $1', [id]);
    if (result.rows.length === 0) return null;
    return result.rows[0];
  }

  static async updateStatus(id: number, status: string): Promise<Test | null> {
    const result = await pool.query(
      'UPDATE tests SET status = $1, updated_at = CURRENT_TIMESTAMP WHERE id = $2 RETURNING *',
      [status, id]
    );
    if (result.rows.length === 0) return null;
    return result.rows[0];
  }

  static async saveEvaluation(id: number, resultadoDoctor: string): Promise<Test | null> {
    const result = await pool.query(
      'UPDATE tests SET status = $1, resultado_doctor = $2, updated_at = CURRENT_TIMESTAMP WHERE id = $3 RETURNING *',
      ['EVALUADO', resultadoDoctor, id]
    );
    if (result.rows.length === 0) return null;
    return result.rows[0];
  }

  static async findByDoctor(doctorId: number): Promise<Test[]> {
    const result = await pool.query('SELECT * FROM tests WHERE doctor_id = $1 ORDER BY created_at DESC', [doctorId]);
    return result.rows;
  }

  static async findByPaciente(pacienteId: number): Promise<Test[]> {
    const result = await pool.query('SELECT * FROM tests WHERE paciente_id = $1 ORDER BY created_at DESC', [pacienteId]);
    return result.rows;
  }
}
