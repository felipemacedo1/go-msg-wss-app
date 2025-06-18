// src/api/rooms.ts
// Funções para manipulação de salas
import axios from 'axios';

const API_URL = 'http://localhost:8080';

export const getRooms = async (token: string) => {
  const res = await axios.get(`${API_URL}/rooms`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.data;
};

export const createRoom = async (token: string, theme: string) => {
  const res = await axios.post(
    `${API_URL}/create-room`,
    { theme },
    { headers: { Authorization: `Bearer ${token}` } }
  );
  return res.data;
};
