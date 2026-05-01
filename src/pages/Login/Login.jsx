import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import api from '../../api/axios';

export default function Login() {
    const [form, setForm] = useState({ email: '', password: '' });
    const [error, setError] = useState('');
    const [ loading, setLoading] = useState(false);
    const { login } = useAuth();
    const navigate = useNavigate();

    async function handleSubmit(e) {
        e.preventDefault();
        setError('');
        setLoading(true);
        try{
            // POST /auth/login -- endpoint
            const { data } = await api.post('/auth/login', {
                email: form.email,
                password: form.password,
            });

            //Devuelve { token, datos del usuario }
            login(data.token, data);
            navigate('/');
        } catch (err) {
            setError(err.response?.data?.error || 'Credenciales invalidas.');
        } finally {
            setLoading(false);
        }
    }

    return (
        <div style={s.page}>
            {/* Panel izquierdo */}
            <div style={s.side}>
                <div style={s.logo}>⚕️</div>
                <h2 style={s.brand}>MediSync</h2>
                <p style={s.brandSub}>Sistema de gestión médica</p>
            </div>

            {/* Formulario */}
            <div style={s.formWrap}>
                <h3 style={s.title}>Iniciar sesión</h3>
                <form onSubmit={handleSubmit} style={s.form}>
                    <div style={s.group}>
                        <label style={s.label}>Correo electrónico</label>
                        <input
                            style={s.input}
                            type="email"
                            required
                            placeholder="ana@clinica.com"
                            value={form.email}
                            onChange={e.setForm(f => ({ ...f, email: e.target.value }))}
                        />
                    </div>
                    <div style={s.group}>
                        <label style={s.label}>Contraseña</label>
                        <input
                            style={s.input}
                            type="password"
                            required
                            placeholder="••••••••"
                            value={form.password}
                            onChange={e => setForm(f => ({ ...f, password: e.target.value }))}
                        />
                    </div>
                    {error && <p style={s.error}>{error}</p>}
                    <button style={s.btn} type="submit" disabled={loading}>
                        {loading ? 'Entrando...' : 'Entrar al sistema'}
                    </button>
                </form>
            </div>
        </div>
    );
}

import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import api from '../../api/axios';

export default function Login() {
  const [form, setForm]       = useState({ email: '', password: '' });
  const [error, setError]     = useState('');
  const [loading, setLoading] = useState(false);
  const { login }  = useAuth();
  const navigate   = useNavigate();

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      // POST /auth/login — endpoint de Alan
      const { data } = await api.post('/auth/login', {
        email:    form.email,
        password: form.password,
      });

      // Alan devuelve { token, ...datosUsuario }
      login(data.token, data);
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.error || 'Credenciales incorrectas.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div style={s.page}>
      {/* Panel izquierdo */}
      <div style={s.side}>
        <div style={s.logo}>🏥</div>
        <h2 style={s.brand}>MediSync</h2>
        <p style={s.brandSub}>Sistema de gestión médica</p>
      </div>

      {/* Formulario */}
      <div style={s.formWrap}>
        <h3 style={s.title}>Iniciar sesión</h3>
        <form onSubmit={handleSubmit} style={s.form}>
          <div style={s.group}>
            <label style={s.label}>Correo electrónico</label>
            <input
              style={s.input}
              type="email"
              required
              placeholder="ana@clinica.com"
              value={form.email}
              onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
            />
          </div>
          <div style={s.group}>
            <label style={s.label}>Contraseña</label>
            <input
              style={s.input}
              type="password"
              required
              placeholder="••••••••"
              value={form.password}
              onChange={e => setForm(f => ({ ...f, password: e.target.value }))}
            />
          </div>
          {error && <p style={s.error}>{error}</p>}
          <button style={s.btn} type="submit" disabled={loading}>
            {loading ? 'Entrando...' : 'Entrar al sistema'}
          </button>
        </form>
      </div>
    </div>
  );
}

const s = {
  page:     { display:'flex', minHeight:'100vh', fontFamily:'Inter,sans-serif' },
  side:     { width:'40%', background:'#1a3a5c', display:'flex', flexDirection:'column', justifyContent:'center', alignItems:'center', gap:10, padding:40 },
  logo:     { fontSize:48 },
  brand:    { color:'#fff', fontSize:24, margin:0, fontWeight:700 },
  brandSub: { color:'rgba(255,255,255,.6)', fontSize:13, margin:0 },
  formWrap: { flex:1, display:'flex', flexDirection:'column', justifyContent:'center', padding:'40px 60px', gap:16 },
  title:    { fontSize:20, fontWeight:600, color:'#1a1a2e', margin:0 },
  form:     { display:'flex', flexDirection:'column', gap:14 },
  group:    { display:'flex', flexDirection:'column', gap:6 },
  label:    { fontSize:11, fontWeight:600, color:'#666', textTransform:'uppercase', letterSpacing:'.05em' },
  input:    { height:40, border:'1px solid #ddd', borderRadius:6, padding:'0 12px', fontSize:14, outline:'none' },
  error:    { color:'#c0392b', fontSize:13, margin:0 },
  btn:      { height:42, background:'#1a3a5c', color:'#fff', border:'none', borderRadius:6, fontSize:14, fontWeight:600, cursor:'pointer' },
};