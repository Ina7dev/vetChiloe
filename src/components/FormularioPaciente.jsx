import { useState } from 'react';
import './FormularioPaciente.css';
import { fotoPaciente } from '../data/fotosEspecie';

function FormularioPaciente({ pacientes, razasPorEspecie, onAgregar, onReingresar }) {
  // datos para buscar una mascota que ya tiene ficha
  const [idBuscado, setIdBuscado] = useState('');
  const [pacienteEncontrado, setPacienteEncontrado] = useState(null);
  const [noEncontrado, setNoEncontrado] = useState(false);
  const [motivoReingreso, setMotivoReingreso] = useState('');

  // datos del paciente
  const [nombre, setNombre] = useState('');
  const [especie, setEspecie] = useState('');
  const [raza, setRaza] = useState('');
  const [edad, setEdad] = useState('');
  const [peso, setPeso] = useState('');
  const [diagnostico, setDiagnostico] = useState('');
  const [foto, setFoto] = useState('');
  const [nombreFoto, setNombreFoto] = useState('');
  const [antecedentes, setAntecedentes] = useState('');

  // datos del dueño
  const [nombreDueno, setNombreDueno] = useState('');
  const [telefono, setTelefono] = useState('');
  const [correo, setCorreo] = useState('');

  // busca en la lista una mascota con ese numero de atencion
  const buscarFicha = () => {
    const texto = idBuscado.trim().toLowerCase();
    if (texto === '') return;

    const encontrado = pacientes.find(
      (paciente) => paciente.numero_atencion.toLowerCase() === texto
    );

    if (encontrado) {
      setPacienteEncontrado(encontrado);
      setNoEncontrado(false);
    } else {
      setNoEncontrado(true);
    }
  };

  // vuelve al registro normal
  const limpiarBusqueda = () => {
    setPacienteEncontrado(null);
    setIdBuscado('');
    setMotivoReingreso('');
  };

  const manejarReingreso = (e) => {
    e.preventDefault();
    onReingresar(pacienteEncontrado.id, motivoReingreso);
  };

  // convierte la foto a texto para poder guardarla en el navegador
  const manejarFoto = (e) => {
    const archivo = e.target.files[0];
    // permite volver a elegir la misma foto despues de quitarla
    e.target.value = '';

    if (archivo) {
      if (archivo.size > 1024 * 1024) {
        alert('La foto debe pesar menos de 1 MB.');
        return;
      }

      const lector = new FileReader();
      lector.onload = () => {
        setFoto(lector.result);
        setNombreFoto(archivo.name);
      };
      lector.readAsDataURL(archivo);
    }
  };

  const quitarFoto = () => {
    setFoto('');
    setNombreFoto('');
  };

  const manejarEnvio = (e) => {
    e.preventDefault();

    onAgregar({
      nombre: nombre,
      especie: especie,
      raza: raza || 'Sin especificar',
      edad: Number(edad),
      peso: Number(peso),
      // si no se subio foto se usa la de por defecto
      foto: foto || '/pacientes/default.jpg',
      diagnostico: diagnostico,
      antecedentes: antecedentes,
      dueno: {
        nombre: nombreDueno,
        telefono: telefono,
        correo: correo || 'Sin correo'
      },
      historial: []
    });
  };

  // si la mascota ya tiene ficha solo se pide el motivo del nuevo ingreso
  if (pacienteEncontrado) {
    return (
      <form className="formulario-paciente" onSubmit={manejarReingreso}>
        <div className="encabezado-formulario">
          <span className="etiqueta etiqueta-superior">Reingreso</span>
          <h2>Nuevo ingreso de {pacienteEncontrado.nombre}</h2>
          <p>Esta mascota ya tiene ficha, solo falta el motivo de la visita.</p>
        </div>

        <div className="vista-previa">
            <img src={fotoPaciente(pacienteEncontrado)} alt={pacienteEncontrado.nombre} />
          <span>
            <strong>{pacienteEncontrado.nombre}</strong> ({pacienteEncontrado.especie})
            <br />
            N° atención {pacienteEncontrado.numero_atencion}
          </span>
        </div>

        <label>
          Motivo del ingreso
          <textarea
            placeholder="Motivo de la consulta o estado del paciente"
            value={motivoReingreso}
            onChange={(e) => setMotivoReingreso(e.target.value)}
            required
          />
        </label>

        <button type="submit" className="boton-registrar">
          Registrar nuevo ingreso
        </button>
        <button type="button" className="boton-secundario" onClick={limpiarBusqueda}>
          No es esta mascota
        </button>
      </form>
    );
  }

  return (
    <form className="formulario-paciente" onSubmit={manejarEnvio}>
      <div className="encabezado-formulario">
        <span className="etiqueta etiqueta-superior">Nuevo ingreso</span>
        <h2>Registrar paciente</h2>
        <p>Completa los datos de la mascota y de su dueño.</p>
      </div>

      <div className="buscar-ficha">
        <span className="nombre-campo">¿La mascota ya tiene ficha?</span>
        <div className="fila-buscar">
          <input
            type="text"
            placeholder="Escribe su N° de atención, ej: 2026-D1"
            value={idBuscado}
            onChange={(e) => setIdBuscado(e.target.value)}
            // con enter busca en vez de enviar el formulario
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                e.preventDefault();
                buscarFicha();
              }
            }}
          />
          <button type="button" className="boton-buscar" onClick={buscarFicha}>
            Buscar
          </button>
        </div>
        {noEncontrado && (
          <p className="aviso-busqueda">
            No hay ninguna ficha con ese número. Puedes registrarla abajo.
          </p>
        )}
      </div>

      <h3 className="titulo-seccion">Datos del paciente</h3>
      <div className="campos">
        <label>
          Nombre
          <input
            type="text"
            placeholder="Ej: Poi"
            value={nombre}
            onChange={(e) => setNombre(e.target.value)}
            required
          />
        </label>

        <label>
          Especie
          <select
            value={especie}
            onChange={(e) => {
              setEspecie(e.target.value);
              // al cambiar la especie se borra la raza anterior
              setRaza('');
            }}
            required
          >
            <option value="">Selecciona una especie</option>
            {Object.keys(razasPorEspecie).map((nombreEspecie) => (
              <option key={nombreEspecie} value={nombreEspecie}>
                {nombreEspecie}
              </option>
            ))}
          </select>
        </label>

        <label>
          Raza
          <select
            value={raza}
            onChange={(e) => setRaza(e.target.value)}
            disabled={especie === ''}
          >
            <option value="">
              {especie === '' ? 'Primero elige una especie' : 'Sin especificar'}
            </option>
            {/* solo muestra las razas de la especie elegida */}
            {especie !== '' && razasPorEspecie[especie].map((nombreRaza) => (
              <option key={nombreRaza} value={nombreRaza}>
                {nombreRaza}
              </option>
            ))}
          </select>
        </label>

        <label>
          Edad (años)
          <input
            type="number"
            min="0"
            max="100"
            placeholder="Ej: 2"
            value={edad}
            onChange={(e) => setEdad(e.target.value)}
            required
          />
        </label>

        <label className="campo-ancho">
          Peso (kg)
          <input
            type="number"
            min="0"
            max="1000"
            step="0.1"
            placeholder="Ej: 4.5"
            value={peso}
            onChange={(e) => setPeso(e.target.value)}
            required
          />
        </label>

        <div className="campo-ancho">
          <span className="nombre-campo">Foto del paciente</span>
          {/* el input real esta oculto, se abre al hacer clic en la zona */}
          <input
            id="foto"
            className="foto-oculta"
            type="file"
            accept="image/*"
            onChange={manejarFoto}
          />

          {foto === '' ? (
            <label htmlFor="foto" className="subir-foto">
              <span>Haz clic para elegir una foto</span>
              <small>Formatos JPG o PNG</small>
            </label>
          ) : (
            <div className="vista-previa">
              <img src={foto} alt="Foto del paciente" />
              <span>{nombreFoto}</span>
              <button type="button" className="boton-quitar" onClick={quitarFoto}>
                Quitar
              </button>
            </div>
          )}
        </div>

        <label className="campo-ancho">
          Diagnóstico
          <textarea
            placeholder="Motivo de la consulta o estado del paciente"
            value={diagnostico}
            onChange={(e) => setDiagnostico(e.target.value)}
            required
          />
        </label>
        <label className="campo-ancho">
          Enfermedades o antecedentes (opcional)
          <textarea
            placeholder="Ej: alergias, cirugías, enfermedades anteriores"
            value={antecedentes}
            onChange={(e) => setAntecedentes(e.target.value)}
          />
        </label>
      </div>

      <h3 className="titulo-seccion">Datos del dueño</h3>
      <div className="campos">
        <label>
          Nombre del dueño
          <input
            type="text"
            placeholder="Ej: Camila Soto"
            value={nombreDueno}
            onChange={(e) => setNombreDueno(e.target.value)}
            required
          />
        </label>

        <label>
          Teléfono
          <input
            type="tel"
            placeholder="Ej: 912345678"
            maxLength="9"
            pattern="9[0-9]{8}"
            title="Debe tener 9 digitos y empezar con 9"
            value={telefono}
            // borra todo lo que no sea numero mientras se escribe
            onChange={(e) => setTelefono(e.target.value.replace(/\D/g, ''))}
            required
          />
        </label>

        <label className="campo-ancho">
          Correo
          <input
            type="email"
            placeholder="Ej: camila@correo.cl"
            pattern="[^@\s]+@[^@\s]+\.[a-z]{2,}"
            title="Escribe un correo completo, por ejemplo nombre@correo.cl"
            value={correo}
            onChange={(e) => setCorreo(e.target.value)}
          />
        </label>
      </div>

      <button type="submit" className="boton-registrar">
        Registrar paciente
      </button>
    </form>
  );
}

export default FormularioPaciente;