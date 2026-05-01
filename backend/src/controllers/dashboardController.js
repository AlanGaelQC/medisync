const getConnection = require('../db');

const getMetricas = async (req, res, next) => {
  try {
    const db = await getConnection();
    const [[{ total_pacientes }]] = await db.query('SELECT COUNT(*) as total_pacientes FROM pacientes');
    const [[{ citas_hoy }]] = await db.query('SELECT COUNT(*) as citas_hoy FROM citas WHERE DATE(fecha) = CURDATE()');
    const [[{ total_medicos }]] = await db.query('SELECT COUNT(*) as total_medicos FROM medicos');
    res.json({ total_pacientes, citas_hoy, total_medicos });
  } catch (err) { next(err); }
};

module.exports = { getMetricas };