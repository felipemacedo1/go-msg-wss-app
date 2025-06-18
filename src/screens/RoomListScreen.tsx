import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, Button, TextInput, StyleSheet, TouchableOpacity } from 'react-native';
import { useRooms } from '../context/RoomContext';
import { getRooms, createRoom } from '../api/rooms';

export default function RoomListScreen({ navigation }: any) {
  const { rooms, setRooms } = useRooms();
  const [newTheme, setNewTheme] = useState('');
  const [loading, setLoading] = useState(false);

  const fetchRooms = async () => {
    setLoading(true);
    try {
      const data = await getRooms();
      setRooms(data as import('../context/RoomContext').Room[]);
    } catch (e) {
      alert('Erro ao buscar salas');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRooms();
  }, []);

  const handleCreateRoom = async () => {
    if (!newTheme.trim()) return;
    try {
      await createRoom(newTheme);
      setNewTheme('');
      fetchRooms();
    } catch (e) {
      alert('Erro ao criar sala');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Salas</Text>
      <FlatList
        data={rooms}
        keyExtractor={item => item.id}
        renderItem={({ item }) => (
          <TouchableOpacity onPress={() => navigation.navigate('Chat', { room: item })} style={styles.roomItem}>
            <Text style={styles.roomTheme}>{item.theme}</Text>
          </TouchableOpacity>
        )}
        refreshing={loading}
        onRefresh={fetchRooms}
        style={{ width: '100%' }}
      />
      <View style={styles.createContainer}>
        <TextInput
          style={styles.input}
          placeholder="Tema da nova sala"
          value={newTheme}
          onChangeText={setNewTheme}
        />
        <Button title="Criar sala" onPress={handleCreateRoom} disabled={!newTheme.trim()} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, backgroundColor: '#fff' },
  title: { fontSize: 24, marginBottom: 16, alignSelf: 'center' },
  roomItem: { padding: 16, borderBottomWidth: 1, borderColor: '#eee' },
  roomTheme: { fontSize: 18 },
  createContainer: { flexDirection: 'row', alignItems: 'center', marginTop: 16 },
  input: { flex: 1, borderWidth: 1, borderColor: '#ccc', borderRadius: 8, padding: 12, marginRight: 8 },
});
