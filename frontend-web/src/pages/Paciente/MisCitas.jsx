import { useEffect, useState } from "react";
import { useNavigate } from 'react-router-dom';
import { useAuth } from "../../context/AuthContext";
import api from "../../api/axios";

const ESTADO_BG = { pendiente:'#fef9e8', confirmada:'#e0f5ec', completada:'#f0f0f0', cancelada:'#fde8e8', en_curso:'#e8f0f8' };
const ESTADO_TEXT = { pendiente:'#b8860b', confirmada:'#2a7a4b', completada:'#888', cancelada:'#c0392b', en_curso:'#1a3a5c'};
const TIPO_LABEL = { consulta:'Consulta general', seguimiento:'Seguimiento', urgencia:'Urgencia', primera_vez:'Primera vez' };

export default function MisCitas () {
    const { usuario, logout } = useAuth();
    const navigate = useNavigate();
    const [citas, setCitas] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filtro, setFiltro] = useState('proximas');

    useEffect(() => {
        // GET /citas - se filtra por paciente en eol frontend
        api.get('/citas')
            .then(({data}) => {
                // Filtramos solo las citas del paciente autenticado
                const misCitas = data.filter(c =>
                (c.paciente_id ?? c.pacienteId) === usuario?.id
                );
                setCitas(misCitas);
            })
            .catch(console.error)
            .finally(() => setLoading(false));
    }, [usuario]);

    const hoy = new Date().toISOString().split('T')[0];

    const citasFiltradas = citas.filter(c => {
        const fecha = c.fecha ?? c.date ?? '';
        if (filtro === 'proximas') return fecha >= hoy && c.estado !== 'cancelada';
        if (filtro === 'historial') return fecha < hoy || c.estado === 'completada';
        return true;
    });

    return (
    <div style={s.page}>
      {/* Header */}
      <div style={s.header}>
        <span style={s.headerTitle}>🏥 MediSync</span>
        <span style={s.headerUser}>{usuario?.nombre}</span>
        <button onClick={() => { logout(); navigate('/login'); }} style={s.logoutBtn}>
          Cerrar sesión
        </button>
      </div>

      {/* Navbar */}
      <div style={s.navbar}>
        <div onClick={() => navigate('/paciente/expediente')} style={s.navItem}>Mi Expediente</div>
        <div onClick={() => navigate('/paciente/citas')}      style={{ ...s.navItem, ...s.navActive }}>Mis Citas</div>
        <div onClick={() => navigate('/paciente/nueva-cita')} style={s.navItem}>Agendar Cita</div>
      </div>

      <div style={s.content}>
        {/* Título y botón */}
        <div style={s.topRow}>
          <h2 style={s.title}>Mis Citas</h2>
          <button onClick={() => navigate('/paciente/nueva-cita')} style={s.btnBlue}>
            + Agendar nueva cita
          </button>
        </div>

        {/* Filtro */}
        <div style={s.filtroRow}>
          {['proximas', 'historial'].map(f => (
            <button key={f} onClick={() => setFiltro(f)}
              style={{ ...s.filtroBtn, ...(filtro === f ? s.filtroBtnActive : {}) }}>
              {f === 'proximas' ? 'Próximas' : 'Historial'}
            </button>
          ))}
        </div>

        {/* Lista de citas */}
        {loading ? <p style={{ color:'#999', fontSize:13 }}>Cargando citas...</p> : (
          <>
            {citasFiltradas.length === 0 && (
              <div style={s.empty}>
                <div style={{ fontSize:40, marginBottom:10 }}>📅</div>
                <div style={{ fontSize:14, color:'#999' }}>
                  {filtro === 'proximas' ? 'No tienes citas próximas.' : 'Sin historial de citas.'}
                </div>
                {filtro === 'proximas' && (
                  <button onClick={() => navigate('/paciente/nueva-cita')} style={{ ...s.btnBlue, marginTop:14 }}>
                    Agendar cita
                  </button>
                )}
              </div>
            )}

            {citasFiltradas.map((c, i) => (
              <div key={i} style={s.citaCard}>
                <div style={s.citaLeft}>
                  <div style={s.citaFecha}>
                    {new Date(c.fecha ?? c.date).toLocaleDateString('es-MX', { weekday:'long', day:'numeric', month:'long' })}
                  </div>
                  <div style={s.citaHora}>
                    🕐 {(c.hora_inicio ?? c.hora ?? '').slice(0,5)} hrs
                  </div>
                  <div style={s.citaTipo}>
                    {TIPO_LABEL[c.tipo] ?? c.tipo ?? 'Consulta'}
                  </div>
                  <div style={s.citaMedico}>
                    👨‍⚕️ Dr. {c.medico_nombre ?? c.medico ?? '—'} {c.medico_apellido ?? ''}
                  </div>
                </div>
                <div style={s.citaRight}>
                  <span style={{
                    ...s.estadoBadge,
                    background: ESTADO_BG[c.estado]   ?? '#f0f0f0',
                    color:      ESTADO_TEXT[c.estado]  ?? '#555',
                  }}>
                    {c.estado ?? 'pendiente'}
                  </span>
                </div>
              </div>
            ))}
          </>
        )}
      </div>
    </div>
  );
}

const s = {
  page:           { fontFamily:'Inter,sans-serif', background:'#f4f6f9', minHeight:'100vh' },
  header:         { height:52, background:'#1a3a5c', display:'flex', alignItems:'center', padding:'0 20px', gap:12 },
  headerTitle:    { color:'#fff', fontWeight:700, fontSize:16, flex:1 },
  headerUser:     { color:'rgba(255,255,255,.8)', fontSize:13 },
  logoutBtn:      { background:'transparent', border:'1px solid rgba(255,255,255,.3)', color:'#fff', borderRadius:5, padding:'4px 12px', fontSize:12, cursor:'pointer' },
  navbar:         { display:'flex', background:'#fff', borderBottom:'1px solid #e0e4ea', padding:'0 20px' },
  navItem:        { padding:'12px 20px', fontSize:13, color:'#666', cursor:'pointer', borderBottom:'2px solid transparent' },
  navActive:      { color:'#1a3a5c', fontWeight:600, borderBottom:'2px solid #1a3a5c' },
  content:        { padding:20 },
  topRow:         { display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:16 },
  title:          { fontSize:18, fontWeight:600, color:'#1a1a2e', margin:0 },
  btnBlue:        { background:'#1a3a5c', color:'#fff', border:'none', borderRadius:6, padding:'8px 18px', fontSize:13, cursor:'pointer' },
  filtroRow:      { display:'flex', gap:8, marginBottom:16 },
  filtroBtn:      { padding:'6px 16px', borderRadius:20, border:'1px solid #ddd', background:'#fff', fontSize:13, color:'#666', cursor:'pointer' },
  filtroBtnActive:{ background:'#1a3a5c', color:'#fff', borderColor:'#1a3a5c' },
  empty:          { display:'flex', flexDirection:'column', alignItems:'center', padding:'50px 20px', background:'#fff', borderRadius:10 },
  citaCard:       { background:'#fff', borderRadius:10, padding:'16px 20px', marginBottom:10, display:'flex', justifyContent:'space-between', alignItems:'center', boxShadow:'0 1px 3px rgba(0,0,0,.06)' },
  citaLeft:       { display:'flex', flexDirection:'column', gap:4 },
  citaFecha:      { fontSize:14, fontWeight:600, color:'#1a1a2e', textTransform:'capitalize' },
  citaHora:       { fontSize:13, color:'#555' },
  citaTipo:       { fontSize:12, color:'#888' },
  citaMedico:     { fontSize:12, color:'#1a3a5c', fontWeight:500 },
  citaRight:      { display:'flex', flexDirection:'column', alignItems:'flex-end', gap:8 },
  estadoBadge:    { fontSize:12, padding:'4px 12px', borderRadius:20, fontWeight:500, textTransform:'capitalize' },
};