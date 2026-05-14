import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import PrivateRoute from './components/PrivateRoutes';

// Login
import Login from './pages/Login/Login';

// Vista Médico
import MedicoDashboard from './pages/Medico/Dashboard';
import MedicoAgenda from './pages/Medico/Agenda';
import MedicoListaPacientes from './pages/Medico/ListaPacientes';
import MedicoPerfilPaciente from './pages/Medico/PerfilPaciente';

// Vista Paciente
import PacienteMiExpediente from './pages/Paciente/MiExpediente';
import PacienteMisCitas from './pages/Paciente/MisCitas';
import PacienteNuevaCita from './pages/Paciente/NuevaCita';

export default function App() {
    return (
        <AuthProvider>
            <BrowserRouter>
                <Routes>
                    {/* Pública */}
                    <Route path="/login" element={<Login />} />

                    {/* Vista Médicos */}
                    <Route path="/medico/dashboard" element={<PrivateRoute rol="medico"><MedicoDashboard /></PrivateRoute>} />
                    <Route path="/medico/agenda" element={<PrivateRoute rol="medico"><MedicoAgenda /></PrivateRoute>} />
                    <Route path="/medico/pacientes" element={<PrivateRoute rol="medico"><MedicoListaPacientes /></PrivateRoute>} />
                    <Route path="/medico/pacientes/:id" element={<PrivateRoute rol="medico"><MedicoPerfilPaciente /></PrivateRoute>} />

                    {/* Vista Paciente */}
                    <Route path="/paciente/expediente" element={<PrivateRoute rol="paciente"><PacienteMiExpediente /></PrivateRoute>} />
                    <Route path="/paciente/citas" element={<PrivateRoute rol="paciente"><PacienteMisCitas /></PrivateRoute>} />
                    <Route path="/paciente/nueva-cita" element={<PrivateRoute rol="paciente"><PacienteNuevaCita /></PrivateRoute>} />

                    {/* Ruta raíz - redirije según el rol */}
                    <Route path="/" element={<RedirigirSegunRol />} />
                    <Route path="*" element={<Navigate to="/" />} />
                </Routes>
            </BrowserRouter>
        </AuthProvider>
    );
}

// Componente que lee el rol y redirige a la vista correspondiente
function RedirigirSegunRol() {
    const usuario =JSON.parse(localStorage.getItem('usuario') || '{}');
    if (usuario?.rol === 'medico')        return <Navigate to="/medico/dashboard" replace />;
    if (usuario?.rol === 'recepcionista') return <Navigate to="/medico/dashboard" replace />;
    if (usuario?.rol === 'admin')         return <Navigate to="/medico/dashboard" replace />;
    if (usuario?.rol === 'paciente')      return <Navigate to="/paciente/expediente" replace />;
    return <Navigate to="/login" replace />;
}