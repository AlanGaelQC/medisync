const getConnection = require('../db');

const findAll = async () => {
  const db = await getConnection();
  const [rows] = await db.query('SELECT * FROM medicos ORDER BY nombre ASC');
  return rows;
};

module.exports = { findAll };