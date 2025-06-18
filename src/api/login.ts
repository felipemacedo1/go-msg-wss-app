import axios from 'axios';

export const login = async (nickname: string): Promise<{ token: string }> => {
  return { token: 'mocked-jwt-token-' + nickname };
};
