import { useEffect, useState } from "react";
import { useNavigate } from 'react-router-dom';
import { useAuth } from "../../context/AuthContext";
import api from "../../api/axios";

const TIPO_BG = { consulta:'#b8dcff', seguimiento: '#beffce', urgencia:'#fde8d4' };
const TIPO_TEXT = { consulta: '#1a3a5c', seguimiento: '#1a5c35', urgencia:'#a72424'};

export default function Dashboard() {
    const { usuario, logout } = useAuth;
    const navigate = useNavigate();
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        //GET /dashboard
        api.get('/dashboard')
            .then(({ data }) => setStats(data))
            .catch(console.error)
            .finally(() => setLoading(false));
    }, []);

    const navItems = [
        { label: '📊 Dashboard', path: '/'},
        { label: '📅 Agenda', path: '/agenda'},
        { label: '👥 Pacientes', path: '/pacientes'},
    ];

    return (
        <div style={s.layout}>
            {/* Header */}
            <div style={s.header}>
                <span style={s.headerTitle}>⚕️ MediSync</span>
                <span style={s.headerUser}>{usuario?.nombre || usuario?.email}</span>
                <button onClick={() => { logout(); navigate('/login'); }} style={s.logoutBtn}>
                    Cerrar sesión
                </button>
            </div>

            <div style={s.body}>
                {/* Sidebar */}
                <div style={s.sidebar}>
                    {navItems.map(n => (
                        <div key={n.label} onClick={() => navigate(n.path)} style={s.navItem}>
                            {n.label}
                        </div>
                    ))}
                </div>

                {/* Contenido Principal */}
                <div style={s.kpiRow}>
                    {[
                        { label: 'Citas hoy', val: stats?.citas_hoy ?? stats?.citasHoy ?? '-' },
                        { label: 'Total pacientes', val: stats?.total_pacientes ?? stats?.totalPacientes ?? '-' },
                        { label: 'Médicos activos', val: stats?.total_medicos ?? stats?.totalMedicos ?? '-' },
                        { label: 'Pendientes', val: stats?.pendientes ?? '-' },
                    ].map(k => (
                        <div key={k.label} style={s.kpiCard}>
                            <div style={s.kpiLabel}>{k.label}</div>
                            <div style={s.kpiVal}>{k.val}</div>
                        </div>
                    ))}
                </div>

                {/* Proximas Citas */}
            </div>
        </div>
    )
}