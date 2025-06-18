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
      <Text style={styles.user}>{message.author_name}</Text>
      <Text>{message.message}</Text>
      <Text style={styles.time}>{new Date(message.created_at).toLocaleTimeString()}</Text>
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
