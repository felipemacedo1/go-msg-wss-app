import axios from 'axios';
import { config } from '../config/env';

export const login = async (nickname: string): Promise<{ token: string }> => {
  return { token: 'mocked-jwt-token-' + nickname };
};
