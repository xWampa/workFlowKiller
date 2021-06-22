const { Router } = require('express');
const { check } = require('express-validator');

const router = Router();

const { runsGet } = require('../controllers/runs.controller');
const { validarCampos } = require('../middlewares/validar-campos');

router.get('/', runsGet);


module.exports = router;