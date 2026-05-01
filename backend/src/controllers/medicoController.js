const repo = require('../repositories/medicoRepository');

const getAll = async (req, res, next) => {
  try {
    const medicos = await repo.findAll();
    res.json(medicos);
  } catch (err) { next(err); }
};

module.exports = { getAll };