import React, { useState } from 'react';
import { 
  View, Text, TextInput, TouchableOpacity, StyleSheet, 
  Alert, ScrollView, SafeAreaView 
} from 'react-native';

const RegistroScreen = ({ onRegisterSuccess, onBackToLogin }) => {
  const [nombre, setNombre] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleRegistro = async () => {
    if (!nombre || !email || !password) {
      Alert.alert('Error', 'Todos los campos son obligatorios.');
      return;
    }

    try {
      const { BASE_URL } = require('../services/api');
      const response = await fetch(`${BASE_URL}/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ nombre, email, password }),
      });

      if (response.ok) {
        Alert.alert('¡Éxito!', 'Cuenta creada correctamente.', [
          { text: 'Ir al Login', onPress: onBackToLogin }
        ]);
      } else {
        Alert.alert('Error', 'No se pudo crear la cuenta. Intenta con otro email.');
      }
    } catch (error) {
      // Modo rescate por si el AWS de Gael falla en la demo
      Alert.alert('Modo Demo', 'Simulando registro exitoso...');
      onRegisterSuccess();
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.innerContainer}>
        <Text style={styles.title}>Crear Cuenta</Text>
        <Text style={styles.subtitle}>Únete a MediSync para gestionar tus citas</Text>

        <View style={styles.inputContainer}>
          <Text style={styles.label}>Nombre Completo</Text>
          <TextInput 
            style={styles.input} 
            placeholder="Ana López" 
            value={nombre} 
            onChangeText={setNombre} 
          />
        </View>

        <View style={styles.inputContainer}>
          <Text style={styles.label}>Email</Text>
          <TextInput 
            style={styles.input} 
            placeholder="ana@clinica.com" 
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

        <TouchableOpacity style={styles.btnRegistro} onPress={handleRegistro}>
          <Text style={styles.btnText}>Registrarse</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={onBackToLogin} style={styles.backBtn}>
          <Text style={styles.backText}>¿Ya tienes cuenta? Inicia sesión</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FFF' },
  innerContainer: { padding: 30, justifyContent: 'center' },
  title: { fontSize: 28, fontWeight: 'bold', color: '#1A2A3A', marginBottom: 10 },
  subtitle: { fontSize: 16, color: '#6C757D', marginBottom: 30 },
  inputContainer: { width: '100%', marginBottom: 20 },
  label: { fontSize: 14, fontWeight: 'bold', color: '#1A2A3A', marginBottom: 8 },
  input: { width: '100%', height: 50, borderWidth: 1, borderColor: '#E9ECEF', borderRadius: 10, paddingHorizontal: 15, backgroundColor: '#F8F9FA' },
  btnRegistro: { width: '100%', height: 55, backgroundColor: '#1A2A3A', borderRadius: 12, justifyContent: 'center', alignItems: 'center', marginTop: 10 },
  btnText: { color: '#FFF', fontSize: 18, fontWeight: 'bold' },
  backBtn: { marginTop: 25, alignSelf: 'center' },
  backText: { color: '#6C757D', fontSize: 14 }
});

export default RegistroScreen;