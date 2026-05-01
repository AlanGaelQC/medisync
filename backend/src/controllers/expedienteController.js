const repo = require('../repositories/expedienteRepository');

const getByPaciente = async (req, res, next) => {
  try {
    const expediente = await repo.findByPaciente(req.params.paciente_id);
    res.json(expediente);
  } catch (err) { next(err); }
};

const addNota = async (req, res, next) => {
  try {
    const id = await repo.create({ ...req.body, paciente_id: req.params.paciente_id });
    res.status(201).json({ id });
  } catch (err) { next(err); }
};

module.exports = { getByPaciente, addNota };