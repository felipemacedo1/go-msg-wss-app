import axios from 'axios';

const API_URL = 'http://localhost:8080/api';

export const getMessages = async (roomId: string, token?: string) => {
  const res = await axios.get(`${API_URL}/rooms/${roomId}/messages`, {
    headers: token ? { Authorization: `Bearer ${token}` } : {},
  });
  return res.data;
};

export const sendMessage = async (roomId: string, message: string, token?: string) => {
  const res = await axios.post(
    `${API_URL}/rooms/${roomId}/messages`,
    { message },
    { headers: token ? { Authorization: `Bearer ${token}` } : {} }
  );
  return res.data;
};

export const reactMessage = async (roomId: string, messageId: string, token?: string) => {
  const res = await axios.patch(
    `${API_URL}/rooms/${roomId}/messages/${messageId}/react`,
    {},
    { headers: token ? { Authorization: `Bearer ${token}` } : {} }
  );
  return res.data;
};

export const unreactMessage = async (roomId: string, messageId: string, token?: string) => {
  const res = await axios.delete(
    `${API_URL}/rooms/${roomId}/messages/${messageId}/react`,
    { headers: token ? { Authorization: `Bearer ${token}` } : {} }
  );
  return res.data;
};

export const answerMessage = async (roomId: string, messageId: string, token?: string) => {
  const res = await axios.patch(
    `${API_URL}/rooms/${roomId}/messages/${messageId}/answer`,
    {},
    { headers: token ? { Authorization: `Bearer ${token}` } : {} }
  );
  return res.data;
};
