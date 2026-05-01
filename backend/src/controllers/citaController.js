const repo = require('../repositories/citaRepository');
const { notificarCita } = require('../services/notificacionService');

const getToday = async (req, res, next) => {
  try {
    const citas = await repo.findToday();
    res.json(citas);
  } catch (err) { next(err); }
};

const create = async (req, res, next) => {
  try {
    const id = await repo.create(req.body);
    await notificarCita(req.body);
    res.status(201).json({ id });
  } catch (err) { next(err); }
};

const update = async (req, res, next) => {
  try {
    await repo.update(req.params.id, req.body);
    res.json({ mensaje: 'Cita actualizada' });
  } catch (err) { next(err); }
};

const remove = async (req, res, next) => {
  try {
    await repo.remove(req.params.id);
    res.json({ mensaje: 'Cita cancelada' });
  } catch (err) { next(err); }
};

module.exports = { getToday, create, update, remove };