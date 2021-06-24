const { Router } = require('express');
const { check } = require('express-validator');

const router = Router();

const { runsGet,runsPost } = require('../controllers/runs.controller');
const { validarCampos } = require('../middlewares/validar-campos');

router.get('/', runsGet);
router.post('/', [
    check('workflow', 'Es necesario especificar el nombre').not().isEmpty(),
    check('user', 'Es necesario especificar un email correcto').not().isEmpty(),
    check('state', 'Es necesario especificar un login').not().isEmpty(),
    validarCampos
], runsPost);

module.exports = router;