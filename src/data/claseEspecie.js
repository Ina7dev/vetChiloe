// devuelve la clase de la etiqueta segun la especie
// se usa en la tabla y en el resumen para que tengan los mismos colores
export function claseEspecie(especie) {
  const texto = especie.toLowerCase();
  if (texto.includes('felino') || texto.includes('gato')) return 'etiqueta badge-felino';
  if (texto.includes('canino') || texto.includes('perro')) return 'etiqueta badge-canino';
  if (texto.includes('ave') || texto.includes('ping')) return 'etiqueta badge-ave';
  return 'etiqueta badge-otro';
}