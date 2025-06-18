// src/components/RoomCard.tsx
// Componente para exibir uma sala na lista
import React from 'react';
import { TouchableOpacity, Text, StyleSheet, View } from 'react-native';
import { Room } from '../context/RoomContext';

type Props = {
  room: Room;
  onPress: () => void;
};

export default function RoomCard({ room, onPress }: Props) {
  return (
    <TouchableOpacity style={styles.card} onPress={onPress}>
      <View>
        <Text style={styles.theme}>{room.theme}</Text>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    padding: 16,
    borderBottomWidth: 1,
    borderColor: '#eee',
    backgroundColor: '#fafafa',
  },
  theme: {
    fontSize: 18,
  },
});
