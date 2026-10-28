import './BuscadorPaciente.css';

// input controlado: el texto vive en el padre (App.jsx)
function BuscadorPaciente({ texto, onCambiar }) {
  return (
    <div className="buscador">
      <span className="buscador-icono">🔍</span>
      <input
        type="search"
        value={texto}
        placeholder="Buscar por nombre o especie..."
        aria-label="Buscar paciente por nombre o especie"
        onChange={(e) => onCambiar(e.target.value)}
      />
    </div>
  );
}

export default BuscadorPaciente;