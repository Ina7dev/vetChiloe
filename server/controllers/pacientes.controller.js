import pacientesService from '../services/pacientes.service.js';

export const listar = async (req, res) => {
  try {
    const pacientes = await pacientesService.listarPacientes();
    res.json(pacientes);
  } catch (error) {
    console.error("ERROR EN LISTAR PACIENTES:", error);
    res.status(500).json({
      error: "Error interno del servidor al listar pacientes",
      detalle: error.message
    });
  }
};

export const crear = async (req, res) => {
  try {
    const nuevoPaciente = await pacientesService.registrarPaciente(req.body);
    res.status(201).json(nuevoPaciente);
  } catch (error) {
    console.error("ERROR AL CREAR PACIENTE:", error);
    res.status(500).json({
      error: "Error al registrar el paciente",
      detalle: error.message
    });
  }
};

export const pacienteController = {
  listar,
  crear
};

export default pacienteController;
