import React, { useState, useEffect } from 'react';
import { 
  View, Text, FlatList, StyleSheet, TouchableOpacity, 
  SafeAreaView, StatusBar, Alert, ActivityIndicator 
} from 'react-native';
import { BASE_URL } from '../services/api';

const CitasScreen = ({ onNuevaCita, onVerDetalle, onLogout }) => {
  const [citas, setCitas] = useState([]);
  const [loading, setLoading] = useState(true);

  const cargarCitas = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${BASE_URL}/citas`);
      const data = await response.json();
      
      Alert.alert("Lo que manda AWS:", JSON.stringify(data).substring(0, 250));
      
      if (response.ok) {
        // Validación de seguridad: Asegurarnos que data sea una lista
        if (Array.isArray(data)) {
          setCitas(data);
        } else if (data && data.citas) {
          // Por si Gael lo manda dentro de un objeto { citas: [...] }
          setCitas(data.citas);
        } else if (data && data.body) {
           // A veces AWS API Gateway lo manda dentro de "body"
           const parsedBody = typeof data.body === 'string' ? JSON.parse(data.body) : data.body;
           setCitas(Array.isArray(parsedBody) ? parsedBody : []);
        } else {
          console.log("El formato no es un arreglo reconocido.");
          setCitas([]);
        }
      } else {
        console.log("Error en la respuesta del servidor:", response.status);
        setCitas([]); 
      }
    } catch (error) {
      console.error("Error al conectar con AWS:", error);
      setCitas([]); 
      Alert.alert("Error de conexión", "No se pudo conectar al servidor de AWS.");
    } finally {
      setLoading(false);
    }
  };

  const eliminarCita = (id) => {
    Alert.alert(
      "Eliminar Cita",
      "¿Estás seguro de que quieres cancelar esta cita?",
      [
        { text: "No", style: "cancel" },
        { 
          text: "Sí, eliminar", 
          style: "destructive",
          onPress: async () => {
            try {
              const response = await fetch(`${BASE_URL}/citas/${id}`, {
                method: 'DELETE',
              });

              if (response.ok) {
                setCitas(prevCitas => prevCitas.filter(item => item.id !== id));
                Alert.alert("Éxito", "Cita eliminada correctamente.");
              } else {
                Alert.alert("Error", "No se pudo eliminar en el servidor de AWS.");
              }
            } catch (error) {
              Alert.alert("Error de conexión", "Fallo al comunicar con AWS.");
            }
          }
        }
      ]
    );
  };

  // Se ejecuta al cargar la pantalla
  useEffect(() => {
    cargarCitas();
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" />
      
      <View style={styles.headerContainer}>
        <Text style={styles.headerTitle}>Mis Citas</Text>
        <View style={styles.headerButtons}>
          {/* Botón de recarga manual súper útil para pruebas y presentaciones */}
          <TouchableOpacity onPress={cargarCitas} style={styles.refreshBtn}>
            <Text style={styles.refreshText}>↻ Actualizar</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={onLogout}>
            <Text style={styles.logoutText}>Salir</Text>
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.summaryContainer}>
        <View style={styles.summaryCard}>
          <Text style={styles.summaryNumber}>{citas.length}</Text>
          <Text style={styles.summaryLabel}>Total</Text>
        </View>
       <View style={styles.summaryCard}>
          <Text style={styles.summaryNumber}>{citas.length}</Text> 
          <Text style={styles.summaryLabel}>Próximas</Text>
        </View>
      </View>

      {loading ? (
        <ActivityIndicator size="large" color="#1A2A3A" style={{ marginTop: 50 }} />
      ) : (
        <FlatList
          data={citas}
          keyExtractor={(item, index) => item.id ? item.id.toString() : index.toString()}
          contentContainerStyle={styles.listContent}
          ListEmptyComponent={<Text style={{textAlign: 'center', marginTop: 20, color: '#6C757D'}}>No hay citas registradas o no hay conexión al servidor.</Text>}
          renderItem={({ item }) => (
            <View style={styles.cardContainer}>
              <TouchableOpacity 
                style={styles.citaCard}
                onPress={() => onVerDetalle && onVerDetalle(item)}
              >
                <Text style={styles.tipoTag}>{item.tipo || 'Sin tipo'}</Text>
                <Text style={styles.citaTitulo}>{item.titulo || 'Cita sin título'}</Text>
                <View style={styles.infoRow}>
                  <Text style={styles.infoText}>Fecha: {item.fecha || 'N/A'}</Text>
                  <Text style={styles.infoText}>  Hora: {item.hora_inicio || 'N/A'}</Text>
                </View>
              </TouchableOpacity>
              
              <TouchableOpacity 
                style={styles.deleteBtn} 
                onPress={() => eliminarCita(item.id)}
              >
                <Text style={styles.deleteBtnText}>X</Text>
              </TouchableOpacity>
            </View>
          )}
        />
      )}

      <TouchableOpacity style={styles.btnNuevaCita} onPress={onNuevaCita}>
        <Text style={styles.btnText}>+ Nueva Cita</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F8F9FA' },
  headerContainer: { padding: 20, backgroundColor: '#FFF', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  headerTitle: { fontSize: 28, fontWeight: 'bold', color: '#1A2A3A' },
  headerButtons: { flexDirection: 'row', alignItems: 'center' },
  refreshBtn: { marginRight: 15, backgroundColor: '#F1F5F9', paddingHorizontal: 10, paddingVertical: 5, borderRadius: 8 },
  refreshText: { color: '#1A2A3A', fontSize: 14, fontWeight: 'bold' },
  logoutText: { color: '#E74C3C', fontSize: 16, fontWeight: 'bold' },
  summaryContainer: { flexDirection: 'row', justifyContent: 'space-between', paddingHorizontal: 20, marginBottom: 20 },
  summaryCard: { backgroundColor: '#FFF', width: '48%', padding: 15, borderRadius: 12, borderWidth: 1, borderColor: '#E9ECEF', alignItems: 'flex-start', elevation: 2 },
  summaryNumber: { fontSize: 22, fontWeight: 'bold', color: '#1A2A3A' },
  summaryLabel: { color: '#6C757D', fontSize: 14 },
  listContent: { paddingHorizontal: 20, paddingBottom: 100 },
  
  cardContainer: { flexDirection: 'row', alignItems: 'center', marginBottom: 15 },
  citaCard: { 
    flex: 1,
    backgroundColor: '#FFF', 
    padding: 20, 
    borderRadius: 15, 
    elevation: 3, 
    borderLeftWidth: 5, 
    borderLeftColor: '#1A2A3A' 
  },
  deleteBtn: {
    padding: 15,
    backgroundColor: '#FDEDEC',
    borderRadius: 12,
    marginLeft: 10,
    justifyContent: 'center',
    alignItems: 'center',
    width: 50,
  },
  deleteBtnText: { fontSize: 18, color: '#E74C3C', fontWeight: 'bold' },
  
  tipoTag: { fontSize: 12, color: '#6C757D', marginBottom: 5, textTransform: 'uppercase' },
  citaTitulo: { fontSize: 18, fontWeight: 'bold', color: '#212529', marginBottom: 10 },
  infoRow: { flexDirection: 'row' },
  infoText: { fontSize: 14, color: '#495057' },
  btnNuevaCita: { position: 'absolute', bottom: 30, alignSelf: 'center', backgroundColor: '#1A2A3A', paddingVertical: 15, paddingHorizontal: 80, borderRadius: 30, elevation: 5 },
  btnText: { color: '#FFF', fontSize: 16, fontWeight: 'bold' },
});

export default CitasScreen;