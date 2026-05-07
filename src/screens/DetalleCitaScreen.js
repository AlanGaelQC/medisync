import React from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity, 
  SafeAreaView, 
  ScrollView,
  Alert
} from 'react-native';
import { BASE_URL } from '../services/api';

const DetalleCitaScreen = ({ cita, onGoBack, onEditar }) => {
  if (!cita) return null;

  const handleEliminar = () => {
    Alert.alert(
      'Cancelar Cita',
      '¿Estás seguro de que deseas cancelar esta cita?',
      [
        { text: 'No, mantener', style: 'cancel' },
        { 
          text: 'Sí, cancelar', 
          style: 'destructive',
          onPress: async () => {
            try {
              const response = await fetch(`${BASE_URL}/citas/${cita.id}`, { method: 'DELETE' });
              
              if (response.ok) {
                Alert.alert('Cita cancelada', 'La cita ha sido eliminada de tu agenda.', [
                  { text: 'Aceptar', onPress: () => { if (onGoBack) onGoBack(); } }
                ]);
              } else {
                Alert.alert('Error', 'No se pudo eliminar en el servidor de AWS.');
              }
            } catch (error) {
              Alert.alert('Error de conexión', 'Fallo al comunicar con AWS.');
            }
          } 
        }
      ]
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={onGoBack} style={styles.backButton}>
          <Text style={styles.backText}>Volver</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Detalle</Text>
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        
        <View style={styles.card}>
          <Text style={styles.tipoTag}>{cita.tipo}</Text>
          <Text style={styles.titulo}>{cita.titulo}</Text>
          <Text style={styles.profesionalText}>{cita.profesional || 'Profesional no asignado'}</Text>
        </View>

        <View style={styles.card}>
          <Text style={styles.cardTitle}>Información</Text>
          <View style={styles.infoRow}>
            <View>
              <Text style={styles.infoLabel}>Fecha</Text>
              <Text style={styles.infoValue}>{cita.fecha}</Text>
            </View>
          </View>
          <View style={styles.infoRow}>
            <View>
              <Text style={styles.infoLabel}>Hora</Text>
              <Text style={styles.infoValue}>{cita.hora}</Text>
            </View>
          </View>
          <View style={styles.infoRow}>
            <View>
              <Text style={styles.infoLabel}>Ubicación</Text>
              <Text style={styles.infoValue}>{cita.ubicacion || 'No especificada'}</Text>
            </View>
          </View>
        </View>

        <View style={styles.card}>
          <Text style={styles.cardTitle}>Contacto</Text>
          <View style={styles.infoRow}>
            <View>
              <Text style={styles.infoLabel}>Profesional</Text>
              <Text style={styles.infoValue}>{cita.profesional || 'No especificado'}</Text>
            </View>
          </View>
          <View style={styles.infoRow}>
            <View>
              <Text style={styles.infoLabel}>Teléfono</Text>
              <Text style={styles.infoValue}>{cita.telefono || 'No especificado'}</Text>
            </View>
          </View>
          <View style={styles.infoRow}>
            <View>
              <Text style={styles.infoLabel}>Email</Text>
              <Text style={styles.infoValue}>{cita.email || 'No especificado'}</Text>
            </View>
          </View>
        </View>

        <View style={styles.card}>
          <Text style={styles.cardTitle}>Notas</Text>
          <Text style={styles.infoValue}>{cita.notas || 'Sin notas adicionales.'}</Text>
        </View>

        <View style={styles.actionButtonsContainer}>
          <TouchableOpacity style={styles.btnEditar} onPress={onEditar}>
            <Text style={styles.btnEditarText}>Editar</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.btnEliminar} onPress={handleEliminar}>
            <Text style={styles.btnEliminarText}>Eliminar</Text>
          </TouchableOpacity>
        </View>

      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F9FA',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E9ECEF',
  },
  backButton: {
    marginRight: 15,
    paddingVertical: 5,
    paddingHorizontal: 10,
    backgroundColor: '#F1F5F9',
    borderRadius: 8,
  },
  backText: {
    fontSize: 14,
    color: '#1A2A3A',
    fontWeight: 'bold',
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#000000',
  },
  content: {
    padding: 20,
    paddingBottom: 40,
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 20,
    marginBottom: 15,
    borderWidth: 1,
    borderColor: '#E9ECEF',
    elevation: 2,
  },
  tipoTag: {
    fontSize: 12,
    color: '#6C757D',
    textTransform: 'uppercase',
    marginBottom: 5,
  },
  titulo: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1A2A3A',
    marginBottom: 5,
  },
  profesionalText: {
    fontSize: 14,
    color: '#6C757D',
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1A2A3A',
    marginBottom: 15,
  },
  infoRow: {
    flexDirection: 'row',
    marginBottom: 15,
    alignItems: 'flex-start',
  },
  infoLabel: {
    fontSize: 12,
    color: '#6C757D',
  },
  infoValue: {
    fontSize: 15,
    color: '#212529',
    marginTop: 2,
  },
  actionButtonsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
  },
  btnEditar: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#CED4DA',
    borderRadius: 8,
    padding: 15,
    alignItems: 'center',
    marginRight: 10,
    backgroundColor: '#FFFFFF',
  },
  btnEditarText: {
    color: '#212529',
    fontWeight: 'bold',
    fontSize: 16,
  },
  btnEliminar: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#E74C3C',
    borderRadius: 8,
    padding: 15,
    alignItems: 'center',
    backgroundColor: '#FFF0F0',
  },
  btnEliminarText: {
    color: '#E74C3C',
    fontWeight: 'bold',
    fontSize: 16,
  },
});

export default DetalleCitaScreen;