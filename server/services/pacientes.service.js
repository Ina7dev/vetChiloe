import * as repository from '../repositories/pacientes.repository.js';

const ESPECIES_VALIDAS = ['Felino', 'Canino', 'Ave', 'Exótico'];

export const listarPacientes = async () => {
  return await repository.obtenerTodos();
};

export const registrarPaciente = async (datos) => {
  if (!datos.nombre || !datos.especie) {
    throw new Error('Faltan datos obligatorios');
  }

  const especieNormalizada = datos.especie.charAt(0).toUpperCase() + datos.especie.slice(1).toLowerCase();
  if (!ESPECIES_VALIDAS.includes(especieNormalizada)) {
    throw new Error('Especie no permitida');
  }

  const pacientes = await repository.obtenerTodos();
  const siguienteNumero = pacientes.length + 1;
  const correlativo = `2026-A${siguienteNumero}`;

  const nuevoPaciente = {
    ...datos,
    especie: especieNormalizada,
    numero_atencion: correlativo
  };

  return await repository.guardar(nuevoPaciente);
};

export const pacienteService = { listarPacientes, registrarPaciente };
export default pacienteService;
