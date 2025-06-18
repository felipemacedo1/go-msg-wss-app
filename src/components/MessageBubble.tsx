// src/components/MessageBubble.tsx
// Componente para exibir uma mensagem no chat
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Message } from '../context/ChatContext';

type Props = {
  message: Message;
  isOwn: boolean;
};

export default function MessageBubble({ message, isOwn }: Props) {
  return (
    <View style={[styles.bubble, isOwn ? styles.own : styles.other]}>
      <Text style={styles.user}>{message.user}</Text>
      <Text>{message.content}</Text>
      <Text style={styles.time}>{new Date(message.createdAt).toLocaleTimeString()}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  bubble: {
    marginVertical: 4,
    padding: 10,
    borderRadius: 8,
    maxWidth: '80%',
  },
  own: {
    backgroundColor: '#d1f7c4',
    alignSelf: 'flex-end',
  },
  other: {
    backgroundColor: '#f1f1f1',
    alignSelf: 'flex-start',
  },
  user: {
    fontWeight: 'bold',
    marginBottom: 2,
  },
  time: {
    fontSize: 10,
    color: '#888',
    marginTop: 4,
    alignSelf: 'flex-end',
  },
});
