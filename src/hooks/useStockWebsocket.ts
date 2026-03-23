import { useEffect } from 'react';
import useWebSocket from 'react-use-websocket';
import { useQueryClient } from '@tanstack/react-query';

// Determinamos la URL de WebSockets con base en la variable de entorno o un valor por defecto
const baseURL = import.meta.env.VITE_API_URL || 'http://localhost:8000';
const WS_URL = baseURL.replace(/^http/, 'ws') + '/ws/stock/';

export const useStockWebsocket = () => {
  const queryClient = useQueryClient();

  const { lastJsonMessage } = useWebSocket(WS_URL, {
    shouldReconnect: () => true,
    reconnectAttempts: 10,
    reconnectInterval: 3000,
  });

  useEffect(() => {
    if (lastJsonMessage !== null) {
      const data = lastJsonMessage as { type: string; variant_id: number; new_stock: number };

      if (data.type === 'stock_update') {
        // En lugar de mutar un objeto específico que tal vez no conozcamos de entrada, 
        // invalidamos las queries relacionadas de React Query para que la app (Store/POS)
        // obtenga la última información de los productos y el stock directamente.
        queryClient.invalidateQueries({ queryKey: ['products'] });
        queryClient.invalidateQueries({ queryKey: ['product'] }); // por si la app pide un `product` por id
        queryClient.invalidateQueries({ queryKey: ['adminProducts'] });
        queryClient.invalidateQueries({ queryKey: ['posProducts'] });
      }
    }
  }, [lastJsonMessage, queryClient]);
};
