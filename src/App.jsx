import { useState, useEffect } from 'react';
import './App.css';
import FichaClinica from './components/FichaClinica';
import FormularioPaciente from './components/FormularioPaciente';
import DetallePaciente from './components/DetallePaciente';
import TablaPacientes from './components/TablaPacientes';
import BarraPestanas from './components/BarraPestanas';
import BuscadorPaciente from './components/BuscadorPaciente';
import { obtenerPacientes, registrarPaciente, guardarPacientes, obtenerResumen } from './services/pacienteService';
import { claseEspecie } from './data/claseEspecie';
import razasPorEspecie from './data/Razas';


function App() {
  // la lista parte vacia y se llena cuando responde el servicio
  const [pacientes, setPacientes] = useState([]);
  // true mientras se esperan los pacientes
  const [cargando, setCargando] = useState(true);

  // guarda cual pestaña se esta viendo
  const [pestanaActiva, setPestanaActiva] = useState('inicio');
  // controla si el formulario se ve o no
  const [mostrarFormulario, setMostrarFormulario] = useState(false);
  // guarda el paciente que se quiere eliminar, null si no hay ninguno
  const [pacientePorEliminar, setPacientePorEliminar] = useState(null);
  // guarda el paciente del que se esta viendo el detalle
  const [pacienteDetalle, setPacienteDetalle] = useState(null);
  // guarda el paciente del que se esta viendo el carnet
  const [pacienteCarnet, setPacienteCarnet] = useState(null);
  // texto que se escribe en el buscador
  const [busqueda, setBusqueda] = useState('');
  // cuantos pacientes hay de cada especie, viene de la base de datos
  const [resumen, setResumen] = useState([]);

  // al abrir la pagina le pide los pacientes al servicio
  useEffect(() => {
    obtenerPacientes()
      .then((datos) => {
        setPacientes(datos);
        setCargando(false);
      })
  // si el servidor esta apagado o fallo la base de datos avisa en vez de quedarse cargando
      .catch((error) => {
        alert('No se pudo conectar con el servidor: ' + error.message);
        setCargando(false);
      });
  }, []);

  // cada vez que cambia la lista se vuelve a guardar
  // espera a que termine la carga para no guardar la lista vacia
  useEffect(() => {
    if (cargando) return;
    guardarPacientes(pacientes);
  }, [pacientes, cargando]);

  // pide el resumen por especie cada vez que cambia la lista
  // asi al registrar un paciente se actualizan los numeros
  useEffect(() => {
    if (cargando) return;
    obtenerResumen()
      .then(setResumen)
  // si falla solo no se muestran las etiquetas
      .catch(() => setResumen([]));
  }, [pacientes, cargando]);

  // separa a los que ya fueron dados de alta
  const pacientesDeAlta = pacientes.filter((paciente) => paciente.alta);

  // deja solo los que tienen el texto en el nombre o la especie
  // todo en minusculas para que no importen las mayusculas
  const filtrados = pacientes.filter((p) =>
    `${p.nombre} ${p.especie}`.toLowerCase()
      .includes(busqueda.toLowerCase())
  );

  const agregarPaciente = (datosPaciente) => {
    // el servicio le pone id, numero de atencion e historial
    registrarPaciente(datosPaciente)
      .then((nuevoPaciente) => {
        setPacientes([nuevoPaciente, ...pacientes]);
        // oculta el formulario despues de registrar
        setMostrarFormulario(false);
        // muestra la lista para ver al paciente nuevo
        setPestanaActiva('pacientes');
      })
      // si el servidor rechaza al paciente se muestra el motivo
      .catch((error) => alert(error.message));
  };

  // registra un nuevo ingreso de una mascota que ya tiene ficha
  const reingresarPaciente = (idPaciente, motivo) => {
    const hoy = new Date().toLocaleDateString('es-CL');

    setPacientes(pacientes.map((paciente) =>
      paciente.id === idPaciente
        ? {
            ...paciente,
            alta: false,
            diagnostico: motivo,
            historial: [
              ...paciente.historial,
              { fecha: hoy, motivo: 'Ingreso', detalle: motivo }
            ]
          }
        : paciente
    ));
    setMostrarFormulario(false);
    setPestanaActiva('pacientes');
  };

  const confirmarEliminar = () => {
    // deja en la lista a todos menos al paciente elegido
    setPacientes(pacientes.filter((paciente) => paciente.id !== pacientePorEliminar.id));
    setPacientePorEliminar(null);
  };

  const darDeAlta = (pacienteAlta) => {
    const hoy = new Date().toLocaleDateString('es-CL');

    // recorre la lista y solo cambia al paciente elegido
    setPacientes(pacientes.map((paciente) =>
      paciente.id === pacienteAlta.id
        ? {
            ...paciente,
            alta: true,
            historial: [
              ...paciente.historial,
              { fecha: hoy, motivo: 'Alta', detalle: 'Paciente dado de alta.' }
            ]
          }
        : paciente
    ));
    setPacienteCarnet(null);
  };

  return (
    <div className="contenedor-principal">
      <header className="cabecera">
        <h1>Sistema de Información - VetPenguin</h1>
        <p>Plataforma de control y seguimiento de pacientes</p>
      </header>

      <BarraPestanas pestanaActiva={pestanaActiva} onCambiar={setPestanaActiva} />

      <main>
        {/* pestaña de inicio, por ahora con un texto provisorio */}
        {pestanaActiva === 'inicio' && (
          <>
            <h2>Inicio</h2>
            <p className="sin-pacientes">Aquí va a ir el resumen de la clínica.</p>
          </>
        )}

        {/* pestaña con todos los pacientes */}
        {pestanaActiva === 'pacientes' && (
          <>
            <h2>Lista de Pacientes Registrados</h2>
            {cargando ? (
              <p className="sin-pacientes">Cargando pacientes...</p>
            ) : pacientes.length === 0 ? (
              <p className="sin-pacientes">Aún no hay pacientes registrados.</p>
            ) : (
                            <>
                {/* etiquetas con el total de cada especie, con los colores de los badges */}
                <div className="resumen-especies">
                  {resumen.map((fila) => (
                    <span key={fila.especie} className={claseEspecie(fila.especie)}>
                      {fila.especie}: {fila.total}
                    </span>
                  ))}
                </div>

                <BuscadorPaciente texto={busqueda} onCambiar={setBusqueda} />
                <p className="contador">{filtrados.length} de {pacientes.length} pacientes</p>

                {/* si el filtro no deja a nadie se avisa en vez de mostrar la tabla vacia */}
                {filtrados.length === 0 ? (
                  <p className="sin-pacientes">No se encontraron pacientes</p>
                ) : (
                  <TablaPacientes
                    pacientes={filtrados}
                    onVerFicha={setPacienteCarnet}
                    onVerDetalle={setPacienteDetalle}
                    onEliminar={setPacientePorEliminar}
                  />
                )}
              </>
            )}
          </>
        )}

        {/* pestaña solo con los dados de alta */}
        {pestanaActiva === 'altas' && (
          <>
            <h2>Pacientes Dados de Alta</h2>
            {cargando ? (
              <p className="sin-pacientes">Cargando pacientes...</p>
            ) : pacientesDeAlta.length === 0 ? (
              <p className="sin-pacientes">Aún no hay pacientes dados de alta.</p>
            ) : (
              <TablaPacientes
                pacientes={pacientesDeAlta}
                onVerFicha={setPacienteCarnet}
                onVerDetalle={setPacienteDetalle}
                onEliminar={setPacientePorEliminar}
              />
            )}
          </>
        )}

        {/* el boton flotante se ve en todas las pestañas */}
        <button
          className="boton-flotante"
          onClick={() => setMostrarFormulario(true)}
          title="Agregar paciente"
        >
          +
        </button>

        {/* el formulario se abre como ventana encima de la pagina */}
        {mostrarFormulario && (
          <div className="fondo-ventana">
            <div className="ventana-formulario con-scroll">
              <button
                className="boton-cerrar"
                onClick={() => setMostrarFormulario(false)}
              >
                ✕
              </button>
              <FormularioPaciente
                pacientes={pacientes}
                razasPorEspecie={razasPorEspecie}
                onAgregar={agregarPaciente}
                onReingresar={reingresarPaciente}
              />
            </div>
          </div>
        )}
      </main>

      {/* ventana con el carnet giratorio del paciente */}
      {pacienteCarnet && (
        <div className="fondo-ventana">
          <div className="ventana-carnet">
            <button className="boton-cerrar" onClick={() => setPacienteCarnet(null)}>
              ✕
            </button>
            <FichaClinica
              paciente={pacienteCarnet}
              onDarDeAlta={darDeAlta}
            />
          </div>
        </div>
      )}

      {/* ventana con el detalle completo del paciente */}
      {pacienteDetalle && (
        <DetallePaciente
          paciente={pacienteDetalle}
          onCerrar={() => setPacienteDetalle(null)}
        />
      )}

      {/* ventana de confirmacion, solo aparece si hay un paciente por eliminar */}
      {pacientePorEliminar && (
        <div className="fondo-ventana">
          <div className="ventana">
            <h3>Eliminar paciente</h3>
            <p>
              ¿Seguro que quieres eliminar a <strong>{pacientePorEliminar.nombre}</strong>?
              Esta acción no se puede deshacer.
            </p>
            <div className="ventana-botones">
              <button className="boton-cancelar" onClick={() => setPacientePorEliminar(null)}>
                Cancelar
              </button>
              <button className="boton-confirmar" onClick={confirmarEliminar}>
                Eliminar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;