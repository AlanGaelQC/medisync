const express = require('express');
const dotenv = require('dotenv');

dotenv.config();

const app = express();
app.use(express.json());

// Rutas
app.use('/auth', require('./routes/authRoutes'));
app.use('/pacientes', require('./routes/pacienteRoutes'));
app.use('/citas', require('./routes/citaRoutes'));
app.use('/medicos', require('./routes/medicoRoutes'));
app.use('/expediente', require('./routes/expedienteRoutes'));
app.use('/dashboard', require('./routes/dashboardRoutes'));

// Error middleware
app.use(require('./middleware/errorMiddleware'));

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`MediSync backend corriendo en puerto ${PORT}`);
});

module.exports = app;