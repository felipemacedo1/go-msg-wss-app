// src/screens/ChatScreen.tsx
// Tela de chat: conecta ao WebSocket e imprime mensagens recebidas
import React, { useEffect, useRef, useState } from 'react';
import { View, Text, StyleSheet, FlatList, TextInput, Button, TouchableOpacity, KeyboardAvoidingView, Platform } from 'react-native';
import { useChat, Message } from '../context/ChatContext';
import { getMessages, sendMessage, reactMessage, unreactMessage, answerMessage } from '../api/messages';
import { useWebSocket } from '../hooks/useWebSocket';
import MessageBubble from '../components/MessageBubble';

export default function ChatScreen({ route }: any) {
  const { room } = route.params;
  const { messages, setMessages } = useChat();
  const [input, setInput] = useState('');
  const flatListRef = useRef<FlatList<Message>>(null);
  const wsUrl = `ws://localhost:8080/subscribe/${room.id}`;

  // Carrega mensagens ao montar
  useEffect(() => {
    getMessages(room.id).then((msgs) => setMessages(msgs as Message[]));
  }, [room.id, setMessages]);

  // WebSocket para eventos
  useWebSocket(wsUrl, (msg) => {
    try {
      const event = JSON.parse(msg.data);
      if (event.kind === 'message_created') {
        setMessages((prev) => ([...prev, event.value]));
      } else if (event.kind === 'message_reaction_increased') {
        setMessages((prev) => prev.map((m) => m.id === event.value.id ? { ...m, reaction_count: event.value.count } : m));
      } else if (event.kind === 'message_reaction_decreased') {
        setMessages((prev) => prev.map((m) => m.id === event.value.id ? { ...m, reaction_count: event.value.count } : m));
      } else if (event.kind === 'message_answered') {
        setMessages((prev) => prev.map((m) => m.id === event.value.id ? { ...m, answered: true } : m));
      }
    } catch (e) {
      console.log('Erro ao processar evento WS', e);
    }
  });

  // Scroll automático ao receber novas mensagens
  useEffect(() => {
    flatListRef.current?.scrollToEnd({ animated: true });
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim()) return;
    await sendMessage(room.id, input);
    setInput('');
  };

  const handleLike = async (message: Message) => {
    await reactMessage(message.room_id, message.id);
  };

  const handleUnlike = async (message: Message) => {
    await unreactMessage(message.room_id, message.id);
  };

  const handleAnswer = async (message: Message) => {
    await answerMessage(message.room_id, message.id);
  };

  return (
    <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <View style={styles.container}>
        <Text style={styles.title}>Sala: {room.theme}</Text>
        <FlatList
          ref={flatListRef}
          data={messages}
          keyExtractor={item => item.id}
          renderItem={({ item }) => (
            <View style={{ marginVertical: 2 }}>
              <MessageBubble message={item} isOwn={false} />
              <View style={styles.reactionsRow}>
                <TouchableOpacity onPress={() => handleLike(item)} style={styles.likeBtn}>
                  <Text>👍 {item.reaction_count}</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => handleUnlike(item)} style={styles.likeBtn}>
                  <Text>👎</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => handleAnswer(item)} style={styles.likeBtn}>
                  <Text>Responder</Text>
                </TouchableOpacity>
                {item.answered && <Text style={styles.answered}>Respondida</Text>}
              </View>
            </View>
          )}
          contentContainerStyle={{ paddingBottom: 16 }}
        />
        <View style={styles.inputRow}>
          <TextInput
            style={styles.input}
            value={input}
            onChangeText={setInput}
            placeholder="Digite sua mensagem..."
            onSubmitEditing={handleSend}
            returnKeyType="send"
          />
          <Button title="Enviar" onPress={handleSend} disabled={!input.trim()} />
        </View>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 8, backgroundColor: '#fff' },
  title: { fontSize: 20, marginBottom: 8, alignSelf: 'center' },
  inputRow: { flexDirection: 'row', alignItems: 'center', padding: 8 },
  input: { flex: 1, borderWidth: 1, borderColor: '#ccc', borderRadius: 8, padding: 10, marginRight: 8 },
  reactionsRow: { flexDirection: 'row', alignItems: 'center', marginLeft: 8 },
  likeBtn: { marginRight: 12, padding: 4 },
  answered: { color: 'green', fontWeight: 'bold' },
});
