import { useEffect, useState } from "react";
import { useParams, useNavigate } from 'react-router-dom';
import api from "../../api/axios";

export default function PerfilPaciente() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [paciente, setPaciente] = useState(null);
    const [loading, setLoading] =useState(true);
    const [tab, setTab] = useState('historial');

    useEffect(() => {
        // GET /expedientes/:paciente_id
        api.get(`/expediente/${id}`)
            .then(({ data }) => setPaciente(data))
            .catch(console.error)
            .finally(() => setLoading(false));
    }, [id]);

    if (loading) return <p style={{ padding:20, fontFamily: 'Inter,sans-serif' }}>Cargando expediente...</p>;
    if (!paciente) return <p style={{ padding:20, fontFamily: 'Inter,sans-serif' }}>Paciente no encontrado.</p>;

    const nombre = paciente.nombre ?? paciente.name ?? '';
    const apellido = paciente.apellido ?? paciente.apellido_paterno ?? '';
    const edad = paciente.fecha_nacimiento
        ? new Date().getFullYear() - new Date(paciente.fecha_nacimiento).getFullYear()
        : paciente.edad ?? '-';

    return (
        <div style={setLoading.page}>
            {/* Header */}
            <div style={setLoading.header}>
                <button onClick={() => navigate(-1)} style={setLoading.back}>← Volver</button>
                <div style={s.avatar}>{nombre[0]}{apellido[0]}</div>
                <div style={{ flex: 1 }}>
                    <div style={s.nombre}>{nombre}{apellido}</div>
                    <div style={s.meta}>
                        Exp. #{paciente.numero_expediente ?? paciente.id} · {edad} años · {paciente.sexo ?? '—'} · {paciente.tipo_sangre ?? '—'}
                    </div>
                    {paciente.alergias && (
                        <span style={s.tagOrange}>⚠ Alergia: {paciente.alergias}</span>
                    )}
                </div>
                <button style={s.btnBlue}
                onClick={() => alert('Abrirás una nueva cita')}>
                    + Nueva cita
                </button>
            </div>

            {/* Tabs */}
            <div style={s.tabs}>
                {['historial', 'datos', 'medicamentos'].map(t => (
                    <button key={t} onClick={() => setTab(t)}
                        style={{ ...s.tabBtn, ...(tab === t ? s.tabActive : {}) }}>
                        {t.charAt(0).toUpperCase() + t.slice(1)}
                    </button>
                ))}
            </div>

            {/* Contenido por tab */}
            <div style={s.content}>

                {/* HISTORIAL */}
                {tab === 'historial' && (
                    <div>
                        <h4 style={s.sectionTitle}>Historial de consultas</h4>
                        {!(paciente.consultas ?? paciente.historial)?.length && (
                            <p style={{ color:'#999', fontSize:13 }}>Sin consultas registradas.</p>
                        )}
                        {(paciente.consulta ?? paciente.historial ?? []).map((c, i) => (
                            <div key={i} style={s.histCard}>
                                <div style={s.histTop}>
                                    <span style={s.histFecha}>
                                        {new Date(c.fecha).toLocaleDateString('es-MX')}
                                    </span>
                                    <span style={s.histMedico}>
                                        Dr. {c.medico_nombre ?? c.medico ?? '-'}
                                    </span>
                                </div>
                                <div style={s.histDiag}>{c.diagnostico ?? c.diagnosis ?? '-'}</div>
                                <div style={s.histMotivo}>{c.motivo_consulta ?? c.motivo ?? ''}</div>
                                {c.presion_arterial && (
                                    <div style={s.vitales}>
                                        PA: {c.presion_arterial} - FC: {c.frecuencia_cardiaca} bpm - T°: {c.temperatura}°C - Peso: {c.peso} kg
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                )}

                {/* DATOS PERSONALES */}
                {tab === 'datos' && (
                    <div style={s.datosGrid}>
                        {[
                            ['Fecha de nacimiento', paciente.fecha_nacimiento ? new Date(paciente.fecha_nacimiento).toLocaleDateString('es-MX') : '-'],
                            ['CURP', paciente.curp ?? '-'],
                            ['Telefono', paciente.telefono ?? '-'],
                            ['Correo', paciente.email ?? '-'],
                            ['Seguro médico', paciente.seguro_medico ?? '-'],
                            ['N° seguro', paciente.numero_seguro ?? '-'],
                            ['Dirección', paciente.direccion ?? '-'],
                        ].map(([lbl, val]) => (
                            <div key={lbl} style={s.datoRow}>
                                <span style={s.datoLbl}>{lbl}</span>
                                <span style={s.datoVal}>{val}</span>
                            </div>
                        ))}
                    </div>
                )}

                {/* MEDICAMENTOS */}
                {tab === 'medicamentos' && (
                    <div>
                        <h4 style={s.sectionTitle}>Medicamentos</h4>
                        {!(paciente.medicamentos)?.length && (
                            <p style={{ color:'#999', fontSize:13 }}>Sin medicamentos registrados.</p>
                        )}
                        {(paciente.medicamentos ?? []).map((m,i) => (
                            <div key={i} style={s.medCarp}>
                                <div style={{ flex:1 }}>
                                    <div style={s.medNombre}>{m.nombre ?? m.name}</div>
                                    <div style={s.medDosis}>{m.dosis} - {m.frecuencia}</div>
                                </div>
                                <span style={{
                                    ...s.tag,
                                    background: m.activo ? '#e0f5ec' : '#f5f5f5',
                                    color: m.activo ? '#2a7a4b' : '#999',
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
  page:         { fontFamily:'Inter,sans-serif', background:'#f4f6f9', minHeight:'100vh' },
  header:       { background:'#fff', padding:'16px 20px', display:'flex', alignItems:'center', gap:14, borderBottom:'1px solid #e0e4ea' },
  back:         { background:'none', border:'none', color:'#1a3a5c', cursor:'pointer', fontSize:13, fontWeight:600 },
  avatar:       { width:54, height:54, borderRadius:'50%', background:'#c8daf0', display:'flex', alignItems:'center', justifyContent:'center', fontSize:20, fontWeight:700, color:'#1a3a5c', flexShrink:0 },
  nombre:       { fontSize:17, fontWeight:600, color:'#1a1a2e' },
  meta:         { fontSize:12, color:'#777', marginTop:2 },
  tagOrange:    { fontSize:11, padding:'2px 8px', borderRadius:10, background:'#fef3e8', color:'#c0632b', marginTop:5, display:'inline-block' },
  btnBlue:      { background:'#1a3a5c', color:'#fff', border:'none', borderRadius:6, padding:'7px 16px', fontSize:13, cursor:'pointer', flexShrink:0 },
  tabs:         { display:'flex', background:'#fff', borderBottom:'1px solid #e0e4ea', padding:'0 20px' },
  tabBtn:       { padding:'10px 20px', border:'none', background:'none', cursor:'pointer', fontSize:13, color:'#666', borderBottom:'2px solid transparent' },
  tabActive:    { color:'#1a3a5c', fontWeight:600, borderBottom:'2px solid #1a3a5c' },
  content:      { padding:20 },
  sectionTitle: { fontSize:13, fontWeight:600, color:'#1a1a2e', marginBottom:12 },
  histCard:     { background:'#fff', borderRadius:8, padding:14, marginBottom:10, boxShadow:'0 1px 3px rgba(0,0,0,.05)' },
  histTop:      { display:'flex', justifyContent:'space-between', marginBottom:6 },
  histFecha:    { fontSize:12, color:'#999' },
  histMedico:   { fontSize:12, color:'#1a3a5c', fontWeight:500 },
  histDiag:     { fontSize:13, fontWeight:600, color:'#1a1a2e', marginBottom:2 },
  histMotivo:   { fontSize:12, color:'#666' },
  vitales:      { fontSize:11, color:'#888', marginTop:8, background:'#f9f9f9', padding:'5px 8px', borderRadius:4 },
  datosGrid:    { background:'#fff', borderRadius:8, padding:16, display:'flex', flexDirection:'column', gap:4 },
  datoRow:      { display:'flex', justifyContent:'space-between', fontSize:13, padding:'8px 0', borderBottom:'1px solid #f5f5f5' },
  datoLbl:      { color:'#888' },
  datoVal:      { color:'#1a1a2e', fontWeight:500, textAlign:'right' },
  medCard:      { background:'#fff', borderRadius:8, padding:12, marginBottom:8, display:'flex', alignItems:'center', gap:10, boxShadow:'0 1px 3px rgba(0,0,0,.05)' },
  medNombre:    { fontSize:13, fontWeight:600, color:'#1a1a2e' },
  medDosis:     { fontSize:12, color:'#666', marginTop:2 },
  tag:          { fontSize:11, padding:'3px 10px', borderRadius:10, flexShrink:0 },
};