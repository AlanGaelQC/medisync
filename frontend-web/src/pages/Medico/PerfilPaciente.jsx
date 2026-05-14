import { useEffect, useState } from "react";
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import api from "../../api/axios";

export default function PerfilPaciente() {
    const { id } = useParams();
    const navigate = useNavigate();
    const { usuario } = useAuth();
    const [entradas, setEntradas] = useState([]);
    const [loading, setLoading]   = useState(true);
    const [tab, setTab]           = useState('historial');
    const [showNota, setShowNota] = useState(false);
    const [notaForm, setNotaForm] = useState({ diagnostico: '', tratamiento: '', notas: '' });
    const [guardando, setGuardando] = useState(false);

    const fetchExpediente = () => {
        setLoading(true);
        return api.get(`/expediente/${id}`)
            .then(({ data }) => setEntradas(Array.isArray(data) ? data : []))
            .catch(console.error)
            .finally(() => setLoading(false));
    };

    useEffect(() => { fetchExpediente(); }, [id]);

    async function handleGuardarNota(e) {
        e.preventDefault();
        setGuardando(true);
        try {
            await api.post(`/expediente/${id}`, {
                medico_id:   usuario?.id,
                diagnostico: notaForm.diagnostico,
                tratamiento: notaForm.tratamiento,
                notas:       notaForm.notas,
            });
            setNotaForm({ diagnostico: '', tratamiento: '', notas: '' });
            setShowNota(false);
            await fetchExpediente();
        } catch (err) {
            alert(err.response?.data?.error || 'Error al guardar la nota.');
        } finally {
            setGuardando(false);
        }
    }

    if (loading) return <p style={{ padding: 20, fontFamily: 'Inter,sans-serif' }}>Cargando expediente...</p>;

    return (
        <div style={s.page}>
            {/* Header */}
            <div style={s.header}>
                <button onClick={() => navigate(-1)} style={s.back}>← Volver</button>
                <div style={s.avatar}>#{id}</div>
                <div style={{ flex: 1 }}>
                    <div style={s.nombre}>Expediente del paciente #{id}</div>
                    <div style={s.meta}>{entradas.length} entrada{entradas.length !== 1 ? 's' : ''} en el historial</div>
                </div>
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

            <div style={s.content}>

                {/* HISTORIAL */}
                {tab === 'historial' && (
                    <div>
                        <div style={s.historialHeader}>
                            <h4 style={s.sectionTitle}>Historial de consultas</h4>
                            <button onClick={() => setShowNota(v => !v)} style={s.btnBlue}>
                                {showNota ? 'Cancelar' : '+ Agregar nota'}
                            </button>
                        </div>

                        {/* Formulario nueva nota */}
                        {showNota && (
                            <form onSubmit={handleGuardarNota} style={s.notaForm}>
                                <div style={s.group}>
                                    <label style={s.label}>Diagnóstico *</label>
                                    <input
                                        style={s.inputField}
                                        required
                                        placeholder="Diagnóstico"
                                        value={notaForm.diagnostico}
                                        onChange={e => setNotaForm(f => ({ ...f, diagnostico: e.target.value }))}
                                    />
                                </div>
                                <div style={s.group}>
                                    <label style={s.label}>Tratamiento</label>
                                    <input
                                        style={s.inputField}
                                        placeholder="Tratamiento indicado"
                                        value={notaForm.tratamiento}
                                        onChange={e => setNotaForm(f => ({ ...f, tratamiento: e.target.value }))}
                                    />
                                </div>
                                <div style={s.group}>
                                    <label style={s.label}>Notas</label>
                                    <textarea
                                        style={s.notaTextarea}
                                        rows={3}
                                        placeholder="Observaciones adicionales..."
                                        value={notaForm.notas}
                                        onChange={e => setNotaForm(f => ({ ...f, notas: e.target.value }))}
                                    />
                                </div>
                                <button type="submit" style={s.btnBlue} disabled={guardando}>
                                    {guardando ? 'Guardando...' : 'Guardar nota'}
                                </button>
                            </form>
                        )}

                        {entradas.length === 0 && (
                            <p style={{ color: '#999', fontSize: 13 }}>Sin consultas registradas.</p>
                        )}
                        {entradas.map((c, i) => (
                            <div key={i} style={s.histCard}>
                                <div style={s.histTop}>
                                    <span style={s.histFecha}>
                                        {new Date(c.fecha).toLocaleDateString('es-MX')}
                                    </span>
                                    <span style={s.histMedico}>
                                        Médico #{c.medico_id}
                                    </span>
                                </div>
                                <div style={s.histDiag}>{c.diagnostico ?? '—'}</div>
                                {c.tratamiento && <div style={s.histMotivo}>Tratamiento: {c.tratamiento}</div>}
                                {c.notas      && <div style={s.histMotivo}>Notas: {c.notas}</div>}
                            </div>
                        ))}
                    </div>
                )}

                {/* DATOS PERSONALES — info no disponible desde endpoint /expediente */}
                {tab === 'datos' && (
                    <div style={s.datosGrid}>
                        <p style={{ color: '#999', fontSize: 13 }}>
                            Los datos personales del paciente no están disponibles desde esta vista.
                            Consulta el módulo de pacientes para ver su perfil completo.
                        </p>
                    </div>
                )}

                {/* MEDICAMENTOS — info no disponible desde endpoint /expediente */}
                {tab === 'medicamentos' && (
                    <div>
                        <p style={{ color: '#999', fontSize: 13 }}>
                            Los medicamentos no están disponibles desde esta vista.
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
}

const s = {
    page:          { fontFamily: 'Inter,sans-serif', background: '#f4f6f9', minHeight: '100vh' },
    header:        { background: '#fff', padding: '16px 20px', display: 'flex', alignItems: 'center', gap: 14, borderBottom: '1px solid #e0e4ea' },
    back:          { background: 'none', border: 'none', color: '#1a3a5c', cursor: 'pointer', fontSize: 13, fontWeight: 600 },
    avatar:        { width: 54, height: 54, borderRadius: '50%', background: '#c8daf0', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 14, fontWeight: 700, color: '#1a3a5c', flexShrink: 0 },
    nombre:        { fontSize: 17, fontWeight: 600, color: '#1a1a2e' },
    meta:          { fontSize: 12, color: '#777', marginTop: 2 },
    tabs:          { display: 'flex', background: '#fff', borderBottom: '1px solid #e0e4ea', padding: '0 20px' },
    tabBtn:        { padding: '10px 20px', border: 'none', background: 'none', cursor: 'pointer', fontSize: 13, color: '#666', borderBottom: '2px solid transparent' },
    tabActive:     { color: '#1a3a5c', fontWeight: 600, borderBottom: '2px solid #1a3a5c' },
    content:       { padding: 20 },
    sectionTitle:  { fontSize: 13, fontWeight: 600, color: '#1a1a2e', margin: 0 },
    historialHeader:{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 },
    btnBlue:       { background: '#1a3a5c', color: '#fff', border: 'none', borderRadius: 6, padding: '7px 14px', fontSize: 13, cursor: 'pointer' },
    notaForm:      { background: '#f9fbff', border: '1px solid #e0e4ea', borderRadius: 8, padding: 16, marginBottom: 16, display: 'flex', flexDirection: 'column', gap: 12 },
    group:         { display: 'flex', flexDirection: 'column', gap: 5 },
    label:         { fontSize: 11, fontWeight: 600, color: '#666', textTransform: 'uppercase', letterSpacing: '.05em' },
    inputField:    { height: 38, border: '1px solid #ddd', borderRadius: 6, padding: '0 12px', fontSize: 14, outline: 'none' },
    notaTextarea:  { border: '1px solid #ddd', borderRadius: 6, padding: '8px 12px', fontSize: 14, outline: 'none', resize: 'vertical', fontFamily: 'Inter,sans-serif' },
    histCard:      { background: '#fff', borderRadius: 8, padding: 14, marginBottom: 10, boxShadow: '0 1px 3px rgba(0,0,0,.05)' },
    histTop:       { display: 'flex', justifyContent: 'space-between', marginBottom: 6 },
    histFecha:     { fontSize: 12, color: '#999' },
    histMedico:    { fontSize: 12, color: '#1a3a5c', fontWeight: 500 },
    histDiag:      { fontSize: 13, fontWeight: 600, color: '#1a1a2e', marginBottom: 4 },
    histMotivo:    { fontSize: 12, color: '#666' },
    datosGrid:     { background: '#fff', borderRadius: 8, padding: 16 },
};
