const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const getConnection = require('../db');

const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const db = await getConnection();
    const [rows] = await db.query('SELECT * FROM usuarios WHERE email = ?', [email]);
    const usuario = rows[0];
    if (!usuario) return res.status(401).json({ error: 'Credenciales incorrectas' });
    const passwordValida = await bcrypt.compare(password, usuario.password);
    if (!passwordValida) return res.status(401).json({ error: 'Credenciales incorrectas' });
    const token = jwt.sign({ id: usuario.id, rol: usuario.rol }, process.env.JWT_SECRET, { expiresIn: '8h' });
    res.json({ token, id: usuario.id, nombre: usuario.nombre, rol: usuario.rol });
  } catch (err) { next(err); }
};

module.exports = { login };