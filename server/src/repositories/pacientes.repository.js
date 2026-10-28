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

// llama a la funcion buscar_pacientes de la base de datos
async function buscar(texto) {
  const resultado = await pool.query('SELECT * FROM buscar_pacientes($1)', [texto]);
  return resultado.rows;
}

// llama a la funcion registrar_paciente, la base de datos pone el numero de atencion
async function guardar(paciente) {
  const resultado = await pool.query(
    'SELECT * FROM registrar_paciente($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)',
    [
      paciente.nombre, paciente.especie, paciente.raza, paciente.edad, paciente.peso,
      paciente.diagnostico, paciente.antecedentes, paciente.foto,
      // dueno e historial son objetos, se pasan a texto json para guardarlos
      paciente.dueno ? JSON.stringify(paciente.dueno) : null,
      JSON.stringify(paciente.historial)
    ]
  );
  return resultado.rows[0];
}

module.exports = { obtenerTodos, buscar, guardar };