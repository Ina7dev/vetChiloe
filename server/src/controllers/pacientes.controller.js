const servicio = require('../services/pacientes.service');

// GET /api/pacientes
async function listar(req, res) {
  try {
    const pacientes = await servicio.listarPacientes();
    res.status(200).json(pacientes);
  } catch (error) {
    // por ejemplo si no se pudo conectar a la base de datos
    res.status(500).json({ error: error.message });
  }
}

// POST /api/pacientes
async function crear(req, res) {
  try {
    const nuevo = await servicio.crearPaciente(req.body);
    res.status(201).json(nuevo);
  } catch (error) {
    // si el servicio no dijo que codigo usar, es un error del servidor
    res.status(error.status || 500).json({ error: error.message });
  }
}

module.exports = { listar, crear };
