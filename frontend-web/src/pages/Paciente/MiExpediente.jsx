import { useEffect, useState } from "react";
import { useNavigate} from 'react-router-dom';
import { useAuth } from "../../context/AuthContext";
import api from "../../api/axios";

export default function MiExpediente() {
    const { usuario, logout } = useAuth();
    const navigate = useNavigate();
    const [expediente, setExpediente] = useState(null);
    const [loading, setLoading] = useState(true);
    const [tab, setTab] = useState('datos');

    useEffect(() => {
        // GET /expediente/:paciente_id 
        api.get(`/expediente/${usuario?.paciente_id ?? usuario?.id}`)
            .then(({ data }) => setExpediente(data))
            .catch(console.error)
            .finally(() => setLoading(false));
    }, [usuario]);

    if (loading) return <p style={{ padding:20, fontFamily:'Inter,sans-serif' }}>Cargando tu expediente...</p>;
  if (!expediente) return <p style={{ padding:20 }}>No se encontró tu expediente.</p>;

  const nombre   = expediente.nombre   ?? usuario?.nombre ?? '';
  const apellido = expediente.apellido ?? expediente.apellido_paterno ?? '';
  const edad     = expediente.fecha_nacimiento
    ? new Date().getFullYear() - new Date(expediente.fecha_nacimiento).getFullYear()
    : expediente.edad ?? '—';

  return (
    <div style={s.page}>
      {/* Header */}
      <div style={s.header}>
        <span style={s.headerTitle}>⚕️ MediSync</span>
        <span style={s.headerUser}>{nombre} {apellido}</span>
        <button onClick={() => { logout(); navigate('/login'); }} style={s.logoutBtn}>
          Cerrar sesión
        </button>
      </div>

      {/* Navbar paciente */}
      <div style={s.navbar}>
        <div onClick={() => navigate('/paciente/expediente')} style={{ ...s.navItem, ...s.navActive }}>
          Mi Expediente
        </div>
        <div onClick={() => navigate('/paciente/citas')} style={s.navItem}>
          Mis Citas
        </div>
        <div onClick={() => navigate('/paciente/nueva-cita')} style={s.navItem}>
          Agendar Cita
        </div>
      </div>

      {/* Card perfil */}
      <div style={s.perfilCard}>
        <div style={s.avatar}>{nombre[0]}{apellido[0]}</div>
        <div style={{ flex:1 }}>
          <div style={s.nombre}>{nombre} {apellido}</div>
          <div style={s.meta}>
            Exp. #{expediente.numero_expediente ?? expediente.id} · {edad} años · {expediente.sexo ?? '—'} · Sangre: {expediente.tipo_sangre ?? '—'}
          </div>
          {expediente.alergias && (
            <span style={s.tagOrange}>⚠ Alergia: {expediente.alergias}</span>
          )}
        </div>
      </div>

      {/* Tabs */}
      <div style={s.tabs}>
        {['datos', 'historial', 'medicamentos'].map(t => (
          <button key={t} onClick={() => setTab(t)}
            style={{ ...s.tabBtn, ...(tab === t ? s.tabActive : {}) }}>
            {t.charAt(0).toUpperCase() + t.slice(1)}
          </button>
        ))}
      </div>

      <div style={s.content}>

        {/* DATOS PERSONALES */}
        {tab === 'datos' && (
          <div style={s.datosGrid}>
            {[
              ['Fecha de nacimiento', expediente.fecha_nacimiento ? new Date(expediente.fecha_nacimiento).toLocaleDateString('es-MX') : '—'],
              ['CURP',               expediente.curp          ?? '—'],
              ['Teléfono',           expediente.telefono      ?? '—'],
              ['Correo',             expediente.email         ?? '—'],
              ['Seguro médico',      expediente.seguro_medico ?? '—'],
              ['N° de seguro',       expediente.numero_seguro ?? '—'],
              ['Dirección',          expediente.direccion     ?? '—'],
            ].map(([lbl, val]) => (
              <div key={lbl} style={s.datoRow}>
                <span style={s.datoLbl}>{lbl}</span>
                <span style={s.datoVal}>{val}</span>
              </div>
            ))}
          </div>
        )}

        {/* HISTORIAL */}
        {tab === 'historial' && (
          <div>
            {!(expediente.consultas ?? expediente.historial)?.length && (
              <p style={{ color:'#999', fontSize:13 }}>Sin consultas registradas.</p>
            )}
            {(expediente.consultas ?? expediente.historial ?? []).map((c, i) => (
              <div key={i} style={s.histCard}>
                <div style={s.histTop}>
                  <span style={s.histFecha}>{new Date(c.fecha).toLocaleDateString('es-MX')}</span>
                  <span style={s.histMedico}>Dr. {c.medico_nombre ?? c.medico ?? '—'}</span>
                </div>
                <div style={s.histDiag}>{c.diagnostico ?? '—'}</div>
                <div style={s.histMotivo}>{c.motivo_consulta ?? c.motivo ?? ''}</div>
                {c.presion_arterial && (
                  <div style={s.vitales}>
                    PA: {c.presion_arterial} · FC: {c.frecuencia_cardiaca} bpm · T°: {c.temperatura}°C · Peso: {c.peso} kg
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        {/* MEDICAMENTOS */}
        {tab === 'medicamentos' && (
          <div>
            {!expediente.medicamentos?.length && (
              <p style={{ color:'#999', fontSize:13 }}>Sin medicamentos registrados.</p>
            )}
            {(expediente.medicamentos ?? []).map((m, i) => (
              <div key={i} style={s.medCard}>
                <div style={{ flex:1 }}>
                  <div style={s.medNombre}>{m.nombre ?? m.name}</div>
                  <div style={s.medDosis}>{m.dosis} · {m.frecuencia}</div>
                </div>
                <span style={{
                  ...s.tag,
                  background: m.activo ? '#e0f5ec' : '#f5f5f5',
                  color:      m.activo ? '#2a7a4b' : '#999',
                }}>
                  {m.activo ? 'Activo' : 'Inactivo'}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

const s = {
  page:        { fontFamily:'Inter,sans-serif', background:'#f4f6f9', minHeight:'100vh' },
  header:      { height:52, background:'#1a3a5c', display:'flex', alignItems:'center', padding:'0 20px', gap:12 },
  headerTitle: { color:'#fff', fontWeight:700, fontSize:16, flex:1 },
  headerUser:  { color:'rgba(255,255,255,.8)', fontSize:13 },
  logoutBtn:   { background:'transparent', border:'1px solid rgba(255,255,255,.3)', color:'#fff', borderRadius:5, padding:'4px 12px', fontSize:12, cursor:'pointer' },
  navbar:      { display:'flex', background:'#fff', borderBottom:'1px solid #e0e4ea', padding:'0 20px' },
  navItem:     { padding:'12px 20px', fontSize:13, color:'#666', cursor:'pointer', borderBottom:'2px solid transparent' },
  navActive:   { color:'#1a3a5c', fontWeight:600, borderBottom:'2px solid #1a3a5c' },
  perfilCard:  { display:'flex', alignItems:'center', gap:16, background:'#fff', padding:'20px 24px', margin:20, borderRadius:10, boxShadow:'0 1px 3px rgba(0,0,0,.06)' },
  avatar:      { width:58, height:58, borderRadius:'50%', background:'#c8daf0', display:'flex', alignItems:'center', justifyContent:'center', fontSize:22, fontWeight:700, color:'#1a3a5c', flexShrink:0 },
  nombre:      { fontSize:18, fontWeight:600, color:'#1a1a2e' },
  meta:        { fontSize:12, color:'#777', marginTop:3 },
  tagOrange:   { fontSize:11, padding:'2px 8px', borderRadius:10, background:'#fef3e8', color:'#c0632b', marginTop:6, display:'inline-block' },
  tabs:        { display:'flex', background:'#fff', borderBottom:'1px solid #e0e4ea', padding:'0 20px', marginTop:4 },
  tabBtn:      { padding:'10px 20px', border:'none', background:'none', cursor:'pointer', fontSize:13, color:'#666', borderBottom:'2px solid transparent' },
  tabActive:   { color:'#1a3a5c', fontWeight:600, borderBottom:'2px solid #1a3a5c' },
  content:     { padding:20 },
  datosGrid:   { background:'#fff', borderRadius:8, padding:16, display:'flex', flexDirection:'column', gap:4 },
  datoRow:     { display:'flex', justifyContent:'space-between', fontSize:13, padding:'9px 0', borderBottom:'1px solid #f5f5f5' },
  datoLbl:     { color:'#888' },
  datoVal:     { color:'#1a1a2e', fontWeight:500, textAlign:'right' },
  histCard:    { background:'#fff', borderRadius:8, padding:14, marginBottom:10, boxShadow:'0 1px 3px rgba(0,0,0,.05)' },
  histTop:     { display:'flex', justifyContent:'space-between', marginBottom:6 },
  histFecha:   { fontSize:12, color:'#999' },
  histMedico:  { fontSize:12, color:'#1a3a5c', fontWeight:500 },
  histDiag:    { fontSize:13, fontWeight:600, color:'#1a1a2e', marginBottom:2 },
  histMotivo:  { fontSize:12, color:'#666' },
  vitales:     { fontSize:11, color:'#888', marginTop:8, background:'#f9f9f9', padding:'5px 8px', borderRadius:4 },
  medCard:     { background:'#fff', borderRadius:8, padding:12, marginBottom:8, display:'flex', alignItems:'center', gap:10, boxShadow:'0 1px 3px rgba(0,0,0,.05)' },
  medNombre:   { fontSize:13, fontWeight:600, color:'#1a1a2e' },
  medDosis:    { fontSize:12, color:'#666', marginTop:2 },
  tag:         { fontSize:11, padding:'3px 10px', borderRadius:10, flexShrink:0 },
};