import React, { useState } from 'react';
import './FormularioPaciente.css';

function FormularioPaciente({ agregarPaciente, volverALista }) {
  const [nombre, setNombre] = useState('');
  const [especie, setEspecie] = useState('Perro');
  const [raza, setRaza] = useState('');
  const [edadAproximada, setEdadAproximada] = useState('1 a 3 años');
  const [numeroAtencion, setNumeroAtencion] = useState('');
  const [nombreDueno, setNombreDueno] = useState('');
  const [telefono, setTelefono] = useState('');
  
  // Estado para la foto cargada, estado del arrastre y estado de envío
  const [foto, setFoto] = useState(null);
  const [arrastrando, setArrastrando] = useState(false);
  const [guardando, setGuardando] = useState(false);

  // Procesar archivo seleccionado o arrastrado
  const procesarArchivo = (file) => {
    if (file && file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onload = () => {
        setFoto(reader.result); // Convierte a Base64 para vista previa e inserción en BD
      };
      reader.readAsDataURL(file);
    } else {
      alert('Por favor selecciona un archivo de imagen válido (PNG, JPG, JPEG).');
    }
  };

  // Manejadores de Drag and Drop
  const handleDragOver = (e) => {
    e.preventDefault();
    setArrastrando(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setArrastrando(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setArrastrando(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      procesarArchivo(e.dataTransfer.files[0]);
    }
  };

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      procesarArchivo(e.target.files[0]);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!nombre.trim() || !numeroAtencion.trim() || !foto) {
      alert('Por favor completa todos los campos obligatorios (*), incluyendo la fotografía de la mascota.');
      return;
    }

    const nuevo = {
      nombre: nombre.trim(),
      especie,
      raza: raza.trim() || 'Mestizo',
      edad: edadAproximada,
      numero_atencion: numeroAtencion.trim(),
      nombre_dueno: nombreDueno.trim() || 'No registrado',
      telefono: telefono.trim() || 'Sin contacto',
      foto: foto
    };

    try {
      setGuardando(true);
      await agregarPaciente(nuevo); // Llama a la función asíncrona de App.jsx
      volverALista();
    } catch (error) {
      console.error("Error al registrar paciente:", error);
    } finally {
      setGuardando(false);
    }
  };

  return (
    <div className="seccion-formulario-pantalla">
      <div className="cabecera-form">
        <h2>Ingreso de Nuevo Paciente</h2>
        <p>Crea la ficha médica inicial para un animal que ingresa por primera vez.</p>
      </div>

      <form onSubmit={handleSubmit} className="form-completo">
        <div className="grid-2-col">
          <div className="campo">
            <label htmlFor="nombre">Nombre Mascota *</label>
            <input 
              type="text" 
              id="nombre"
              placeholder="Ej: Charkicito" 
              value={nombre} 
              onChange={(e) => setNombre(e.target.value)} 
              required 
            />
          </div>

          <div className="campo">
            <label htmlFor="numeroAtencion">N° Ficha / Atención *</label>
            <input 
              type="text" 
              id="numeroAtencion"
              placeholder="Ej: 2026-X99" 
              value={numeroAtencion} 
              onChange={(e) => setNumeroAtencion(e.target.value)} 
              required 
            />
          </div>

          <div className="campo">
            <label htmlFor="especie">Especie *</label>
            <select 
              id="especie"
              value={especie} 
              onChange={(e) => setEspecie(e.target.value)}
            >
              <option value="Perro">Perro</option>
              <option value="Gato">Gato</option>
              <option value="Conejo">Conejo</option>
              <option value="Caballo">Caballo</option>
              <option value="Exótico">Exótico / Otro</option>
            </select>
          </div>

          <div className="campo">
            <label htmlFor="raza">Raza</label>
            <input 
              type="text" 
              id="raza"
              placeholder="Ej: Caniche, Siamés, Mestizo" 
              value={raza} 
              onChange={(e) => setRaza(e.target.value)} 
            />
          </div>

          <div className="campo">
            <label htmlFor="edad">Edad (Aproximada) *</label>
            <select 
              id="edad"
              value={edadAproximada} 
              onChange={(e) => setEdadAproximada(e.target.value)}
            >
              <option value="Cachorro / Menor a 6 meses">Cachorro / Menor a 6 meses</option>
              <option value="6 meses a 1 año">6 meses a 1 año</option>
              <option value="1 a 3 años">1 a 3 años</option>
              <option value="4 a 7 años">4 a 7 años</option>
              <option value="Senior (8+ años)">Senior (8+ años)</option>
              <option value="Desconocida">Desconocida</option>
            </select>
          </div>

          {/* Carga de Fotografía Drag and Drop */}
          <div className="campo">
            <label>Fotografía del paciente * (Obligatorio)</label>
            <div 
              className={`dropzone-foto ${arrastrando ? 'arrastrando' : ''}`}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              onClick={() => document.getElementById('fotoInput').click()}
            >
              <input 
                type="file" 
                id="fotoInput" 
                accept="image/*"
                className="input-file-oculto"
                onChange={handleFileChange}
              />

              {foto ? (
                <div className="preview-contenedor">
                  <img src={foto} alt="Vista previa" className="preview-foto" />
                  <span className="btn-cambiar-foto">Hacer clic para cambiar foto</span>
                </div>
              ) : (
                <div className="dropzone-contenido">
                  <p>Arrastra una foto aquí</p>
                  <small>o haz clic para buscar en tu equipo</small>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="bloque-subform">
          <h4>Datos del Tutor</h4>
          <div className="grid-2-col">
            <div className="campo">
              <label htmlFor="dueno">Nombre del Tutor *</label>
              <input 
                type="text" 
                id="dueno"
                placeholder="Ej: Carla Vargas" 
                value={nombreDueno} 
                onChange={(e) => setNombreDueno(e.target.value)} 
                required
              />
            </div>

            <div className="campo">
              <label htmlFor="telefono">Teléfono Contacto *</label>
              <input 
                type="tel" 
                id="telefono"
                placeholder="Ej: +56 9 1234 5678" 
                value={telefono} 
                onChange={(e) => setTelefono(e.target.value)} 
                required
              />
            </div>
          </div>
        </div>

        <div className="acciones-form">
          <button type="button" className="btn-cancelar" onClick={volverALista} disabled={guardando}>
            Cancelar
          </button>
          <button type="submit" className="btn-guardar-paciente" disabled={guardando}>
            {guardando ? 'Guardando en Supabase...' : 'Guardar Nuevo Paciente'}
          </button>
        </div>
      </form>
    </div>
  );
}

export default FormularioPaciente;