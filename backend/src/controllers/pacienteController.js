const repo = require('../repositories/pacienteRepository');

const getAll = async (req, res, next) => {
  try {
    const pacientes = await repo.findAll();
    res.json(pacientes);
  } catch (err) { next(err); }
};

const getById = async (req, res, next) => {
  try {
    const paciente = await repo.findById(req.params.id);
    if (!paciente) return res.status(404).json({ error: 'Paciente no encontrado' });
    res.json(paciente);
  } catch (err) { next(err); }
};

const create = async (req, res, next) => {
  try {
    const id = await repo.create(req.body);
    res.status(201).json({ id });
  } catch (err) { next(err); }
};

module.exports = { getAll, getById, create };