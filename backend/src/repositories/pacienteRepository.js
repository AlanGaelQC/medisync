const getConnection = require('../db');

const findAll = async () => {
  const db = await getConnection();
  const [rows] = await db.query('SELECT * FROM pacientes ORDER BY nombre ASC');
  return rows;
};

const findById = async (id) => {
  const db = await getConnection();
  const [rows] = await db.query('SELECT * FROM pacientes WHERE id = ?', [id]);
  return rows[0] || null;
};

const create = async (paciente) => {
  const db = await getConnection();
  const [result] = await db.query('INSERT INTO pacientes SET ?', [paciente]);
  return result.insertId;
};

module.exports = { findAll, findById, create };