import React, { useState } from 'react';
import { 
  View, Text, TextInput, TouchableOpacity, StyleSheet, 
  Image, Alert, KeyboardAvoidingView, Platform 
} from 'react-native';

const LoginScreen = ({ onLoginSuccess }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = async () => {
    // CONEXIÓN REAL AL AWS
    try {
      // Importamos la IP que configuramos en api.js
      const { BASE_URL } = require('../services/api');
      
      const response = await fetch(`${BASE_URL}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      if (response.ok) {
        onLoginSuccess();
      } else {
        Alert.alert('Error', 'Credenciales incorrectas o usuario no encontrado.');
      }
    } catch (error) {
      // Si el servidor falla (como en tu captura), mostramos este aviso técnico
      Alert.alert('Error de Conexión', 'No se pudo conectar con el servidor de AWS. Verifica la IP.');
    }
  };

  return (
    <KeyboardAvoidingView 
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
    >
      <View style={styles.innerContainer}>
        {/* Logo Placeholder */}
        <View style={styles.logoCircle}>
          <Text style={styles.logoText}>M</Text>
        </View>

        <Text style={styles.title}>Iniciar Sesión</Text>
        <Text style={styles.subtitle}>Ingresa a tu cuenta de MediSync</Text>

        <View style={styles.inputContainer}>
          <Text style={styles.label}>Email</Text>
          <TextInput 
            style={styles.input}
            placeholder="ejemplo@correo.com"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
          />
        </View>

        <View style={styles.inputContainer}>
          <Text style={styles.label}>Contraseña</Text>
          <TextInput 
            style={styles.input}
            placeholder="••••••••"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
          />
        </View>

        <TouchableOpacity style={styles.forgotBtn}>
          <Text style={styles.forgotText}>¿Olvidaste tu contraseña?</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.loginBtn} onPress={handleLogin}>
          <Text style={styles.loginBtnText}>Ingresar</Text>
        </TouchableOpacity>

        
        <View style={styles.registerContainer}>
          <Text style={styles.noAccountText}>¿No tienes una cuenta? </Text>
          <TouchableOpacity onPress={() => onGoToRegister()}> 
  <Text style={styles.registerText}>Regístrate</Text>
</TouchableOpacity>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FFFFFF' },
  innerContainer: { flex: 1, padding: 30, justifyContent: 'center', alignItems: 'center' },
  logoCircle: { width: 80, height: 80, borderRadius: 40, backgroundColor: '#1A2A3A', justifyContent: 'center', alignItems: 'center', marginBottom: 20 },
  logoText: { color: '#FFF', fontSize: 40, fontWeight: 'bold' },
  title: { fontSize: 28, fontWeight: 'bold', color: '#1A2A3A' },
  subtitle: { fontSize: 16, color: '#6C757D', marginBottom: 30 },
  inputContainer: { width: '100%', marginBottom: 20 },
  label: { fontSize: 14, fontWeight: 'bold', color: '#1A2A3A', marginBottom: 8 },
  input: { width: '100%', height: 50, borderWidth: 1, borderColor: '#E9ECEF', borderRadius: 10, paddingHorizontal: 15, backgroundColor: '#F8F9FA' },
  forgotBtn: { alignSelf: 'flex-end', marginBottom: 30 },
  forgotText: { color: '#6C757D', fontSize: 14 },
  loginBtn: { width: '100%', height: 55, backgroundColor: '#1A2A3A', borderRadius: 12, justifyContent: 'center', alignItems: 'center', elevation: 2 },
  loginBtnText: { color: '#FFF', fontSize: 18, fontWeight: 'bold' },
  registerContainer: { flexDirection: 'row', marginTop: 30 },
  noAccountText: { color: '#6C757D', fontSize: 14 },
  registerText: { color: '#1A2A3A', fontSize: 14, fontWeight: 'bold' }
});

export default LoginScreen;