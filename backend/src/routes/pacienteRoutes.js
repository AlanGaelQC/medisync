const router = require('express').Router();
const auth = require('../middleware/authMiddleware');
const { getAll, getById, create } = require('../controllers/pacienteController');
router.get('/', auth, getAll);
router.get('/:id', auth, getById);
router.post('/', auth, create);
module.exports = router;