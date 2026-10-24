import { useState } from 'react';
import './FormularioPaciente.css';

const RAZAS_POR_ESPECIE = {
  Canino: ['Quiltro / Mestizo', 'Pastor Alemán', 'Poodle', 'Golden Retriever', 'Beagle', 'Labrador', 'Bulldog', 'Otro'],
  Felino: ['Común Europeo / Mestizo', 'Siamés', 'Persa', 'Maine Coon', 'Bengala', 'Otro'],
  Ave: ['Canario', 'Periquito Australiano', 'Ninfa / Calopsita', 'Loro', 'Otro'],
  Exótico: ['Conejo', 'Cobaya / Cuy', 'Hurón', 'Hamster', 'Otro']
};

const FOTOS_DEFAULT = {
  Felino: 'https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?w=600&auto=format&fit=crop',
  Canino: 'https://images.unsplash.com/photo-1543466835-00a7907e9de1?w=600&auto=format&fit=crop',
  Ave: 'https://images.unsplash.com/photo-1552728089-57bdde30beb3?w=600&auto=format&fit=crop',
  Exótico: 'https://images.unsplash.com/photo-1585110396000-c9ffd4e4b308?w=600&auto=format&fit=crop'
};

export function FormularioPaciente({ onAgregarPaciente, onCancelar }) {
  const [nombre, setNombre] = useState('');
  const [especie, setEspecie] = useState('Felino');
  const [raza, setRaza] = useState('Común Europeo / Mestizo');
  const [edadAnios, setEdadAnios] = useState('');
  const [edadMeses, setEdadMeses] = useState('');
  const [peso, setPeso] = useState('');
  const [nombreDueno, setNombreDueno] = useState('');
  const [rutDueno, setRutDueno] = useState('');
  const [diagnostico, setDiagnostico] = useState('');
  const [fotoPreview, setFotoPreview] = useState(null);
  const [nombreArchivo, setNombreArchivo] = useState('');

  const handleEspecieChange = (nuevaEspecie) => {
    setEspecie(nuevaEspecie);
    const razasDisponibles = RAZAS_POR_ESPECIE[nuevaEspecie] || ['Otro'];
    setRaza(razasDisponibles[0]);
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        alert('Por favor selecciona una foto de menos de 2MB.');
        return;
      }
      setNombreArchivo(file.name);
      const reader = new FileReader();
      reader.onloadend = () => {
        setFotoPreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleNumeroChange = (valor, setter, maximo) => {
    if (valor === '') {
      setter('');
      return;
    }
    const limpio = valor.replace(/^0+(?=\d)/, '');
    const num = parseInt(limpio, 10);
    if (isNaN(num)) {
      setter('');
      return;
    }
    setter(Math.min(maximo, Math.max(0, num)).toString());
  };

  const formatearEdad = (aniosStr, mesesStr) => {
    const a = parseInt(aniosStr, 10) || 0;
    const m = parseInt(mesesStr, 10) || 0;
    if (a === 0 && m === 0) return 'Recién nacido';
    if (a === 0) return `${m} ${m === 1 ? 'mes' : 'meses'}`;
    if (m === 0) return `${a} ${a === 1 ? 'año' : 'años'}`;
    return `${a} ${a === 1 ? 'año' : 'años'} y ${m} ${m === 1 ? 'mes' : 'meses'}`;
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!nombre.trim() || !nombreDueno.trim()) {
      alert('Por favor completa al menos el nombre de la mascota y del tutor.');
      return;
    }

    // Usar la foto oficial por defecto para URLs seguras en la BD de Neon
    const fotoFinal = FOTOS_DEFAULT[especie] || FOTOS_DEFAULT.Felino;

    const a = parseInt(edadAnios, 10) || 0;
    const m = parseInt(edadMeses, 10) || 0;
    const descDiagnostico = diagnostico.trim() || 'Control de rutina general.';

    const nuevoPaciente = {
      nombre: nombre.trim(),
      especie,
      raza,
      edad: formatearEdad(a, m),
      edadAnios: a,
      edadMeses: m,
      peso: peso.trim() ? `${peso.trim()} kg` : 'No registrado',
      nombreDueno: nombreDueno.trim(),
      rutDueno: rutDueno.trim() || 'No informado',
      diagnostico: descDiagnostico,
      motivo: descDiagnostico,
      foto: fotoPreview && !fotoPreview.startsWith('data:') ? fotoPreview : fotoFinal
    };

    onAgregarPaciente(nuevoPaciente);
  };

  return (
    <div className="formulario-tab-container">
      <div className="form-card">
        <div className="form-header">
          <span className="badge-celeste">AegisVet • Nuevo Carnet</span>
          <h2>Ficha de Ingreso Clínico</h2>
          <p>Registra la mascota. Si no adjuntas foto, se asignará una oficial por defecto.</p>
        </div>

        <form onSubmit={handleSubmit}>
          <h4 className="seccion-subtitulo">Datos del Paciente</h4>
          <div className="form-grid">
            <div className="form-group">
              <label htmlFor="nombre">Nombre de la Mascota *</label>
              <input
                id="nombre"
                type="text"
                placeholder="Ej: Atenea, Afrodita, Goliath"
                value={nombre}
                onChange={(e) => setNombre(e.target.value)}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="especie">Especie *</label>
              <select
                id="especie"
                value={especie}
                onChange={(e) => handleEspecieChange(e.target.value)}
              >
                <option value="Felino">Felino (Gato)</option>
                <option value="Canino">Canino (Perro)</option>
                <option value="Ave">Ave</option>
                <option value="Exótico">Exótico / Pequeño Mamífero</option>
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="raza">Raza</label>
              <select
                id="raza"
                value={raza}
                onChange={(e) => setRaza(e.target.value)}
              >
                {(RAZAS_POR_ESPECIE[especie] || ['Otro']).map((r) => (
                  <option key={r} value={r}>{r}</option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label>Edad Exacta</label>
              <div className="edad-inputs-row">
                <div className="edad-campo">
                  <input
                    type="number"
                    min="0"
                    max="30"
                    placeholder="0"
                    value={edadAnios}
                    onFocus={(e) => e.target.select()}
                    onChange={(e) => handleNumeroChange(e.target.value, setEdadAnios, 30)}
                  />
                  <span>años</span>
                </div>
                <div className="edad-campo">
                  <input
                    type="number"
                    min="0"
                    max="11"
                    placeholder="0"
                    value={edadMeses}
                    onFocus={(e) => e.target.select()}
                    onChange={(e) => handleNumeroChange(e.target.value, setEdadMeses, 11)}
                  />
                  <span>meses</span>
                </div>
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="peso">Peso (en kg)</label>
              <input
                id="peso"
                type="number"
                min="0"
                step="0.1"
                placeholder="Ej: 4.2"
                value={peso}
                onFocus={(e) => e.target.select()}
                onChange={(e) => setPeso(e.target.value)}
              />
            </div>

            <div className="form-group full-width upload-group">
              <label>Fotografía de la Mascota (Opcional)</label>
              <div className="upload-dropzone">
                <input
                  id="fotoInput"
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="input-file-hidden"
                />

                {!fotoPreview ? (
                  <label htmlFor="fotoInput" className="btn-custom-upload">
                    <span className="upload-icon">📷</span>
                    <span className="upload-text-principal">Haz clic para subir una foto personalizada</span>
                    <span className="upload-subtext">Opcional. Se asignará una foto oficial por defecto si no subes una.</span>
                  </label>
                ) : (
                  <div className="preview-container">
                    <img src={fotoPreview} alt="Vista previa mascota" className="img-preview" />
                    <div className="preview-info">
                      <span className="preview-name">{nombreArchivo || 'Foto seleccionada'}</span>
                      <div className="preview-actions">
                        <label htmlFor="fotoInput" className="btn-cambiar-foto">
                          ✎ Cambiar
                        </label>
                        <button
                          type="button"
                          className="btn-quitar-foto"
                          onClick={() => {
                            setFotoPreview(null);
                            setNombreArchivo('');
                          }}
                        >
                          ✕ Quitar
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          <h4 className="seccion-subtitulo" style={{ marginTop: '1.5rem' }}>Datos del Tutor Responsable</h4>
          <div className="form-grid">
            <div className="form-group">
              <label htmlFor="dueno">Nombre del Dueño *</label>
              <input
                id="dueno"
                type="text"
                placeholder="Ej: Vicente Garín"
                value={nombreDueno}
                onChange={(e) => setNombreDueno(e.target.value)}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="rut">RUT del Dueño</label>
              <input
                id="rut"
                type="text"
                placeholder="Ej: 19.876.543-2"
                value={rutDueno}
                onChange={(e) => setRutDueno(e.target.value)}
              />
            </div>

            <div className="form-group full-width">
              <label htmlFor="diagnostico">Motivo de Consulta / Diagnóstico</label>
              <textarea
                id="diagnostico"
                rows="3"
                placeholder="Descripción del estado del paciente, vacunas o síntomas..."
                value={diagnostico}
                onChange={(e) => setDiagnostico(e.target.value)}
              />
            </div>
          </div>

          <div className="form-botones">
            <button type="button" className="btn-cancelar-form" onClick={onCancelar}>
              Cancelar
            </button>
            <button type="submit" className="btn-guardar-paciente">
              Ingresar al Carnet Clínico
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
