const { Router } = require('express');
const { check } = require('express-validator');

const router = Router();

const { usersGet } = require('../controllers/users.controller');
const { validarCampos } = require('../middlewares/validar-campos');

router.get('/', usersGet);

module.exports = router;