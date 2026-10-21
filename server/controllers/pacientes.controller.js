import * as service from '../services/pacientes.service.js';

export const listar = async (req, res) => {
  try {
    const pacientes = await service.listarPacientes();
    res.status(200).json(pacientes);
  } catch (error) {
    res.status(500).json({ error: 'Error interno del servidor al listar pacientes' });
  }
};

export const crear = async (req, res) => {
  try {
    const nuevo = await service.registrarPaciente(req.body);
    res.status(201).json(nuevo);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

export const pacienteController = { listar, crear };
export default pacienteController;
