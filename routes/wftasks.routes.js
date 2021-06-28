const { Router } = require('express');
const { check } = require('express-validator');

const router = Router();

const { wftaskGet } = require('../controllers/wftasks.controller');
const { validarCampos } = require('../middlewares/validar-campos');

router.get('/', [
    check('workflow', 'Es necesario el workflow').not().isEmpty(),
    validarCampos
], wftaskGet)

module.exports = router;