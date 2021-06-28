const { Router } = require('express');
const { check } = require('express-validator');

const router = Router();

const { procsGet, procsPut } = require('../controllers/procs.controller');
const { validarCampos } = require('../middlewares/validar-campos');

router.get('/', procsGet);
router.put('/', [
    check('workflow', 'Es necesario el workflow').not().isEmpty(),
    validarCampos
], procsPut);


module.exports = router;