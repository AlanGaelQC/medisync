const router = require('express').Router();
const auth = require('../middleware/authMiddleware');
const { getMetricas } = require('../controllers/dashboardController');
router.get('/', auth, getMetricas);
module.exports = router;