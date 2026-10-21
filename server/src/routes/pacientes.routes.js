import { Router } from 'express';
import { obtenerPacientes, crearPaciente, eliminarPaciente } from '../controllers/pacientes.controller.js';

const router = Router();

router.get('/', obtenerPacientes);
router.post('/', crearPaciente);
router.delete('/:id', eliminarPaciente);

export default router;