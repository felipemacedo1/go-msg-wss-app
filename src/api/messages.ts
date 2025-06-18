// src/api/messages.ts
// Funções para manipulação de mensagens
import axios from 'axios';

const API_URL = 'http://localhost:8080';

export const getMessages = async (token: string, roomId: string) => {
  const res = await axios.get(`${API_URL}/rooms/${roomId}/messages`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.data;
};

export const sendMessage = async (token: string, roomId: string, content: string) => {
  const res = await axios.post(
    `${API_URL}/rooms/${roomId}/messages`,
    { content },
    { headers: { Authorization: `Bearer ${token}` } }
  );
  return res.data;
};

export const reactMessage = async (token: string, messageId: string, reaction: string) => {
  const res = await axios.post(
    `${API_URL}/messages/${messageId}/react`,
    { reaction },
    { headers: { Authorization: `Bearer ${token}` } }
  );
  return res.data;
};
