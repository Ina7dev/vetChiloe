import pool from '../lib/db.js';

const columnas = 'id, nombre, numero_atencion, especie, edad, raza, diagnostico, imagen';
const camposInsert = ['nombre', 'especie', 'edad', 'raza', 'diagnostico', 'imagen'];

const normalizarPaciente = (p) => ({ ...p, numero_atencion: String(p.numero_atencion) });



export async function getData() {
  const { rows } = await pool.query(`SELECT ${columnas} FROM pacientes ORDER BY id`);
  return rows.map(normalizarPaciente);
}

export async function insertData(paciente) {
  const placeholders = camposInsert.map((_, i) => `$${i + 1}`).join(', ');
  const { rows } = await pool.query(
    `INSERT INTO pacientes (${camposInsert.join(', ')})
     VALUES (${placeholders})
     RETURNING ${columnas}`,
    camposInsert.map((campo) => paciente[campo]),
  );
  return normalizarPaciente(rows[0]);
}