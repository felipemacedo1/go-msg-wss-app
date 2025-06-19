// Configurações de ambiente para API e WebSocket

// Fallback para localhost caso as variáveis não estejam definidas
const API_BASE_URL = process.env.EXPO_PUBLIC_API_BASE_URL || 'http://localhost:8080';
const WS_BASE_URL = process.env.EXPO_PUBLIC_WS_BASE_URL || 'ws://localhost:8080';

export const config = {
  API_URL: `${API_BASE_URL}/api`,
  WS_URL: WS_BASE_URL,
  // Para facilitar a construção de URLs WebSocket específicas
  getWebSocketUrl: (roomId: string) => `${WS_BASE_URL}/subscribe/${roomId}`,
};

export default config;
