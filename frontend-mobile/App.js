import React, { useState } from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import LoginScreen from './src/screens/LoginScreen';
import CitasScreen from './src/screens/CitasScreen';
import NuevaCitaScreen from './src/screens/NuevaCitaScreen';
import DetalleCitaScreen from './src/screens/DetalleCitaScreen';
import RegistroScreen from './src/screens/RegistroScreen';

export default function App() {
  const [currentScreen, setCurrentScreen] = useState('Login');
  // ESTADO CLAVE: Guarda la cita que seleccionas para ver o editar
  const [citaSeleccionada, setCitaSeleccionada] = useState(null);

  const navigateTo = (screenName, data = null) => {
    if (data) setCitaSeleccionada(data);
    setCurrentScreen(screenName);
  };

  const renderScreen = () => {
    switch (currentScreen) {
      case 'Login':
        return (
          <LoginScreen 
            onLoginSuccess={() => navigateTo('Citas')} 
            onGoToRegister={() => navigateTo('Registro')} 
          />
        );

      case 'Registro':
        return (
          <RegistroScreen 
            onRegisterSuccess={() => navigateTo('Login')} 
            onBackToLogin={() => navigateTo('Login')} 
          />
        );
      
      case 'Citas':
        return (
          <CitasScreen 
            onNuevaCita={() => {
              setCitaSeleccionada(null); // Limpiamos para que sea una cita nueva
              navigateTo('NuevaCita');
            }} 
            onVerDetalle={(cita) => navigateTo('DetalleCita', cita)} 
            onLogout={() => navigateTo('Login')} 
          />
        );
      
      case 'NuevaCita':
        return (
          <NuevaCitaScreen 
            onGoBack={() => navigateTo('Citas')} 
            citaParaEditar={citaSeleccionada} // Pasa los datos si es edición
          />
        );

      case 'DetalleCita':
        return (
          <DetalleCitaScreen 
            cita={citaSeleccionada} 
            onGoBack={() => navigateTo('Citas')} 
            onEditar={() => navigateTo('NuevaCita', citaSeleccionada)} // Reutiliza NuevaCita para editar
          />
        );
      
      default:
        return <LoginScreen onLoginSuccess={() => navigateTo('Citas')} />;
    }
  };

  return (
    <SafeAreaProvider>
      {renderScreen()}
    </SafeAreaProvider>
  );
}