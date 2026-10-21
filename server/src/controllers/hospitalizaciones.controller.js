import { HospitalizacionesRepository } from '../repositories/hospitalizaciones.repository.js';

const repo = new HospitalizacionesRepository();

export const getHospitalizaciones = async (req, res) => {
  try {
    const lista = await repo.obtenerTodas();
    res.json(lista);
  } catch (error) {
    console.error('Error al obtener hospitalizaciones:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
};

export const createHospitalizacion = async (req, res) => {
  try {
    const nueva = await repo.crear(req.body);
    res.status(201).json(nueva);
  } catch (error) {
    console.error('Error al registrar hospitalización:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
};

export const deleteHospitalizacion = async (req, res) => {
  try {
    const { id } = req.params;
    await repo.eliminar(id);
    res.json({ mensaje: 'Paciente dado de alta correctamente' });
  } catch (error) {
    console.error('Error al dar de alta:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
};