const router = require('express').Router();
const auth = require('../middleware/authMiddleware');
const { getAll } = require('../controllers/medicoController');
router.get('/', auth, getAll);
module.exports = router;