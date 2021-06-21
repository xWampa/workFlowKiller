const { Router } = require('express');
const { check } = require('express-validator');

const router = Router();

const { userGet, userPost, userPut, userDelete, usersGet } = require('../controllers/users.controller');
const { validarCampos } = require('../middlewares/validar-campos');

router.get('/:id', [
    check('id', 'Es necesario especificar el id').not().isEmpty(),
    validarCampos
], userGet);

router.post('/', [
    check('name', 'Es necesario especificar el nombre').not().isEmpty(),
    check('email', 'Es necesario especificar un email correcto').isEmail(),
    check('login', 'Es necesario especificar un login').not().isEmpty(),
    check('passwd', 'Es necesario especificar el password').not().isEmpty(),
    validarCampos
], userPost);

router.put('/', [
    //falta el put en el controller, validar campos necesarios
], userPut);

router.delete('/:id', [
    check('id', 'Es necesario especificar el id').not().isEmpty(),
    validarCampos
], userDelete);

router.get('/users', usersGet);

module.exports = router;