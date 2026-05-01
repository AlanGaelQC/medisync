import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import PrivateRoute from './components/PrivateRoutes';
import Login from './pages/Login/Login';
import Dashboard from './pages/Dashboard/Dashboard';
import Agenda from './pages/Agenda/Agenda';
import PerfilPaciente from './pages/Paciente/PerfilPaciente';

export default function App() {
    return (
        <AuthProvider>
            <BrowserRouter>
                <Routes>
                    <Route path="/login" element={<Login />}/>
                    <Route path="/" element={<PrivateRoute><Dashboard /></PrivateRoute>} />
                    <Route path="/agenda" element={<PrivateRoute><Agenda /></PrivateRoute>} />
                    <Route path="/pacientes/:id" element={<PrivateRoute><PerfilPaciente /></PrivateRoute>} />
                    <Route path="*" element={<Navigate to="/" />} />
                </Routes>
            </BrowserRouter>
        </AuthProvider>
    );
}