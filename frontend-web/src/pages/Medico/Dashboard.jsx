import { useEffect, useState } from "react";
import { useNavigate } from 'react-router-dom';
import { useAuth } from "../../context/AuthContext";
import api from "../../api/axios";

const TIPO_BG = { consulta:'#b8dcff', seguimiento: '#beffce', urgencia:'#fde8d4' };
const TIPO_TEXT = { consulta: '#1a3a5c', seguimiento: '#1a5c35', urgencia:'#a72424'};

export default function Dashboard() {
    const { usuario, logout } = useAuth();
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
                <div style={s.main}>
                    {loading ? <p>Cargando dashboard...</p> : (
                        <>
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
                            <div style={s.card}>
                                <div style={s.cardHeader}>Próximas citas</div>
                                {(stats?.proximas_citas ?? stats?.citas ?? []).slice(0, 5).map((c, i) => (
                                    <div key={i} style={s.citaRow}>
                                        <span style={s.citaHora}>{c.hora_inicio?.slice(0,5) ?? c.hora?.slice(0,5)}</span>
                                        <div style={s.citaAvatar}>
                                            {c.paciente_nombre?.[0] ?? c.paciente?.[0] ?? '?'}
                                        </div>
                                        <span style={s.citaNombre}>
                                            {c.paciente_nombre ?? c.paciente ?? 'Paciente'}
                                        </span>
                                        <span style={{
                                            ...s.badge,
                                            background: TIPO_BG[c.tipo] ?? '#f0f0f0',
                                            color: TIPO_TEXT[c.tipo] ?? '#555',
                                        }}>
                                            {c.tipo ?? 'consulta'}
                                        </span>
                                    </div>
                                ))}
                            </div>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
}

const s = {
  layout:     { display:'flex', flexDirection:'column', minHeight:'100vh', fontFamily:'Inter,sans-serif', background:'#f4f6f9' },
  header:     { height:52, background:'#1a3a5c', display:'flex', alignItems:'center', padding:'0 20px', gap:12 },
  headerTitle:{ color:'#fff', fontWeight:700, fontSize:16, flex:1 },
  headerUser: { color:'rgba(255,255,255,.8)', fontSize:13 },
  logoutBtn:  { background:'transparent', border:'1px solid rgba(255,255,255,.3)', color:'#fff', borderRadius:5, padding:'4px 12px', fontSize:12, cursor:'pointer' },
  body:       { display:'flex', flex:1 },
  sidebar:    { width:180, background:'#fff', borderRight:'1px solid #e0e4ea', padding:'16px 0' },
  navItem:    { padding:'10px 18px', fontSize:13, color:'#555', cursor:'pointer', transition:'background .15s' },
  main:       { flex:1, padding:20, display:'flex', flexDirection:'column', gap:16 },
  kpiRow:     { display:'grid', gridTemplateColumns:'repeat(4,1fr)', gap:12 },
  kpiCard:    { background:'#fff', borderRadius:8, padding:'16px 18px', boxShadow:'0 1px 3px rgba(0,0,0,.06)' },
  kpiLabel:   { fontSize:11, color:'#888', textTransform:'uppercase', letterSpacing:'.05em' },
  kpiVal:     { fontSize:28, fontWeight:700, color:'#1a1a2e', lineHeight:1.2, marginTop:4 },
  card:       { background:'#fff', borderRadius:8, padding:16, boxShadow:'0 1px 3px rgba(0,0,0,.06)' },
  cardHeader: { fontSize:13, fontWeight:600, color:'#1a1a2e', marginBottom:12 },
  citaRow:    { display:'flex', alignItems:'center', gap:10, padding:'8px 0', borderBottom:'1px solid #f5f5f5' },
  citaHora:   { fontSize:12, color:'#999', width:40, flexShrink:0 },
  citaAvatar: { width:30, height:30, borderRadius:'50%', background:'#c8daf0', display:'flex', alignItems:'center', justifyContent:'center', fontSize:11, fontWeight:700, color:'#1a3a5c' },
  citaNombre: { fontSize:13, color:'#1a1a2e', flex:1 },
  badge:      { fontSize:11, padding:'3px 10px', borderRadius:10 },
};