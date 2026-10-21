import React, { useState } from 'react';

function Hospitalizacion({ pacientes, hospitalizados = [], agregarHospitalizado, darDeAlta }) {
  const [pacienteSeleccionadoId, setPacienteSeleccionadoId] = useState(pacientes[0]?.id || '');
  const [motivoHospitalizacion, setMotivoHospitalizacion] = useState('');
  const [estadoInicial, setEstadoInicial] = useState('En observación / Estable');
  const [cuidadosEspeciales, setCuidadosEspeciales] = useState('');
  const [guardando, setGuardando] = useState(false);

  const handleSubmitHospitalizacion = async (e) => {
    e.preventDefault();

    const targetId = pacienteSeleccionadoId || pacientes[0]?.id;
    if (!targetId) {
      alert('Debes seleccionar un paciente registrado.');
      return;
    }

    const ingresoHosp = {
      paciente_id: Number(targetId),
      motivo: motivoHospitalizacion.trim(),
      estado: estadoInicial,
      cuidados: cuidadosEspeciales.trim() || 'Monitoreo de rutina'
    };

    try {
      setGuardando(true);
      if (agregarHospitalizado) {
        await agregarHospitalizado(ingresoHosp);
      }
      setMotivoHospitalizacion('');
      setCuidadosEspeciales('');
    } catch (err) {
      console.error(err);
    } finally {
      setGuardando(false);
    }
  };

  const handleDarDeAlta = (id, nombrePaciente) => {
    if (window.confirm(`¿Confirmas el alta médica para ${nombrePaciente}?`)) {
      if (darDeAlta) darDeAlta(id);
    }
  };

  return (
    <div className="home-dashboard">
      <section className="bloque-dashboard">
        <div className="cabecera-bloque">
          <h2>Registro de Ingreso a Hospitalización</h2>
          <span className="badge-fecha">Ingreso Clínico</span>
        </div>

        <form onSubmit={handleSubmitHospitalizacion} className="form-completo">
          <div className="grid-2-col">
            <div className="campo">
              <label htmlFor="pacienteExistente">Seleccionar Paciente Registrado *</label>
              <select 
                id="pacienteExistente"
                value={pacienteSeleccionadoId || pacientes[0]?.id || ''} 
                onChange={(e) => setPacienteSeleccionadoId(e.target.value)}
              >
                {pacientes.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.nombre} — {p.especie || 'Mascota'} (Ficha: {p.numero_atencion})
                  </option>
                ))}
              </select>
            </div>

            <div className="campo">
              <label htmlFor="motivoHosp">Motivo de Hospitalización *</label>
              <input 
                type="text" 
                id="motivoHosp"
                placeholder="Ej: Observación post-quirúrgica, deshidratación..." 
                value={motivoHospitalizacion} 
                onChange={(e) => setMotivoHospitalizacion(e.target.value)} 
                required 
              />
            </div>

            <div className="campo">
              <label htmlFor="estadoInicial">Estado Inicial</label>
              <select 
                id="estadoInicial"
                value={estadoInicial} 
                onChange={(e) => setEstadoInicial(e.target.value)}
              >
                <option value="En observación / Estable">En observación / Estable</option>
                <option value="Estable / En recuperación">Estable / En recuperación</option>
                <option value="Monitoreo Continuo">Monitoreo Continuo</option>
                <option value="Crítico">Crítico</option>
              </select>
            </div>

            <div className="campo">
              <label htmlFor="cuidados">Cuidados Especiales / Indicaciones</label>
              <input 
                type="text"
                id="cuidados"
                placeholder="Ej: Aislamiento, suero fisiológico c/8h..."
                value={cuidadosEspeciales}
                onChange={(e) => setCuidadosEspeciales(e.target.value)}
              />
            </div>
          </div>

          <div className="acciones-form">
            <button type="submit" className="btn-guardar-paciente" disabled={guardando}>
              {guardando ? 'Ingresando...' : 'Ingresar Paciente a Cama'}
            </button>
          </div>
        </form>
      </section>

      <section className="bloque-dashboard">
        <div className="cabecera-bloque">
          <h2>Pacientes Actualmente Hospitalizados</h2>
          <span className="badge-total">{hospitalizados.length} Pacientes en cama</span>
        </div>

        <div className="tabla-responsive">
          <table className="tabla-dashboard">
            <thead>
              <tr>
                <th>Paciente</th>
                <th>Especie</th>
                <th>Tutor / Contacto</th>
                <th>Estado</th>
                <th>Cuidados Especiales</th>
                <th>Acción</th>
              </tr>
            </thead>
            <tbody>
              {hospitalizados.length > 0 ? (
                hospitalizados.map((hosp) => (
                  <tr key={hosp.id}>
                    <td className="nombre-paciente">{hosp.paciente}</td>
                    <td><span className="especie-tag">{hosp.especie}</span></td>
                    <td>
                      <div><strong>{hosp.tutor}</strong></div>
                      <small className="texto-contacto">{hosp.contacto}</small>
                    </td>
                    <td>
                      <span className="badge-estado">{hosp.estado}</span>
                    </td>
                    <td className="cuidados-texto">{hosp.cuidados}</td>
                    <td>
                      <button 
                        className="btn-historial"
                        onClick={() => handleDarDeAlta(hosp.id, hosp.paciente)}
                      >
                        Dar de Alta
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="6" style={{ textAlign: 'center', color: '#8c7a82' }}>
                    No hay pacientes actualmente en hospitalización.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}

export default Hospitalizacion;