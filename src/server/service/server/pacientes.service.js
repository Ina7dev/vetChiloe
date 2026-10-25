import * as repo from '../../repositories/pacientes.repositories.js';

const IMAGENES = {
  perro: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR5K9bMLje8lyz6Kpk97MzwOZrh5PAlLXkZoj4-Q8DWKg&s=10',
  gato: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS_tGFXnJruodcIwFf8xFENi3SiQjodb1F1M-w-gk180w&s=10',
};
const CAMPOS = ['nombre', 'especie', 'raza', 'diagnostico'];

const vacio = (v) => String(v ?? '').trim() === '';
const plural = (n, uno, varios) => `${n} ${n === 1 ? uno : varios}`;

function entero(valor, max, etiqueta) {
  const n = vacio(valor) ? NaN : Number(valor);
  if (!Number.isInteger(n) || n < 0 || n > max) {
    throw new Error(`${etiqueta} debe ser un entero entre 0 y ${max}`);
  }
  return n;
}

function formatearEdad(edad) {
  const anos = entero(edad?.anos, 35, 'Los años');
  const meses = entero(edad?.meses, 11, 'Los meses');
  return [anos && plural(anos, 'año', 'años'), meses && plural(meses, 'mes', 'meses')]
    .filter(Boolean)
    .join(' y ') || '0 meses';
}

export const getDataPacientes = () => repo.getData();

export async function insertDataPacientes(datos) {
  for (const campo of CAMPOS) {
    if (vacio(datos?.[campo])) throw new Error(`El campo "${campo}" es nulo o está vacío`);
  }

  const especie = datos.especie.trim().toLowerCase();
  if (!Object.hasOwn(IMAGENES, especie)) {
    throw new Error(`Especie no válida: "${datos.especie}"`);
  }

  return repo.insertData({
    nombre: datos.nombre.trim(),
    especie,
    raza: datos.raza.trim(),
    diagnostico: datos.diagnostico.trim(),
    edad: formatearEdad(datos.edad),
    imagen: IMAGENES[especie],
  });
}