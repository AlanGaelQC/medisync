import { useEffect, useState } from "react";
import { useNavigate } from 'react-router-dom';
import api from "../../api/axios";

const TIPO_BG     = { consulta: '#abd7fc', seguimiento: '#bffdda', urgencia: '#fdd4d4', primera_vez: '#efd6ff' };
const TIPO_BORDER = { consulta: '#1a3a5c', seguimiento: '#2a7a4b', urgencia: '#c02b2b', primera_vez: '#7a2a7a' };
const HORAS = ['08:00','09:00','10:00','11:00','12:00','13:00','14:00','15:00','16:00'];
const FORM_VACIO = { paciente_id: '', medico_id: '', fecha: '', hora: '' };

export default function Agenda() {
    const navigate = useNavigate();
    const hoy = new Date().toISOString().split('T')[0];
    const [fecha, setFecha]       = useState(hoy);
    const [citas, setCitas]       = useState([]);
    const [medicos, setMedicos]   = useState([]);
    const [pacientes, setPacientes] = useState([]);
    const [loading, setLoading]   = useState(true);
    const [showModal, setShowModal]   = useState(false);
    const [modalForm, setModalForm]   = useState(FORM_VACIO);
    const [submitting, setSubmitting] = useState(false);

    const fetchCitas = () =>
        api.get('/citas').then(({ data }) => setCitas(Array.isArray(data) ? data : []));

    useEffect(() => {
        setLoading(true);
        Promise.all([
            api.get('/citas'),
            api.get('/medicos'),
            api.get('/pacientes'),
        ])
            .then(([citasRes, medicosRes, pacientesRes]) => {
                setCitas(Array.isArray(citasRes.data) ? citasRes.data : []);
                setMedicos(Array.isArray(medicosRes.data) ? medicosRes.data : []);
                setPacientes(Array.isArray(pacientesRes.data) ? pacientesRes.data : []);
            })
            .catch(console.error)
            .finally(() => setLoading(false));
    }, []); // fetch solo al montar; el filtro por fecha es local

    // Filtra las citas de un médico en una hora y fecha específicas
    function citasEnHora(medicoId, hora) {
        const horaNum = parseInt(hora.split(':')[0]);
        return citas.filter(c => {
            const citaHora = parseInt((c.hora_inicio ?? c.hora ?? '00:00').split(':')[0]);
            const idMedico = c.medico_id ?? c.medicoId;
            return idMedico === medicoId && citaHora === horaNum && (c.fecha?.slice(0, 10) === fecha);
        });
    }

    async function handleCrearCita(e) {
        e.preventDefault();
        setSubmitting(true);
        try {
            await api.post('/citas', {
                paciente_id: parseInt(modalForm.paciente_id),
                medico_id:   parseInt(modalForm.medico_id),
                fecha:       modalForm.fecha,
                hora:        modalForm.hora,
            });
            await fetchCitas();
            setShowModal(false);
            setModalForm(FORM_VACIO);
        } catch (err) {
            alert(err.response?.data?.error || 'Error al crear la cita.');
        } finally {
            setSubmitting(false);
        }
    }

    async function handleCancelarCita(cita) {
        const hora = (cita.hora ?? cita.hora_inicio ?? '').slice(0, 5);
        if (!window.confirm(`¿Cancelar la cita del ${cita.fecha?.slice(0, 10)} a las ${hora}?`)) return;
        try {
            await api.delete(`/citas/${cita.id}`);
            setCitas(prev => prev.filter(c => c.id !== cita.id));
        } catch (err) {
            alert(err.response?.data?.error || 'Error al cancelar la cita.');
        }
    }

    return (
        <div style={s.page}>
            {/* Toolbar */}
            <div style={s.toolbar}>
                <button onClick={() => navigate('/')} style={s.back}>← Dashboard</button>
                <h2 style={s.title}>📅 Agenda</h2>
                <input
                    type="date"
                    value={fecha}
                    onChange={e => setFecha(e.target.value)}
                    style={s.dateInput}
                />
                <button style={s.btnBlue} onClick={() => { setModalForm({ ...FORM_VACIO, fecha }); setShowModal(true); }}>
                    + Nueva Cita
                </button>
            </div>

            {loading ? <p style={{ padding: 20 }}>Cargando agenda...</p> : (
                <div style={s.tableWrap}>
                    <table style={s.table}>
                        <thead>
                            <tr>
                                <th style={s.thHora}>Hora</th>
                                {medicos.length === 0
                                    ? <th style={s.th}>Sin médicos registrados</th>
                                    : medicos.map(m => (
                                        <th key={m.id} style={s.th}>
                                            Dr. {m.nombre ?? m.name} {m.apellido ?? ''}
                                        </th>
                                    ))
                                }
                            </tr>
                        </thead>
                        <tbody>
                            {HORAS.map(hora => (
                                <tr key={hora}>
                                    <td style={s.tdHora}>{hora}</td>
                                    {medicos.map(m => (
                                        <td key={m.id} style={s.td}>
                                            {citasEnHora(m.id, hora).map(c => (
                                                <div key={c.id} style={{
                                                    ...s.apptBlock,
                                                    background:  TIPO_BG[c.tipo]     ?? '#e8f0f8',
                                                    borderLeft: `3px solid ${TIPO_BORDER[c.tipo] ?? '#1a3a5c'}`,
                                                }}>
                                                    <div style={s.apptTop}>
                                                        <div
                                                            style={s.apptNombre}
                                                            onClick={() => navigate(`/medico/pacientes/${c.paciente_id ?? c.pacienteId}`)}
                                                        >
                                                            {c.paciente_nombre ?? c.paciente ?? 'Paciente'}
                                                        </div>
                                                        <button
                                                            onClick={() => handleCancelarCita(c)}
                                                            style={s.cancelBtn}
                                                            title="Cancelar cita"
                                                        >×</button>
                                                    </div>
                                                    <div style={s.apptTipo}>
                                                        {c.tipo ?? 'consulta'} · {(c.hora_inicio ?? c.hora ?? '').slice(0, 5)}
                                                    </div>
                                                </div>
                                            ))}
                                        </td>
                                    ))}
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}

            {/* Modal nueva cita */}
            {showModal && (
                <div style={s.overlay} onClick={() => setShowModal(false)}>
                    <div style={s.modal} onClick={e => e.stopPropagation()}>
                        <div style={s.modalHeader}>
                            <span style={s.modalTitle}>Nueva cita</span>
                            <button onClick={() => setShowModal(false)} style={s.modalClose}>×</button>
                        </div>
                        <form onSubmit={handleCrearCita} style={s.modalForm}>
                            <div style={s.group}>
                                <label style={s.label}>Paciente</label>
                                <select required style={s.input}
                                    value={modalForm.paciente_id}
                                    onChange={e => setModalForm(f => ({ ...f, paciente_id: e.target.value }))}>
                                    <option value="">Selecciona un paciente</option>
                                    {pacientes.map(p => (
                                        <option key={p.id} value={p.id}>{p.nombre}</option>
                                    ))}
                                </select>
                            </div>
                            <div style={s.group}>
                                <label style={s.label}>Médico</label>
                                <select required style={s.input}
                                    value={modalForm.medico_id}
                                    onChange={e => setModalForm(f => ({ ...f, medico_id: e.target.value }))}>
                                    <option value="">Selecciona un médico</option>
                                    {medicos.map(m => (
                                        <option key={m.id} value={m.id}>
                                            Dr. {m.nombre} {m.apellido ?? ''}{m.especialidad ? ` — ${m.especialidad}` : ''}
                                        </option>
                                    ))}
                                </select>
                            </div>
                            <div style={s.row2}>
                                <div style={s.group}>
                                    <label style={s.label}>Fecha</label>
                                    <input required type="date" style={s.input}
                                        value={modalForm.fecha}
                                        onChange={e => setModalForm(f => ({ ...f, fecha: e.target.value }))} />
                                </div>
                                <div style={s.group}>
                                    <label style={s.label}>Hora</label>
                                    <input required type="time" style={s.input} min="08:00" max="17:00"
                                        value={modalForm.hora}
                                        onChange={e => setModalForm(f => ({ ...f, hora: e.target.value }))} />
                                </div>
                            </div>
                            <div style={s.modalActions}>
                                <button type="button" onClick={() => setShowModal(false)} style={s.btnOutline}>
                                    Cancelar
                                </button>
                                <button type="submit" style={s.btnBlue} disabled={submitting}>
                                    {submitting ? 'Guardando...' : 'Confirmar cita'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}

const s = {
    page:        { fontFamily: 'Inter,sans-serif', background: '#f4f6f9', minHeight: '100vh' },
    toolbar:     { display: 'flex', alignItems: 'center', gap: 12, padding: '14px 20px', background: '#fff', borderBottom: '1px solid #e0e4ea' },
    back:        { background: 'none', border: 'none', color: '#1a3a5c', cursor: 'pointer', fontSize: 13, fontWeight: 600 },
    title:       { fontSize: 16, fontWeight: 600, color: '#1a1a2e', flex: 1, margin: 0 },
    dateInput:   { border: '1px solid #ddd', borderRadius: 6, padding: '5px 10px', fontSize: 13 },
    btnBlue:     { background: '#1a3a5c', color: '#fff', border: 'none', borderRadius: 6, padding: '7px 16px', fontSize: 13, cursor: 'pointer' },
    btnOutline:  { background: '#fff', color: '#555', border: '1px solid #ddd', borderRadius: 6, padding: '7px 16px', fontSize: 13, cursor: 'pointer' },
    tableWrap:   { overflowX: 'auto', padding: 20 },
    table:       { width: '100%', borderCollapse: 'collapse', background: '#fff', borderRadius: 8, overflow: 'hidden', boxShadow: '0 1px 3px rgba(0,0,0,.06)' },
    th:          { padding: '10px 12px', fontSize: 12, fontWeight: 600, color: '#1a3a5c', background: '#f4f6f9', borderBottom: '1px solid #e0e4ea', textAlign: 'left', minWidth: 170 },
    thHora:      { padding: '10px 8px', fontSize: 11, color: '#999', background: '#f4f6f9', borderBottom: '1px solid #e0e4ea', width: 60, textAlign: 'right' },
    td:          { padding: '4px 6px', borderBottom: '1px solid #f0f0f0', verticalAlign: 'top', minHeight: 36 },
    tdHora:      { padding: '8px 8px', fontSize: 11, color: '#bbb', borderBottom: '1px solid #f0f0f0', textAlign: 'right', verticalAlign: 'top' },
    apptBlock:   { borderRadius: 4, padding: '5px 8px', marginBottom: 3 },
    apptTop:     { display: 'flex', justifyContent: 'space-between', alignItems: 'center' },
    apptNombre:  { fontSize: 12, fontWeight: 600, color: '#1a1a2e', cursor: 'pointer', flex: 1 },
    apptTipo:    { fontSize: 10, color: '#666', marginTop: 1 },
    cancelBtn:   { background: 'none', border: 'none', color: '#c02b2b', cursor: 'pointer', fontSize: 15, fontWeight: 700, lineHeight: 1, padding: '0 2px', flexShrink: 0 },
    overlay:     { position: 'fixed', inset: 0, background: 'rgba(0,0,0,.45)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 },
    modal:       { background: '#fff', borderRadius: 10, padding: 24, width: 440, maxWidth: '92vw', boxShadow: '0 4px 24px rgba(0,0,0,.18)' },
    modalHeader: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 },
    modalTitle:  { fontSize: 16, fontWeight: 600, color: '#1a1a2e' },
    modalClose:  { background: 'none', border: 'none', fontSize: 22, color: '#999', cursor: 'pointer', lineHeight: 1 },
    modalForm:   { display: 'flex', flexDirection: 'column', gap: 16 },
    modalActions:{ display: 'flex', gap: 10, justifyContent: 'flex-end' },
    group:       { display: 'flex', flexDirection: 'column', gap: 6 },
    label:       { fontSize: 11, fontWeight: 600, color: '#666', textTransform: 'uppercase', letterSpacing: '.05em' },
    input:       { height: 40, border: '1px solid #ddd', borderRadius: 6, padding: '0 12px', fontSize: 14, outline: 'none', background: '#fff' },
    row2:        { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 },
};
