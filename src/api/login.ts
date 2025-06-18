// src/api/login.ts
// Função de login
import axios from 'axios';

export const login = async (nickname: string): Promise<{ token: string }> => {
  // Mocked login for now
  // Replace with real API call if needed
  return { token: 'mocked-jwt-token-' + nickname };
};
