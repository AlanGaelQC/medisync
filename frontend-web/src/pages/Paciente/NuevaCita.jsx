import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import api from '../../api/axios';

const TIPOS = [
  { value:'consulta',    label:'Consulta general' },
  { value:'seguimiento', label:'Seguimiento' },
  { value:'primera_vez', label:'Primera vez' },
  { value:'urgencia',    label:'Urgencia' },
];

export default function NuevaCita() {
  const { usuario, logout } = useAuth();
  const navigate = useNavigate();
  const [medicos, setMedicos]   = useState([]);
  const [form, setForm]         = useState({ medico_id:'', fecha:'', hora_inicio:'', tipo:'consulta', motivo:'' });
  const [loading, setLoading]   = useState(false);
  const [loadingMed, setLoadingMed] = useState(true);
  const [exito, setExito]       = useState(false);
  const [error, setError]       = useState('');

  // Fecha mínima: mañana
  const manana = new Date();
  manana.setDate(manana.getDate() + 1);
  const fechaMin = manana.toISOString().split('T')[0];

  useEffect(() => {
    // GET /medicos — API de Alan
    api.get('/medicos')
      .then(({ data }) => setMedicos(data))
      .catch(console.error)
      .finally(() => setLoadingMed(false));
  }, []);

  async function handleSubmit(e) {
    e.preventDefault();
    setError(''); setLoading(true);

    // Calcular hora_fin sumando 30 minutos
    const [h, m]   = form.hora_inicio.split(':').map(Number);
    const fin      = new Date(0, 0, 0, h, m + 30);
    const hora_fin = `${String(fin.getHours()).padStart(2,'0')}:${String(fin.getMinutes()).padStart(2,'0')}`;

    try {
      // POST /citas — API de Alan
      await api.post('/citas', {
        paciente_id: usuario?.paciente_id ?? usuario?.id,
        medico_id:   parseInt(form.medico_id),
        fecha:       form.fecha,
        hora_inicio: form.hora_inicio,
        hora_fin,
        tipo:        form.tipo,
        motivo:      form.motivo,
      });
      setExito(true);
    } catch (err) {
      setError(err.response?.data?.error || 'Error al agendar la cita. Intenta de nuevo.');
    } finally {
      setLoading(false);
    }
  }

  // Pantalla de éxito
  if (exito) return (
    <div style={s.page}>
      <div style={s.header}>
        <span style={s.headerTitle}>🏥 MediSync</span>
        <button onClick={() => { logout(); navigate('/login'); }} style={s.logoutBtn}>Cerrar sesión</button>
      </div>
      <div style={s.exitoWrap}>
        <div style={{ fontSize:60 }}>✅</div>
        <h2 style={s.exitoTitle}>¡Cita agendada!</h2>
        <p style={s.exitoSub}>Tu cita fue registrada correctamente. Puedes verla en "Mis Citas".</p>
        <div style={{ display:'flex', gap:10, marginTop:10 }}>
          <button onClick={() => navigate('/paciente/citas')}      style={s.btnBlue}>Ver mis citas</button>
          <button onClick={() => { setExito(false); setForm({ medico_id:'', fecha:'', hora_inicio:'', tipo:'consulta', motivo:'' }); }} style={s.btnOutline}>
            Agendar otra
          </button>
        </div>
      </div>
    </div>
  );

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
        <div onClick={() => navigate('/paciente/citas')}      style={s.navItem}>Mis Citas</div>
        <div onClick={() => navigate('/paciente/nueva-cita')} style={{ ...s.navItem, ...s.navActive }}>Agendar Cita</div>
      </div>

      <div style={s.content}>
        <h2 style={s.title}>Agendar nueva cita</h2>

        <div style={s.formCard}>
          <form onSubmit={handleSubmit} style={s.form}>

            {/* Médico */}
            <div style={s.group}>
              <label style={s.label}>Médico</label>
              {loadingMed ? <p style={{ fontSize:13, color:'#999' }}>Cargando médicos...</p> : (
                <select style={s.input} required
                  value={form.medico_id}
                  onChange={e => setForm(f => ({ ...f, medico_id: e.target.value }))}>
                  <option value="">Selecciona un médico</option>
                  {medicos.map(m => (
                    <option key={m.id} value={m.id}>
                      Dr. {m.nombre ?? m.name} {m.apellido ?? ''} {m.especialidad ? `— ${m.especialidad}` : ''}
                    </option>
                  ))}
                </select>
              )}
            </div>

            {/* Tipo de consulta */}
            <div style={s.group}>
              <label style={s.label}>Tipo de consulta</label>
              <div style={s.tipoGrid}>
                {TIPOS.map(t => (
                  <div key={t.value} onClick={() => setForm(f => ({ ...f, tipo: t.value }))}
                    style={{ ...s.tipoCard, ...(form.tipo === t.value ? s.tipoActive : {}) }}>
                    {t.label}
                  </div>
                ))}
              </div>
            </div>

            {/* Fecha y hora en fila */}
            <div style={s.row2}>
              <div style={s.group}>
                <label style={s.label}>Fecha</label>
                <input style={s.input} type="date" required min={fechaMin}
                  value={form.fecha}
                  onChange={e => setForm(f => ({ ...f, fecha: e.target.value }))} />
              </div>
              <div style={s.group}>
                <label style={s.label}>Hora</label>
                <input style={s.input} type="time" required min="08:00" max="17:00"
                  value={form.hora_inicio}
                  onChange={e => setForm(f => ({ ...f, hora_inicio: e.target.value }))} />
              </div>
            </div>

            {/* Motivo */}
            <div style={s.group}>
              <label style={s.label}>Motivo de la consulta</label>
              <textarea style={s.textarea} rows={3}
                placeholder="Describe brevemente el motivo de tu consulta..."
                value={form.motivo}
                onChange={e => setForm(f => ({ ...f, motivo: e.target.value }))} />
            </div>

            {error && <p style={s.error}>{error}</p>}

            <div style={{ display:'flex', gap:10 }}>
              <button type="submit" style={s.btnBlue} disabled={loading}>
                {loading ? 'Agendando...' : 'Confirmar cita'}
              </button>
              <button type="button" onClick={() => navigate('/paciente/citas')} style={s.btnOutline}>
                Cancelar
              </button>
            </div>
          </form>
        </div>
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
  content:     { padding:20, maxWidth:640, margin:'0 auto' },
  title:       { fontSize:18, fontWeight:600, color:'#1a1a2e', marginBottom:16 },
  formCard:    { background:'#fff', borderRadius:10, padding:24, boxShadow:'0 1px 3px rgba(0,0,0,.06)' },
  form:        { display:'flex', flexDirection:'column', gap:18 },
  group:       { display:'flex', flexDirection:'column', gap:6 },
  label:       { fontSize:11, fontWeight:600, color:'#666', textTransform:'uppercase', letterSpacing:'.05em' },
  input:       { height:40, border:'1px solid #ddd', borderRadius:6, padding:'0 12px', fontSize:14, outline:'none', background:'#fff' },
  textarea:    { border:'1px solid #ddd', borderRadius:6, padding:'10px 12px', fontSize:14, outline:'none', resize:'vertical', fontFamily:'Inter,sans-serif' },
  row2:        { display:'grid', gridTemplateColumns:'1fr 1fr', gap:12 },
  tipoGrid:    { display:'grid', gridTemplateColumns:'1fr 1fr', gap:8 },
  tipoCard:    { padding:'10px 14px', border:'1px solid #ddd', borderRadius:8, fontSize:13, color:'#555', cursor:'pointer', textAlign:'center' },
  tipoActive:  { background:'#e8f0f8', color:'#1a3a5c', borderColor:'#1a3a5c', fontWeight:600 },
  error:       { color:'#c0392b', fontSize:13, margin:0 },
  btnBlue:     { background:'#1a3a5c', color:'#fff', border:'none', borderRadius:6, padding:'10px 22px', fontSize:14, fontWeight:600, cursor:'pointer' },
  btnOutline:  { background:'#fff', color:'#555', border:'1px solid #ddd', borderRadius:6, padding:'10px 22px', fontSize:14, cursor:'pointer' },
  exitoWrap:   { display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', minHeight:'70vh', gap:8 },
  exitoTitle:  { fontSize:22, fontWeight:700, color:'#1a1a2e', margin:0 },
  exitoSub:    { fontSize:14, color:'#777', textAlign:'center', maxWidth:360 },
};