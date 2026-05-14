import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../api/axios';

export default function ListaPacientes() {
    const navigate = useNavigate();
    const [pacientes, setPacientes] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        api.get('/pacientes')
            .then(({ data }) => setPacientes(data))
            .catch(console.error)
            .finally(() => setLoading(false));
    }, []);

    return (
        <div style={s.page}>
            <div style={s.toolbar}>
                <button onClick={() => navigate('/')} style={s.back}>← Dashboard</button>
                <h2 style={s.title}>👥 Pacientes</h2>
            </div>

            {loading ? (
                <p style={{ padding: 20 }}>Cargando pacientes...</p>
            ) : pacientes.length === 0 ? (
                <p style={{ padding: 20, color: '#999' }}>Sin pacientes registrados.</p>
            ) : (
                <div style={s.listWrap}>
                    {pacientes.map(p => (
                        <div key={p.id} style={s.row} onClick={() => navigate(`/medico/pacientes/${p.id}`)}>
                            <div style={s.avatar}>{(p.nombre ?? '?')[0].toUpperCase()}</div>
                            <div style={s.info}>
                                <div style={s.nombre}>{p.nombre}</div>
                                <div style={s.email}>{p.email ?? '—'}</div>
                            </div>
                            <span style={s.arrow}>›</span>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}

const s = {
    page:     { fontFamily: 'Inter,sans-serif', background: '#f4f6f9', minHeight: '100vh' },
    toolbar:  { display: 'flex', alignItems: 'center', gap: 12, padding: '14px 20px', background: '#fff', borderBottom: '1px solid #e0e4ea' },
    back:     { background: 'none', border: 'none', color: '#1a3a5c', cursor: 'pointer', fontSize: 13, fontWeight: 600 },
    title:    { fontSize: 16, fontWeight: 600, color: '#1a1a2e', margin: 0 },
    listWrap: { padding: 20, display: 'flex', flexDirection: 'column', gap: 8 },
    row:      { display: 'flex', alignItems: 'center', gap: 14, background: '#fff', borderRadius: 8, padding: '12px 16px', cursor: 'pointer', boxShadow: '0 1px 3px rgba(0,0,0,.06)' },
    avatar:   { width: 40, height: 40, borderRadius: '50%', background: '#c8daf0', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 16, fontWeight: 700, color: '#1a3a5c', flexShrink: 0 },
    info:     { flex: 1 },
    nombre:   { fontSize: 14, fontWeight: 600, color: '#1a1a2e' },
    email:    { fontSize: 12, color: '#888', marginTop: 2 },
    arrow:    { fontSize: 20, color: '#bbb' },
};
