import React, { useEffect, useState } from 'react';
import { 
  View, 
  Text, 
  FlatList, 
  TextInput, 
  StyleSheet, 
  TouchableOpacity, 
  Modal, 
  Pressable, 
  ActivityIndicator,
  StatusBar,
  RefreshControl,
  Alert
} from 'react-native';
import { useRooms } from '../context/RoomContext';
import { getRooms, createRoom } from '../api/rooms';

export default function RoomListScreen({ navigation }: any) {
  const { rooms, setRooms } = useRooms();
  const [newTheme, setNewTheme] = useState('');
  const [loading, setLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [createLoading, setCreateLoading] = useState(false);

  const fetchRooms = async () => {
    setLoading(true);
    try {
      const data = await getRooms();
      setRooms(data as import('../context/RoomContext').Room[]);
    } catch (e) {
      Alert.alert('Erro', 'Não foi possível carregar as salas. Tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRooms();
  }, []);

  const handleCreateRoom = async () => {
    if (!newTheme.trim()) return;
    
    setCreateLoading(true);
    try {
      await createRoom(newTheme);
      setNewTheme('');
      setModalVisible(false);
      fetchRooms();
      Alert.alert('Sucesso', 'Sala criada com sucesso!');
    } catch (e) {
      Alert.alert('Erro', 'Não foi possível criar a sala. Tente novamente.');
    } finally {
      setCreateLoading(false);
    }
  };

  const renderEmptyState = () => (
    <View style={styles.emptyContainer}>
      <Text style={styles.emptyEmoji}>💬</Text>
      <Text style={styles.emptyTitle}>Nenhuma sala encontrada</Text>
      <Text style={styles.emptySubtitle}>
        Seja o primeiro a criar uma sala de conversa!
      </Text>
      <TouchableOpacity 
        style={styles.emptyButton} 
        onPress={() => setModalVisible(true)}
      >
        <Text style={styles.emptyButtonText}>Criar primeira sala</Text>
      </TouchableOpacity>
    </View>
  );

  const renderRoomItem = ({ item }: { item: any }) => (
    <TouchableOpacity 
      style={styles.roomCard} 
      onPress={() => navigation.navigate('Chat', { room: item })}
      activeOpacity={0.7}
    >
      <View style={styles.roomHeader}>
        <View style={styles.roomIconContainer}>
          <Text style={styles.roomIcon}>🏠</Text>
        </View>
        <View style={styles.roomInfo}>
          <Text style={styles.roomTheme} numberOfLines={2}>
            {item.theme}
          </Text>
          <Text style={styles.roomSubtitle}>Toque para entrar</Text>
        </View>
        <View style={styles.roomArrow}>
          <Text style={styles.arrowText}>→</Text>
        </View>
      </View>
    </TouchableOpacity>
  );

  const CreateRoomModal = () => (
    <Modal
      animationType="slide"
      transparent={true}
      visible={modalVisible}
      onRequestClose={() => setModalVisible(false)}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>Nova Sala</Text>
            <TouchableOpacity 
              onPress={() => setModalVisible(false)}
              style={styles.closeButton}
            >
              <Text style={styles.closeButtonText}>✕</Text>
            </TouchableOpacity>
          </View>
          
          <Text style={styles.modalLabel}>Tema da conversa</Text>
          <TextInput
            style={styles.modalInput}
            placeholder="Ex: Tecnologia, Filmes, Esportes..."
            value={newTheme}
            onChangeText={setNewTheme}
            multiline
            maxLength={100}
            autoFocus
          />
          <Text style={styles.characterCount}>
            {newTheme.length}/100 caracteres
          </Text>
          
          <View style={styles.modalButtons}>
            <TouchableOpacity 
              style={styles.cancelButton}
              onPress={() => setModalVisible(false)}
            >
              <Text style={styles.cancelButtonText}>Cancelar</Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={[
                styles.createButton, 
                (!newTheme.trim() || createLoading) && styles.createButtonDisabled
              ]}
              onPress={handleCreateRoom}
              disabled={!newTheme.trim() || createLoading}
            >
              {createLoading ? (
                <ActivityIndicator color="#fff" size="small" />
              ) : (
                <Text style={styles.createButtonText}>Criar Sala</Text>
              )}
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );

  return (
    <>
      <StatusBar barStyle="dark-content" backgroundColor="#f8f9fa" />
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.title}>Salas de Conversa</Text>
          <Text style={styles.subtitle}>Encontre ou crie sua sala ideal</Text>
        </View>

        <FlatList
          data={rooms}
          keyExtractor={item => item.id}
          renderItem={renderRoomItem}
          refreshControl={
            <RefreshControl refreshing={loading} onRefresh={fetchRooms} />
          }
          contentContainerStyle={rooms.length === 0 ? styles.emptyListContainer : styles.listContainer}
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={loading ? null : renderEmptyState}
        />

        {/* Floating Action Button */}
        {rooms.length > 0 && (
          <TouchableOpacity 
            style={styles.fab} 
            onPress={() => setModalVisible(true)}
            activeOpacity={0.8}
          >
            <Text style={styles.fabIcon}>+</Text>
          </TouchableOpacity>
        )}

        <CreateRoomModal />
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    backgroundColor: '#f8f9fa' 
  },
  header: {
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 16,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#e9ecef',
  },
  title: { 
    fontSize: 28, 
    fontWeight: 'bold', 
    color: '#212529',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 16,
    color: '#6c757d',
  },
  listContainer: {
    padding: 16,
  },
  emptyListContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 32,
  },
  
  // Room Card Styles
  roomCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    marginBottom: 12,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  roomHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  roomIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#e7f3ff',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  roomIcon: {
    fontSize: 20,
  },
  roomInfo: {
    flex: 1,
  },
  roomTheme: { 
    fontSize: 18,
    fontWeight: '600',
    color: '#212529',
    marginBottom: 4,
  },
  roomSubtitle: {
    fontSize: 14,
    color: '#6c757d',
  },
  roomArrow: {
    width: 24,
    height: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  arrowText: {
    fontSize: 18,
    color: '#007bff',
    fontWeight: 'bold',
  },

  // Empty State Styles
  emptyContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    flex: 1,
  },
  emptyEmoji: {
    fontSize: 64,
    marginBottom: 16,
  },
  emptyTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#212529',
    marginBottom: 8,
    textAlign: 'center',
  },
  emptySubtitle: {
    fontSize: 16,
    color: '#6c757d',
    textAlign: 'center',
    marginBottom: 32,
    lineHeight: 24,
  },
  emptyButton: {
    backgroundColor: '#007bff',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 25,
  },
  emptyButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },

  // FAB Styles
  fab: {
    position: 'absolute',
    bottom: 24,
    right: 24,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#007bff',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 8,
  },
  fabIcon: {
    fontSize: 24,
    color: '#fff',
    fontWeight: 'bold',
  },

  // Modal Styles
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  modalContent: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 24,
    width: '100%',
    maxWidth: 400,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
  },
  modalTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#212529',
  },
  closeButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#f8f9fa',
    justifyContent: 'center',
    alignItems: 'center',
  },
  closeButtonText: {
    fontSize: 18,
    color: '#6c757d',
  },
  modalLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#212529',
    marginBottom: 8,
  },
  modalInput: {
    borderWidth: 2,
    borderColor: '#e9ecef',
    borderRadius: 12,
    padding: 16,
    fontSize: 16,
    minHeight: 80,
    textAlignVertical: 'top',
    marginBottom: 8,
  },
  characterCount: {
    fontSize: 12,
    color: '#6c757d',
    textAlign: 'right',
    marginBottom: 24,
  },
  modalButtons: {
    flexDirection: 'row',
    gap: 12,
  },
  cancelButton: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 12,
    backgroundColor: '#f8f9fa',
    justifyContent: 'center',
    alignItems: 'center',
  },
  cancelButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#6c757d',
  },
  createButton: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 12,
    backgroundColor: '#007bff',
    justifyContent: 'center',
    alignItems: 'center',
  },
  createButtonDisabled: {
    backgroundColor: '#e9ecef',
  },
  createButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#fff',
  },

  // Legacy styles (removidos)
  roomItem: { display: 'none' },
  createContainer: { display: 'none' },
  input: { display: 'none' },
});
