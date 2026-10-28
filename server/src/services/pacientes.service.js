const repositorio = require('../repositories/pacientes.repository');

// especies que atiende la veterinaria
const ESPECIES_PERMITIDAS = ['perro', 'gato', 'pingüino', 'conejo', 'ave'];

// ahora es async porque la base de datos responde con promesas
async function listarPacientes() {
  return await repositorio.obtenerTodos();
}

// el servicio solo le quita los espacios al texto y le pasa la busqueda al repositorio
async function buscarPacientes(texto) {
  return await repositorio.buscar(texto.trim());
}

// pg entrega el total (bigint) como texto, aqui se pasa a numero
async function resumenPorEspecie() {
  const filas = await repositorio.resumen();
  return filas.map((fila) => ({ especie: fila.especie, total: Number(fila.total) }));
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

  // el id y el numero de atencion ya no se crean aqui, los pone la base de datos
  const nuevoPaciente = {
    ...datos,
    historial: [
      { fecha: hoy, motivo: 'Ingreso', detalle: 'Registrado en la clínica.' }
    ]
  };

  return await repositorio.guardar(nuevoPaciente);
}

module.exports = { listarPacientes, buscarPacientes, resumenPorEspecie, crearPaciente };