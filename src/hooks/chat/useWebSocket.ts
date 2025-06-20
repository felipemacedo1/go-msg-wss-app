import { useEffect, useRef } from 'react';

export const useWebSocket = (url: string, onMessage: (msg: MessageEvent) => void) => {
  const ws = useRef<WebSocket | null>(null);
  const reconnectTimeout = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    let isMounted = true;
    function connect() {
      ws.current = new WebSocket(url);
      ws.current.onopen = () => {
        console.log('WebSocket conectado');
      };
      ws.current.onmessage = onMessage;
      ws.current.onclose = () => {
        console.log('WebSocket desconectado, tentando reconectar...');
        if (isMounted) reconnectTimeout.current = setTimeout(connect, 2000);
      };
      ws.current.onerror = (e) => {
        console.log('WebSocket erro:', e);
        ws.current?.close();
      };
    }
    connect();
    return () => {
      isMounted = false;
      ws.current?.close();
      if (reconnectTimeout.current) clearTimeout(reconnectTimeout.current);
    };
  }, [url]);

  return ws;
};
