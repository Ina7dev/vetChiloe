import { HospitalizacionesRepository } from '../repositories/hospitalizaciones.repository.js';

const hospitalizacionesRepo = new HospitalizacionesRepository();

export class HospitalizacionService {
  async listarHospitalizaciones() {
    return await hospitalizacionesRepo.obtenerTodas();
  }

  async registrarIngreso(datos) {
    if (!datos.paciente_id) {
      throw new Error('El ID del paciente es obligatorio.');
    }
    if (!datos.motivo) {
      throw new Error('El motivo de hospitalización es obligatorio.');
    }

    return await hospitalizacionesRepo.crear(datos);
  }

  async darDeAlta(id) {
    if (!id) {
      throw new Error('Se requiere el ID para dar de alta.');
    }
    return await hospitalizacionesRepo.eliminar(id);
  }
}