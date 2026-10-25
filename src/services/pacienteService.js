// direccion del backend
// cuando este publicado en render se cambia por: https://TU-APP.onrender.com/api/pacientes
const URL_API = 'http://localhost:3000/api/pacientes';

// GET: le pide la lista al servidor
export async function obtenerPacientes() {
  const respuesta = await fetch(URL_API);
  const datos = await respuesta.json();

  // si el servidor respondio con error (por ejemplo no pudo conectar a la
  // base de datos) se avisa, si no la pagina recibe el error en vez de la lista
  if (!respuesta.ok) {
    throw new Error(datos.error);
  }
  return datos;
}

// POST: manda el paciente nuevo y el servidor lo devuelve con su numero
export async function registrarPaciente(paciente) {
  const respuesta = await fetch(URL_API, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(paciente)
  });
  const datos = await respuesta.json();

  // si el servidor respondio con error (por ejemplo 400) se avisa
  if (!respuesta.ok) {
    throw new Error(datos.error);
  }
  return datos;
}

// el servidor todavia no tiene rutas para editar ni eliminar,
// asi que por ahora estos cambios solo duran hasta recargar
export function guardarPacientes() {}