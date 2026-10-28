import './TarjetaPaciente.css';
import { fotoPaciente } from '../data/fotosEspecie';

function TarjetaPaciente(props) {
  const { paciente, onVerFicha } = props;  // aqui extraemos la informacion del paciente desde las props
  return (
  <div className="tarjeta">
    <img src={fotoPaciente(paciente)} alt={`Foto de ${paciente.nombre}`} className="tarjeta-foto" />

    <h3>{paciente.nombre}</h3>
    <p><strong>Número Paciente:</strong> {paciente.numero_atencion}</p>
    <p><strong>Especie:</strong> {paciente.especie} ({paciente.raza})</p>
    <p><strong>Edad:</strong> {paciente.edad} años</p>
    {paciente.peso && <p><strong>Peso:</strong> {paciente.peso} kg</p>}

    <button className="btn-detalle" onClick={onVerFicha}>Ver Ficha Clínica</button>
  </div>
);
}
export default TarjetaPaciente;