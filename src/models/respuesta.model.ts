import pool from '../config/db';

export interface Respuesta {
  id?: number;
  test_id: number;
  numero_lamina: number;
  texto: string;
  emocion?: string;
  confianza?: number;
  created_at?: Date;
}

export class RespuestaModel {
  static async create(respuesta: Respuesta): Promise<Respuesta> {
    const { test_id, numero_lamina, texto, emocion, confianza } = respuesta;
    const result = await pool.query(
      'INSERT INTO respuestas (test_id, numero_lamina, texto, emocion, confianza) VALUES ($1, $2, $3, $4, $5) RETURNING *',
      [test_id, numero_lamina, texto, emocion, confianza]
    );
    return result.rows[0];
  }

  static async findByTest(testId: number): Promise<Respuesta[]> {
    const result = await pool.query('SELECT * FROM respuestas WHERE test_id = $1 ORDER BY numero_lamina ASC', [testId]);
    return result.rows;
  }
}
