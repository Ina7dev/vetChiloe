import { getDataPacientes,insertDataPacientes } from "../service/server/pacientes.service.js";


export async function getPacientes(req, res) {
    
    try {
        const pacientes = await getDataPacientes(req); 
        res.status(200).json(pacientes)
    }
    catch (err) {
        res.status(500).json({error: err.message})
    }
}
export async function postPaciente (req, res) {
    try {
        const nuevoPaciente = await insertDataPacientes(req.body);
        res.status(201).json(nuevoPaciente)
    }
    catch (err) {
        const numeroHttp = err.status || err.statusCode || (err.response && err.response.status) || 500;
        res.status(numeroHttp).json({error: err.message})
    }

}

