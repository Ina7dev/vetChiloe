import pacientesService from '../services/pacientes.service.js';

export const listar = async (req, res) => {
  try {
    const pacientes = await pacientesService.obtenerPacientes();
    res.json(pacientes);
  } catch (error) {
    console.error("ERROR DETALLADO EN LISTAR PACIENTES:", error);
    res.status(500).json({
      error: "Error interno del servidor al listar pacientes",
      detalle: error.message,
      codigo: error.code
    });
  }
};

export const crear = async (req, res) => {
  try {
    const nuevoPaciente = await pacientesService.crearPaciente(req.body);
    res.status(201).json(nuevoPaciente);
  } catch (error) {
    console.error("ERROR AL CREAR PACIENTE:", error);
    res.status(500).json({ error: "Error al registrar el paciente", detalle: error.message });
  }
};

export const pacienteController = {
  listar,
  crear
};

export default pacienteController;
