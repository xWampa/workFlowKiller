const { Router } = require('express');
const { check } = require('express-validator');

const router = Router();

const { todoGet } = require('../controllers/todo.controller');
const { validarCampos } = require('../middlewares/validar-campos');

router.get('/', todoGet);


module.exports = router;