import { Children, createContext, useContext, useState } from "react";

const AuthContext = createContext(null);

export function AuthProvider({ Children }) {
    const [usuario, setUsuario] = useState(() => {
        const saved = localStorage.getItem('usuario');
    });
    
    function login(token, datosUsuario) {
        localStorage.setItem('token', token);
        localStorage.setItem('usuario', JSON.stringify(datosUsuario));
        setUsuario(datosUsuario);
    }

    function logout() {
        localStorage.removeItem('token');
        localStorage.removeItem('usuario'),
        setUsuario(null);
    }

    return (
        <AuthContext.Provider value={{ usuario, login, logout }}>
            {Children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    return useContext(AuthContext);
}