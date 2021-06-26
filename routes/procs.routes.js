const { Router } = require('express');
const { check } = require('express-validator');

const router = Router();

const { procsGet, procsDelete } = require('../controllers/procs.controller');
const { validarCampos } = require('../middlewares/validar-campos');

router.get('/', procsGet);
router.delete('/', [
    check('workflow', 'Es necesario el workflow').not().isEmpty(),
    validarCampos
], procsDelete)


module.exports = router;