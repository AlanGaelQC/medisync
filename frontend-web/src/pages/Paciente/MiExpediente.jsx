import { useEffect, useState } from "react";
import { useNavigate } from 'react-router-dom';
import { useAuth } from "../../context/AuthContext";
import api from "../../api/axios";

export default function MiExpediente() {
  const { usuario, logout } = useAuth();
  const navigate = useNavigate();
  const [pacienteDatos, setPacienteDatos] = useState(null);
  const [entradas, setEntradas]           = useState([]);
  const [loading, setLoading]             = useState(true);
  const [tab, setTab]                     = useState('datos');

  useEffect(() => {
    const pid = usuario?.paciente_id ?? usuario?.id;
    Promise.all([
      api.get(`/pacientes/${pid}`),
      api.get(`/expediente/${pid}`),
    ])
      .then(([pacRes, expRes]) => {
        setPacienteDatos(pacRes.data);
        setEntradas(Array.isArray(expRes.data) ? expRes.data : []);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [usuario]);

  if (loading) return <p style={{ padding: 20, fontFamily: 'Inter,sans-serif' }}>Cargando tu expediente...</p>;

  const nombre  = pacienteDatos?.nombre   ?? usuario?.nombre ?? '';
  const inicial = nombre[0]?.toUpperCase() ?? '?';

  return (
    <div style={s.page}>
      {/* Header */}
      <div style={s.header}>
        <span style={s.headerTitle}>⚕️ MediSync</span>
        <span style={s.headerUser}>{nombre}</span>
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
        <div style={s.avatar}>{inicial}</div>
        <div style={{ flex: 1 }}>
          <div style={s.nombre}>{nombre}</div>
          <div style={s.meta}>
            {pacienteDatos?.email ?? '—'} · {pacienteDatos?.telefono ?? '—'}
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div style={s.tabs}>
        {['datos', 'historial'].map(t => (
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
              ['Nombre',              pacienteDatos?.nombre          ?? '—'],
              ['Correo',              pacienteDatos?.email            ?? '—'],
              ['Teléfono',            pacienteDatos?.telefono         ?? '—'],
              ['Fecha de nacimiento', pacienteDatos?.fecha_nacimiento
                ? new Date(pacienteDatos.fecha_nacimiento).toLocaleDateString('es-MX')
                : '—'],
            ].map(([lbl, val]) => (
              <div key={lbl} style={s.datoRow}>
                <span style={s.datoLbl}>{lbl}</span>
                <span style={s.datoVal}>{val}</span>
              </div>
            ))}
          </div>
        )}

        {/* HISTORIAL DE EXPEDIENTE */}
        {tab === 'historial' && (
          <div>
            {entradas.length === 0 && (
              <p style={{ color: '#999', fontSize: 13 }}>Sin consultas registradas.</p>
            )}
            {entradas.map((c, i) => (
              <div key={i} style={s.histCard}>
                <div style={s.histTop}>
                  <span style={s.histFecha}>
                    {new Date(c.fecha).toLocaleDateString('es-MX')}
                  </span>
                  <span style={s.histMedico}>Médico #{c.medico_id}</span>
                </div>
                <div style={s.histDiag}>{c.diagnostico ?? '—'}</div>
                {c.tratamiento && <div style={s.histMotivo}>Tratamiento: {c.tratamiento}</div>}
                {c.notas       && <div style={s.histMotivo}>Notas: {c.notas}</div>}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

const s = {
  page:        { fontFamily: 'Inter,sans-serif', background: '#f4f6f9', minHeight: '100vh' },
  header:      { height: 52, background: '#1a3a5c', display: 'flex', alignItems: 'center', padding: '0 20px', gap: 12 },
  headerTitle: { color: '#fff', fontWeight: 700, fontSize: 16, flex: 1 },
  headerUser:  { color: 'rgba(255,255,255,.8)', fontSize: 13 },
  logoutBtn:   { background: 'transparent', border: '1px solid rgba(255,255,255,.3)', color: '#fff', borderRadius: 5, padding: '4px 12px', fontSize: 12, cursor: 'pointer' },
  navbar:      { display: 'flex', background: '#fff', borderBottom: '1px solid #e0e4ea', padding: '0 20px' },
  navItem:     { padding: '12px 20px', fontSize: 13, color: '#666', cursor: 'pointer', borderBottom: '2px solid transparent' },
  navActive:   { color: '#1a3a5c', fontWeight: 600, borderBottom: '2px solid #1a3a5c' },
  perfilCard:  { display: 'flex', alignItems: 'center', gap: 16, background: '#fff', padding: '20px 24px', margin: 20, borderRadius: 10, boxShadow: '0 1px 3px rgba(0,0,0,.06)' },
  avatar:      { width: 58, height: 58, borderRadius: '50%', background: '#c8daf0', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 22, fontWeight: 700, color: '#1a3a5c', flexShrink: 0 },
  nombre:      { fontSize: 18, fontWeight: 600, color: '#1a1a2e' },
  meta:        { fontSize: 12, color: '#777', marginTop: 3 },
  tabs:        { display: 'flex', background: '#fff', borderBottom: '1px solid #e0e4ea', padding: '0 20px', marginTop: 4 },
  tabBtn:      { padding: '10px 20px', border: 'none', background: 'none', cursor: 'pointer', fontSize: 13, color: '#666', borderBottom: '2px solid transparent' },
  tabActive:   { color: '#1a3a5c', fontWeight: 600, borderBottom: '2px solid #1a3a5c' },
  content:     { padding: 20 },
  datosGrid:   { background: '#fff', borderRadius: 8, padding: 16, display: 'flex', flexDirection: 'column', gap: 4 },
  datoRow:     { display: 'flex', justifyContent: 'space-between', fontSize: 13, padding: '9px 0', borderBottom: '1px solid #f5f5f5' },
  datoLbl:     { color: '#888' },
  datoVal:     { color: '#1a1a2e', fontWeight: 500, textAlign: 'right' },
  histCard:    { background: '#fff', borderRadius: 8, padding: 14, marginBottom: 10, boxShadow: '0 1px 3px rgba(0,0,0,.05)' },
  histTop:     { display: 'flex', justifyContent: 'space-between', marginBottom: 6 },
  histFecha:   { fontSize: 12, color: '#999' },
  histMedico:  { fontSize: 12, color: '#1a3a5c', fontWeight: 500 },
  histDiag:    { fontSize: 13, fontWeight: 600, color: '#1a1a2e', marginBottom: 4 },
  histMotivo:  { fontSize: 12, color: '#666' },
};
