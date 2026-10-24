import pg from 'pg';
import dotenv from 'dotenv';
dotenv.config();

const { Pool } = pg;

export const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false
  }
});

export const obtenerTodos = async () => {
  const query = 'SELECT * FROM pacientes ORDER BY id ASC';
  const { rows } = await pool.query(query);
  return rows;
};

export const guardar = async (paciente) => {
  const query = `
    INSERT INTO pacientes (nombre, numero_atencion, especie, edad, diagnostico, foto)
    VALUES ($1, $2, $3, $4, $5, $6)
    RETURNING *;
  `;
  const values = [
    paciente.nombre,
    paciente.numero_atencion,
    paciente.especie,
    paciente.edad,
    paciente.diagnostico,
    paciente.foto
  ];
  const { rows } = await pool.query(query, values);
  return rows[0];
};

export default { obtenerTodos, guardar, pool };
