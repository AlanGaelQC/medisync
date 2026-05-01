const getConnection = require('../db');

const findToday = async () => {
  const db = await getConnection();
  const [rows] = await db.query('SELECT * FROM citas WHERE DATE(fecha) = CURDATE()');
  return rows;
};

const create = async (cita) => {
  const db = await getConnection();
  const [result] = await db.query('INSERT INTO citas SET ?', [cita]);
  return result.insertId;
};

const update = async (id, cita) => {
  const db = await getConnection();
  await db.query('UPDATE citas SET ? WHERE id = ?', [cita, id]);
};

const remove = async (id) => {
  const db = await getConnection();
  await db.query('DELETE FROM citas WHERE id = ?', [id]);
};

module.exports = { findToday, create, update, remove };