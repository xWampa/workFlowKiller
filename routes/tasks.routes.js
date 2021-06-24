const { Router } = require('express');
const { check } = require('express-validator');

const router = Router();

const { tasksGet } = require('../controllers/tasks.controller');
const { validarCampos } = require('../middlewares/validar-campos');

router.get('/', tasksGet);


module.exports = router;