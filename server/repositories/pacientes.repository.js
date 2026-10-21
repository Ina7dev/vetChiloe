import pg from 'pg';
import dotenv from 'dotenv';
dotenv.config();

const { Pool } = pg;

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false }
});

export const obtenerTodos = async () => {
  const resultado = await pool.query('SELECT * FROM pacientes ORDER BY id DESC');
  return resultado.rows;
};

export const guardar = async (paciente) => {
  const query = `
    INSERT INTO pacientes (nombre, numero_atencion, especie, edad, diagnostico, foto)
    VALUES ($1, $2, $3, $4, $5, $6) RETURNING *;
  `;
  const valores = [
    paciente.nombre,
    paciente.numero_atencion,
    paciente.especie,
    paciente.edad || 'Desconocida',
    paciente.diagnostico || '',
    paciente.foto || 'https://images.unsplash.com/photo-1543466835-00a7907e9de1?auto=format&fit=crop&w=300&q=80'
  ];
  const resultado = await pool.query(query, valores);
  return resultado.rows[0];
};

export default { obtenerTodos, guardar };
