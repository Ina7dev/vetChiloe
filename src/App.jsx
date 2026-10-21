import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import Home from './components/Home';
import ListaPacientes from './components/ListaPacientes';
import FormularioPaciente from './components/FormularioPaciente';
import HistorialClinico from './components/HistorialClinico';
import Hospitalizacion from './components/Hospitalizacion';
import FloatingActionButton from './components/FloatingActionButton';
import { obtenerPacientes, registrarPaciente } from './services/pacienteService';
import { obtenerHospitalizados, ingresarHospitalizacion, darDeAltaPaciente } from './services/hospitalizacionService';
import './App.css';

function App() {
  const [pestanaActiva, setPestanaActiva] = useState('home');
  const [pacienteSeleccionadoHistorial, setPacienteSeleccionadoHistorial] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [pacientes, setPacientes] = useState([]);
  const [hospitalizados, setHospitalizados] = useState([]);

  // 1. Carga inicial de datos desde la API
  useEffect(() => {
    // Cargar Pacientes
    obtenerPacientes()
      .then((data) => setPacientes(data))
      .catch((err) => console.error("Error al cargar pacientes:", err));

    // Cargar Hospitalizados
    obtenerHospitalizados()
      .then((data) => setHospitalizados(data))
      .catch((err) => console.error("Error al cargar hospitalizaciones:", err));
  }, []);

  // 2. Registrar nuevo paciente
  const agregarPaciente = async (nuevo) => {
    try {
      const pacienteCreado = await registrarPaciente(nuevo);
      setPacientes((prev) => [pacienteCreado, ...prev]);
      setIsModalOpen(false);
    } catch (err) {
      alert(err.message || "Error al registrar el paciente");
    }
  };

  // 3. Registrar nuevo paciente a hospitalización
  const handleAgregarHospitalizado = async (nuevoHosp) => {
    try {
      await ingresarHospitalizacion(nuevoHosp);
      const actualizados = await obtenerHospitalizados();
      setHospitalizados(actualizados);
    } catch (err) {
      alert(err.message || "Error al ingresar a hospitalización");
    }
  };

  // 4. Dar de alta a un paciente
  const handleDarDeAlta = async (id) => {
    try {
      await darDeAltaPaciente(id);
      setHospitalizados((prev) => prev.filter((h) => h.id !== id));
    } catch (err) {
      alert(err.message || "Error al dar de alta al paciente");
    }
  };

  return (
    <div className="app-container">
      <Navbar pestanaActiva={pestanaActiva} setPestanaActiva={setPestanaActiva} />

      <main className="main-content">
        {pestanaActiva === 'home' && (
          <Home 
            pacientes={pacientes} 
            setPestanaActiva={setPestanaActiva}
            setPacienteSeleccionadoHistorial={setPacienteSeleccionadoHistorial}
          />
        )}
        
        {pestanaActiva === 'pacientes' && (
          <ListaPacientes 
            pacientes={pacientes} 
            setPestanaActiva={setPestanaActiva}
            setPacienteSeleccionadoHistorial={setPacienteSeleccionadoHistorial}
          />
        )}
        
        {pestanaActiva === 'hospitalizacion' && (
          <Hospitalizacion 
            pacientes={pacientes} 
            hospitalizados={hospitalizados}
            agregarHospitalizado={handleAgregarHospitalizado}
            darDeAlta={handleDarDeAlta}
          />
        )}
        
        {pestanaActiva === 'historial' && (
          <HistorialClinico 
            pacientes={pacientes} 
            pacienteSeleccionado={pacienteSeleccionadoHistorial}
            setPacienteSeleccionado={setPacienteSeleccionadoHistorial}
          />
        )}
      </main>

      {/* Botón Flotante y Modal de Registro */}
      <FloatingActionButton 
        isOpen={isModalOpen}
        onOpen={() => setIsModalOpen(true)}
        onClose={() => setIsModalOpen(false)}
      >
        <FormularioPaciente 
          agregarPaciente={agregarPaciente}
          volverALista={() => setIsModalOpen(false)}
        />
      </FloatingActionButton>

      <footer className="footer">
        <p>© 2026 VetChiloé - Sistema de Información Veterinaria</p>
      </footer>
    </div>
  );
}

export default App;