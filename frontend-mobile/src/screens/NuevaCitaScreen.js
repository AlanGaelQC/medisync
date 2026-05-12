import React, { useState, useEffect } from 'react';
import { 
  View, Text, TextInput, TouchableOpacity, StyleSheet, 
  ScrollView, SafeAreaView, Alert, ActivityIndicator 
} from 'react-native';
import { BASE_URL } from '../services/api';

const NuevaCitaScreen = ({ onGoBack, citaParaEditar }) => {
  const [loading, setLoading] = useState(false);
  
  const [titulo, setTitulo] = useState('');
  const [tipo, setTipo] = useState('Salud'); 
  const [fecha, setFecha] = useState('');
  const [hora, setHora] = useState('');
  const [profesional, setProfesional] = useState('');
  const [ubicacion, setUbicacion] = useState('');
  const [telefono, setTelefono] = useState('');
  const [email, setEmail] = useState('');
  const [notas, setNotas] = useState('');

  useEffect(() => {
    if (citaParaEditar) {
      setTitulo(citaParaEditar.titulo);
      setTipo(citaParaEditar.tipo);
      setFecha(citaParaEditar.fecha);
      setHora(citaParaEditar.hora);
      setProfesional(citaParaEditar.profesional || '');
      setUbicacion(citaParaEditar.ubicacion || '');
      setTelefono(citaParaEditar.telefono || '');
      setEmail(citaParaEditar.email || '');
      setNotas(citaParaEditar.notas || '');
    }
  }, [citaParaEditar]);

  const handleGuardarCita = async () => {
    if (!titulo.trim() || !fecha.trim() || !hora.trim()) {
      Alert.alert('Datos incompletos', 'Los campos de Título, Fecha y Hora son obligatorios.');
      return;
    }

    const datosCita = {
      titulo, tipo, fecha, hora_inicio: hora, profesional, ubicacion, telefono, email, notas
    };
    
    setLoading(true);
    try {
      const url = citaParaEditar 
        ? `${BASE_URL}/citas/${citaParaEditar.id}` 
        : `${BASE_URL}/citas`;
      
      const method = citaParaEditar ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method: method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(datosCita),
      });

      if (response.ok) {
        Alert.alert(
          'Operación exitosa', 
          citaParaEditar ? 'La cita ha sido actualizada.' : 'La cita ha sido registrada.',
          [{ text: 'Aceptar', onPress: () => onGoBack() }]
        );
      } else {
        Alert.alert('Error', 'No se pudo guardar en el servidor de AWS.');
      }
    } catch (error) {
      Alert.alert('Error de conexión', 'Fallo al comunicar con AWS.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={onGoBack} style={styles.backButton}>
          <Text style={styles.backText}>Volver</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>
          {citaParaEditar ? 'Editar Cita' : 'Nueva Cita'}
        </Text>
      </View>

      <ScrollView contentContainerStyle={styles.formContainer} showsVerticalScrollIndicator={false}>
        
        <Text style={styles.label}>Título</Text>
        <TextInput style={styles.input} placeholder="Ej. Chequeo general" value={titulo} onChangeText={setTitulo} />

        <Text style={styles.label}>Tipo</Text>
        <TextInput style={styles.input} value={tipo} onChangeText={setTipo} />

        <View style={styles.row}>
          <View style={styles.halfInput}>
            <Text style={styles.label}>Fecha</Text>
            <TextInput style={styles.input} placeholder="AAAA-MM-DD" value={fecha} onChangeText={setFecha} />
          </View>
          <View style={styles.halfInput}>
            <Text style={styles.label}>Hora</Text>
            <TextInput style={styles.input} placeholder="10:00 AM" value={hora} onChangeText={setHora} />
          </View>
        </View>

        <Text style={styles.label}>Profesional</Text>
        <TextInput style={styles.input} placeholder="Nombre del médico" value={profesional} onChangeText={setProfesional} />

        <Text style={styles.label}>Ubicación</Text>
        <TextInput style={styles.input} placeholder="Consultorio o clínica" value={ubicacion} onChangeText={setUbicacion} />

        <Text style={styles.label}>Notas</Text>
        <TextInput 
          style={[styles.input, styles.textArea]} 
          multiline={true} 
          numberOfLines={4} 
          placeholder="Información adicional..." 
          value={notas} 
          onChangeText={setNotas} 
        />

        <TouchableOpacity 
          style={[styles.submitButton, loading && { opacity: 0.7 }]} 
          onPress={handleGuardarCita}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="#FFF" />
          ) : (
            <Text style={styles.submitButtonText}>
              {citaParaEditar ? 'Guardar Cambios' : 'Confirmar Cita'}
            </Text>
          )}
        </TouchableOpacity>

      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FFFFFF' },
  header: { flexDirection: 'row', alignItems: 'center', padding: 20, borderBottomWidth: 1, borderBottomColor: '#F1F5F9' },
  backButton: { marginRight: 15, paddingVertical: 5, paddingHorizontal: 10, backgroundColor: '#F1F5F9', borderRadius: 8 },
  backText: { fontSize: 14, color: '#1A2A3A', fontWeight: 'bold' },
  headerTitle: { fontSize: 24, fontWeight: 'bold', color: '#1A2A3A' },
  formContainer: { padding: 20, paddingBottom: 40 },
  label: { fontSize: 14, fontWeight: '600', color: '#1A2A3A', marginBottom: 8, marginTop: 15 },
  input: { backgroundColor: '#FFFFFF', borderWidth: 1, borderColor: '#CBD5E1', borderRadius: 8, padding: 14, fontSize: 16, color: '#333' },
  row: { flexDirection: 'row', justifyContent: 'space-between' },
  halfInput: { width: '48%' },
  textArea: { height: 80, textAlignVertical: 'top' },
  submitButton: { backgroundColor: '#1A2A3A', padding: 16, borderRadius: 8, alignItems: 'center', marginTop: 35 },
  submitButtonText: { color: '#FFFFFF', fontSize: 16, fontWeight: 'bold' },
});

export default NuevaCitaScreen;