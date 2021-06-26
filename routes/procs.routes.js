const { Router } = require('express');
const { check } = require('express-validator');

const router = Router();

const { procsGet, procsPost } = require('../controllers/procs.controller');
const { validarCampos } = require('../middlewares/validar-campos');

router.get('/', procsGet);
router.post('/', [
    check('workflow', 'Es necesario el workflow').not().isEmpty(),
    validarCampos
], procsPost);


module.exports = router;