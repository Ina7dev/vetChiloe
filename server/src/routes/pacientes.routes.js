const express = require('express');
const controlador = require('../controllers/pacientes.controller');

const router = express.Router();

// buscar va antes que cualquier ruta con /:id para que express no lo tome como un id
router.get('/buscar', controlador.buscar);
router.get('/', controlador.listar);
router.post('/', controlador.crear);

module.exports = router;