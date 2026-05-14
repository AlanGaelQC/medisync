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

    let paciente_id = null;
    if (usuario.rol === 'paciente') {
      const [pRows] = await db.query('SELECT id FROM pacientes WHERE usuario_id = ?', [usuario.id]);
      if (pRows.length > 0) paciente_id = pRows[0].id;
    }

    let medico_id = null;
    if (usuario.rol === 'medico') {
      const [mRows] = await db.query('SELECT id FROM medicos WHERE usuario_id = ?', [usuario.id]);
      if (mRows.length > 0) medico_id = mRows[0].id;
    }

    res.json({ token, id: usuario.id, nombre: usuario.nombre, rol: usuario.rol, paciente_id, medico_id });
  } catch (err) { next(err); }
};

module.exports = { login };