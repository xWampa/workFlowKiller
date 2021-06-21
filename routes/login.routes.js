const { Router } = require('express');
const { check } = require('express-validator');

const router = Router();

const { loginPost } = require('../controllers/login.controller');
const { validarCampos } = require('../middlewares/validar-campos');

router.post('/', [
    check('user', 'Es necesario el user').not().isEmpty(),
    check('passwd', 'Es necesaria la contraseña').not().isEmpty(),
    validarCampos
], loginPost);


module.exports = router;