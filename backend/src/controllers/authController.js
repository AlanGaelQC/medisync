const jwt = require('jsonwebtoken');
const getConnection = require('../db');

const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const db = await getConnection();
    const [rows] = await db.query('SELECT * FROM usuarios WHERE email = ? AND password = ?', [email, password]);
    if (!rows[0]) return res.status(401).json({ error: 'Credenciales incorrectas' });
    const token = jwt.sign({ id: rows[0].id, rol: rows[0].rol }, process.env.JWT_SECRET, { expiresIn: '8h' });
    res.json({ token });
  } catch (err) { next(err); }
};

module.exports = { login };