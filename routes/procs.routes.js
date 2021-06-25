const { Router } = require('express');
const { check } = require('express-validator');

const router = Router();

const { procsGet } = require('../controllers/procs.controller');
const { validarCampos } = require('../middlewares/validar-campos');

router.get('/', procsGet);


module.exports = router;