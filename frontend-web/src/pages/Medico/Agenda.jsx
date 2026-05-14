import { useEffect, useState } from "react";
import { useNavigate} from 'react-router-dom';
import api from "../../api/axios";

const TIPO_BG = { consulta: '#abd7fc', seguimiento: '#bffdda', urgencia: '#fdd4d4', primera_vez: '#efd6ff' };
const TIPO_BORDER = { consulta: '#1a3a5c', seguimiento: '#2a7a4b', urgencia: '#c02b2b', primera_vez: '#7a2a7a'};
const HORAS = ['08:00','09:00','10:00','11:00','12:00','13:00','14:00','15:00','16:00'];

export default function Agenda() {
    const navigate = useNavigate();
    const hoy = new Date().toISOString().split('T')[0];
    const [fecha, setFecha] = useState(hoy);
    const [citas, setCitas] = useState([]);
    const [medicos, setMedicos] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        setLoading(true);

        //GET /citas y GET /medicos
        Promise.all([
            api.get('/citas'),
            api.get('medicos'),
        ])
            .then(([citasRes, medicosRes]) => {
                setCitas(citasRes.data);
                setMedicos(medicosRes.data);
            })
            .catch(console.error)
            .finally(() => setLoading(false));
    }, [fecha]);

    //Filtra las citas de un médico en una hora especifica
    function citasEnHora(medicoId, hora) {
        const horaNum = parseInt(hora.split(':')[0]);
        return citas.filter(c => {
            const citaHora = parseInt((c.hora_inicio ?? c.hora ?? '00:00').split(':')[0]);
            const idMedico = c.medico_id ?? c.medicoId;
            return idMedico === medicoId && citaHora === horaNum;
        });
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
                <button style={s.btnBlue}
                    onClick={() => alert('Se abrirá una nueva cita')}>
                    + Nueva Cita
                </button>
            </div>

            {loading ? <p style={{ padding:20 }}>Cargando agenda...</p> : (
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
                                        <div
                                        key={c.id}
                                        onClick={() => navigate(`/medico/pacientes/${c.paciente_id ?? c.pacienteId}`)}
                                        style={{
                                            ...s.apptBlock,
                                            background:  TIPO_BG[c.tipo]     ?? '#e8f0f8',
                                            borderLeft: `3px solid ${TIPO_BORDER[c.tipo] ?? '#1a3a5c'}`,
                                        }}
                                        >
                                        <div style={s.apptNombre}>
                                            {c.paciente_nombre ?? c.paciente ?? 'Paciente'}
                                        </div>
                                        <div style={s.apptTipo}>
                                            {c.tipo ?? 'consulta'} · {(c.hora_inicio ?? c.hora ?? '').slice(0,5)}
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
        </div>
    )
}

const s = {
  page:      { fontFamily:'Inter,sans-serif', background:'#f4f6f9', minHeight:'100vh' },
  toolbar:   { display:'flex', alignItems:'center', gap:12, padding:'14px 20px', background:'#fff', borderBottom:'1px solid #e0e4ea' },
  back:      { background:'none', border:'none', color:'#1a3a5c', cursor:'pointer', fontSize:13, fontWeight:600 },
  title:     { fontSize:16, fontWeight:600, color:'#1a1a2e', flex:1, margin:0 },
  dateInput: { border:'1px solid #ddd', borderRadius:6, padding:'5px 10px', fontSize:13 },
  btnBlue:   { background:'#1a3a5c', color:'#fff', border:'none', borderRadius:6, padding:'7px 16px', fontSize:13, cursor:'pointer' },
  tableWrap: { overflowX:'auto', padding:20 },
  table:     { width:'100%', borderCollapse:'collapse', background:'#fff', borderRadius:8, overflow:'hidden', boxShadow:'0 1px 3px rgba(0,0,0,.06)' },
  th:        { padding:'10px 12px', fontSize:12, fontWeight:600, color:'#1a3a5c', background:'#f4f6f9', borderBottom:'1px solid #e0e4ea', textAlign:'left', minWidth:170 },
  thHora:    { padding:'10px 8px', fontSize:11, color:'#999', background:'#f4f6f9', borderBottom:'1px solid #e0e4ea', width:60, textAlign:'right' },
  td:        { padding:'4px 6px', borderBottom:'1px solid #f0f0f0', verticalAlign:'top', minHeight:36 },
  tdHora:    { padding:'8px 8px', fontSize:11, color:'#bbb', borderBottom:'1px solid #f0f0f0', textAlign:'right', verticalAlign:'top' },
  apptBlock: { borderRadius:4, padding:'5px 8px', marginBottom:3, cursor:'pointer' },
  apptNombre:{ fontSize:12, fontWeight:600, color:'#1a1a2e' },
  apptTipo:  { fontSize:10, color:'#666', marginTop:1 },
};