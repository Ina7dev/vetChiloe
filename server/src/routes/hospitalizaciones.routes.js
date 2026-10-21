import { Router } from 'express';
import { 
  getHospitalizaciones, 
  createHospitalizacion, 
  deleteHospitalizacion 
} from '../controllers/hospitalizaciones.controller.js';

const router = Router();

router.get('/', getHospitalizaciones);
router.post('/', createHospitalizacion);
router.delete('/:id', deleteHospitalizacion);

export default router;