import './TablaPacientes.css';
import { fotoPaciente } from '../data/fotosEspecie';
import { claseEspecie } from '../data/claseEspecie';

function TablaPacientes({ pacientes, onVerFicha, onVerDetalle, onEliminar }) {
  return (
    <div className="contenedor-tabla">
      <table className="tabla-pacientes">
        <thead>
          <tr>
            <th>NOMBRE</th>
            <th>N° ATENCIÓN</th>
            <th>ESPECIE</th>
            <th>EDAD</th>
            <th>DIAGNÓSTICO</th>
            <th>ACCIÓN</th>
          </tr>
        </thead>
        <tbody>
          {/* una fila por cada paciente */}
          {pacientes.map((paciente) => (
            <tr key={paciente.id}>
              <td>
                {/* foto pequeña al lado del nombre */}
                <div className="celda-nombre">
                  <img className="foto-mini" src={fotoPaciente(paciente)} alt={paciente.nombre} />
                  {paciente.nombre}
                </div>
              </td>
              <td>{paciente.numero_atencion}</td>
              <td>
                <span className={claseEspecie(paciente.especie)}>
                  {paciente.especie}
                </span>
              </td>
              <td>{paciente.edad}</td>
              <td>{paciente.diagnostico}</td>
              <td>
                <div className="acciones">
                  <button className="boton-carnet" onClick={() => onVerFicha(paciente)}>
                    Ver Carnet
                  </button>
                  <button className="boton-detalle" onClick={() => onVerDetalle(paciente)}>
                    Ver Detalle
                  </button>
                  <button
                    className="boton-eliminar-mini"
                    onClick={() => onEliminar(paciente)}
                    title="Eliminar paciente"
                  >
                    🗑️
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default TablaPacientes;