import axios from 'axios';
import { config } from '../config/env';

// URL da API centralizada no arquivo de configuração
const API_URL = config.API_URL;

export const getRooms = async (token?: string) => {
  const res = await axios.get(`${API_URL}/rooms`, {
    headers: token ? { Authorization: `Bearer ${token}` } : {},
  });
  return res.data;
};

export const createRoom = async (theme: string, token?: string) => {
  const res = await axios.post(
    `${API_URL}/rooms`,
    { theme },
    // { headers: token ? { Authorization: `Bearer ${token}` } : {} }
  );
  return res.data;
};

export const getRoomDetails = async (roomId: string, token?: string) => {
  const res = await axios.get(`${API_URL}/rooms/${roomId}`, {
    headers: token ? { Authorization: `Bearer ${token}` } : {},
  });
  return res.data;
};
