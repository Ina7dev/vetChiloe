import pool from '../config/db.js';

export class PacientesRepository {
  async obtenerTodos() {
    const query = 'SELECT * FROM pacientes ORDER BY id DESC;';
    const { rows } = await pool.query(query);
    return rows;
  }

  async obtenerPorId(id) {
    const query = 'SELECT * FROM pacientes WHERE id = $1;';
    const { rows } = await pool.query(query, [id]);
    return rows[0];
  }

  async crear(paciente) {
    const { 
      nombre, 
      numero_atencion, 
      especie, 
      raza, 
      edad, 
      nombre_dueno, 
      telefono, 
      foto 
    } = paciente;

    const query = `
      INSERT INTO pacientes (
        nombre, 
        numero_atencion, 
        especie, 
        raza, 
        edad, 
        nombre_dueno, 
        telefono, 
        foto
      )
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
      RETURNING *;
    `;

    const values = [
      nombre, 
      numero_atencion, 
      especie, 
      raza || 'Mestizo', 
      edad, 
      nombre_dueno || 'No registrado', 
      telefono || 'Sin contacto', 
      foto
    ];

    const { rows } = await pool.query(query, values);
    return rows[0];
  }

  async eliminar(id) {
    const query = 'DELETE FROM pacientes WHERE id = $1 RETURNING *;';
    const { rows } = await pool.query(query, [id]);
    return rows[0];
  }
}