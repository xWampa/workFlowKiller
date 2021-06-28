const { Router } = require('express');
const { check } = require('express-validator');

const router = Router();

const { tasksGet, taskComplet, test } = require('../controllers/tasks.controller');
const { validarCampos } = require('../middlewares/validar-campos');

router.get('/', tasksGet);
router.post('/', [
    check('usertaskID', 'Es necesario el id de la usertask a completar').not().isEmpty(),
    validarCampos
], taskComplet);
router.post('/test', test)

module.exports = router;