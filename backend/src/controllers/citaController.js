const repo = require('../repositories/citaRepository');
const { notificarCita } = require('../services/notificacionService');

const getAll = async (req, res, next) => {
  try {
    const citas = await repo.findAll();
    res.json(citas);
  } catch (err) { next(err); }
};

const create = async (req, res, next) => {
  try {
    const { paciente_id, medico_id, fecha, hora_inicio, hora, estado } = req.body;
    const cita = {
      paciente_id,
      medico_id,
      fecha,
      hora: hora ?? hora_inicio,
      ...(estado && { estado }),
    };
    const id = await repo.create(cita);
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

module.exports = { getAll, create, update, remove };