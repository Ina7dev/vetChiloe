import pool from '../lib/db.js';

const columnas = `
  id,
  nombre,
  numero_atencion,
  especie,
  edad,
  raza,
  diagnostico,
  imagen
`;

function normalizarPaciente(paciente) {
  return {
    ...paciente,
    numero_atencion: String(paciente.numero_atencion),
  };
}

export async function getData() {
  const rows = await pool.query(
    `SELECT ${columnas} FROM pacientes ORDER BY id`,
  );
  return rows.rows.map(normalizarPaciente);
}

export async function insertData(paciente) {
   const query = `
      INSERT INTO pacientes (
        nombre,
        especie,
        edad,
        raza,
        diagnostico,
        imagen
      ) VALUES ($1, $2, $3, $4, $5, $6)
      RETURNING ${columnas}`;

    const values = [
      paciente.nombre,
      paciente.especie,
      paciente.edad,
      paciente.raza,
      paciente.diagnostico,
      paciente.imagen,
    ];

    const resultado = await pool.query(query, values);
    return normalizarPaciente(resultado.rows[0]);
  
}