const router = require('express').Router();
const auth = require('../middleware/authMiddleware');
const { getToday, create, update, remove } = require('../controllers/citaController');
router.get('/', auth, getToday);
router.post('/', auth, create);
router.put('/:id', auth, update);
router.delete('/:id', auth, remove);
module.exports = router;