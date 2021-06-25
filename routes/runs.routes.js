const { Router } = require('express');
const { check } = require('express-validator');

const router = Router();

const { runsGet, runPost, wftaskGet } = require('../controllers/runs.controller');
const { validarCampos } = require('../middlewares/validar-campos');

router.get('/', runsGet);
router.post('/', [
    check('workflow', 'Es necesario el workflow').not().isEmpty(),
    validarCampos
], runPost)

module.exports = router;