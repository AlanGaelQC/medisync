const router = require('express').Router();
const auth = require('../middleware/authMiddleware');
const { getByPaciente, addNota } = require('../controllers/expedienteController');
router.get('/:paciente_id', auth, getByPaciente);
router.post('/:paciente_id', auth, addNota);
module.exports = router;