const getConnection = require('../db');

const findByPaciente = async (paciente_id) => {
  const db = await getConnection();
  const [rows] = await db.query('SELECT * FROM expediente WHERE paciente_id = ? ORDER BY fecha DESC', [paciente_id]);
  return rows;
};

const create = async (nota) => {
  const db = await getConnection();
  const [result] = await db.query('INSERT INTO expediente SET ?', [nota]);
  return result.insertId;
};

module.exports = { findByPaciente, create };