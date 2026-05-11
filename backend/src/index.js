const express = require('express');
const https = require('https');
const dotenv = require('dotenv');
const selfsigned = require('selfsigned');

dotenv.config();

const app = express();
app.use(require('cors')());
app.use(express.json());

// Rutas
app.use('/api/v1/auth', require('./routes/authRoutes'));
app.use('/api/v1/pacientes', require('./routes/pacienteRoutes'));
app.use('/api/v1/citas', require('./routes/citaRoutes'));
app.use('/api/v1/medicos', require('./routes/medicoRoutes'));
app.use('/api/v1/expediente', require('./routes/expedienteRoutes'));
app.use('/api/v1/dashboard', require('./routes/dashboardRoutes'));

// Error middleware
app.use(require('./middleware/errorMiddleware'));

const PORT = process.env.PORT || 3000;
const PORT_HTTPS = process.env.PORT_HTTPS || 3001;

app.listen(PORT, () => {
  console.log(`MediSync backend HTTP corriendo en puerto ${PORT}`);
});

const attrs = [{ name: 'commonName', value: 'medisync' }];
const pems = selfsigned.generate(attrs, { days: 365 });

https.createServer({ key: pems.private, cert: pems.cert }, app).listen(PORT_HTTPS, () => {
  console.log(`MediSync backend HTTPS corriendo en puerto ${PORT_HTTPS}`);
});

module.exports = app;