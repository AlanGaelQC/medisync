const errorMiddleware = (err, req, res, next) => {
  if (process.env.NODE_ENV !== 'production') {
    console.error(err.stack);
  } else {
    console.error(`[${new Date().toISOString()}] ${err.status || 500} - ${err.message}`);
  }

  if (err.status === 404) {
    return res.status(404).json({ error: 'Recurso no encontrado' });
  }

  res.status(err.status || 500).json({
    error: err.status ? err.message : 'Error interno del servidor'
  });
};

module.exports = errorMiddleware;