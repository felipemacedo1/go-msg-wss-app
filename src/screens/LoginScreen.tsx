import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet } from 'react-native';
import { useAuth } from '../context/AuthContext';
import { login } from '../api/login';

export default function LoginScreen({ navigation }: any) {
  const [nickname, setNickname] = useState('');
  const [loading, setLoading] = useState(false);
  const { setToken } = useAuth();

  const handleLogin = async () => {
    setLoading(true);
    try {
      const { token } = await login(nickname);
      await setToken(token, nickname); // Passa nickname para o contexto
      navigation.replace('RoomList');
    } catch (e) {
      alert('Erro ao logar');
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Login</Text>
      <TextInput
        style={styles.input}
        placeholder="Seu nickname"
        value={nickname}
        onChangeText={setNickname}
      />
      <Button title={loading ? 'Entrando...' : 'Entrar'} onPress={handleLogin} disabled={loading || !nickname} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 16 },
  title: { fontSize: 24, marginBottom: 24 },
  input: { borderWidth: 1, borderColor: '#ccc', borderRadius: 8, padding: 12, width: '80%', marginBottom: 16 },
});
