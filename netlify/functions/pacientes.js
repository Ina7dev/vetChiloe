import {
  getDataPacientes,
  insertDataPacientes,
} from '../../src/server/service/server/pacientes.service.js';

function jsonResponse(body, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { 'Content-Type': 'application/json' },
  });
}

export default async function handler(request) {
  if (request.method === 'GET') {
    try {
      return jsonResponse(await getDataPacientes());
    } catch (error) {
      console.error('Error al consultar pacientes:', error);
      return jsonResponse({ error: error.message }, 500);
    }
  }

  if (request.method === 'POST') {
    let datos;
    try {
      datos = await request.json();
    } catch {
      return jsonResponse({ error: 'El cuerpo debe ser JSON válido' }, 400);
    }

    try {
      const paciente = await insertDataPacientes(datos);
      return jsonResponse(paciente, 201);
    } catch (error) {
      console.error('Error al guardar paciente:', error);
      const status = error.status || error.statusCode || 500;
      return jsonResponse({ error: error.message }, status);
    }
  }

  return jsonResponse(
    { error: 'Método no permitido' },
    405,
  );
}
