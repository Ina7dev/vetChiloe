const { Pool } = require('pg');
require('dotenv').config();

// conexion a la base de datos en la nube, la direccion viene del .env
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false } // neon y supabase piden ssl
});

async function obtenerTodos() {
  const resultado = await pool.query('SELECT * FROM pacientes ORDER BY id DESC');
  return resultado.rows;
}

async function guardar(paciente) {
  const query = `
    INSERT INTO pacientes (nombre, numero_atencion, especie, raza, edad, peso,
                           diagnostico, antecedentes, foto, dueno, alta, historial)
    VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12)
    RETURNING *;
  `;
  const valores = [
    paciente.nombre, paciente.numero_atencion, paciente.especie, paciente.raza,
    paciente.edad, paciente.peso, paciente.diagnostico, paciente.antecedentes,
    paciente.foto,
    // dueno e historial son objetos, se pasan a texto json para guardarlos
    paciente.dueno ? JSON.stringify(paciente.dueno) : null,
    paciente.alta,
    JSON.stringify(paciente.historial)
  ];
  const resultado = await pool.query(query, valores);
  return resultado.rows[0];
}

module.exports = { obtenerTodos, guardar };
