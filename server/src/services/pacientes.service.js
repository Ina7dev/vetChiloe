const repositorio = require('../repositories/pacientes.repository');

// especies que atiende la veterinaria
const ESPECIES_PERMITIDAS = ['perro', 'gato', 'pingüino', 'conejo', 'ave'];

// ahora es async porque la base de datos responde con promesas
async function listarPacientes() {
  return await repositorio.obtenerTodos();
}

// busca el numero mas alto que existe y le suma uno
async function generarNumeroAtencion() {
  const pacientes = await repositorio.obtenerTodos();
  const usados = pacientes
    .map((paciente) => Number(paciente.numero_atencion.split('-D')[1]))
    // se saltan los numeros con otro formato, como el del seed (2026-B2)
    .filter((numero) => !Number.isNaN(numero));
  const siguiente = Math.max(0, ...usados) + 1;
  return `${new Date().getFullYear()}-D${siguiente}`;
}

async function crearPaciente(datos) {
  const especie = (datos.especie || '').toLowerCase();

  // si la especie no esta permitida se corta aqui con error 400
  if (!ESPECIES_PERMITIDAS.includes(especie)) {
    const error = new Error('Esa especie no la atiende la veterinaria.');
    error.status = 400;
    throw error;
  }

  const hoy = new Date().toLocaleDateString('es-CL');

  // el id ya no se crea aqui, lo pone la base de datos (SERIAL)
  const nuevoPaciente = {
    ...datos,
    numero_atencion: await generarNumeroAtencion(),
    alta: false,
    historial: [
      { fecha: hoy, motivo: 'Ingreso', detalle: 'Registrado en la clínica.' }
    ]
  };

  return await repositorio.guardar(nuevoPaciente);
}

module.exports = { listarPacientes, crearPaciente };
