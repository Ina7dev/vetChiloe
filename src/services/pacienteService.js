const API_URL = import.meta.env.VITE_API_URL || 'https://vetchiloe.onrender.com/api/pacientes';

export const pacienteService = {
  obtenerPacientes: async () => {
    const res = await fetch(API_URL);
    if (!res.ok) {
      throw new Error('Error al obtener la lista de pacientes');
    }
    return await res.json();
  },

  registrarPaciente: async (paciente) => {
    const res = await fetch(API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(paciente)
    });

    if (!res.ok) {
      const errorData = await res.json().catch(() => ({}));
      throw new Error(errorData.error || 'Error al registrar el paciente en el servidor');
    }

    return await res.json();
  }
};

export default pacienteService;
