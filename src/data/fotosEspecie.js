// foto que se usa cuando el paciente no tiene una propia
function fotoPorEspecie(especie) {
  const texto = (especie || '').toLowerCase();
  if (texto.includes('gato') || texto.includes('felino')) return '/pacientes/gato.png';
  if (texto.includes('perro') || texto.includes('canino')) return '/pacientes/perro.png';
  if (texto.includes('ping')) return '/pacientes/pinguino.png';
  if (texto.includes('conejo')) return '/pacientes/conejo.png';
  if (texto.includes('ave')) return '/pacientes/ave.webp';
  return '/pacientes/default.jpg';
}

// si el paciente subio foto se usa esa, si no la de su especie
export function fotoPaciente(paciente) {
  if (paciente.foto && paciente.foto !== '/pacientes/default.jpg') {
    return paciente.foto;
  }
  return fotoPorEspecie(paciente.especie);
}