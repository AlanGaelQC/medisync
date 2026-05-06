import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

// Protege rutas por sesión y por rol
export default function PrivateRoute({ children, rol }) {
    const { usuario } = useAuth();

    //Sin sesión -> al login
    if (!usuario) return <Navigate to="/login" replace />;

    // Rol incorrecto -> a su vista correspondiente
    if (rol && usuario.rol !== rol) {
        if (usuario.rol === 'medico') return <Navigate to="/medico/dashboard" replace />;
        if (usuario.rol === 'paciente') return <Navigate to="/paciente/expediente" replace />;
    }

    return children;
}