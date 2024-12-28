// src/services/websocket.ts
export const setupWebSocket = (onMessage: (data: any) => void) => {
    const ws = new WebSocket('your_websocket_endpoint');
    
    ws.onmessage = (event) => {
      const data = JSON.parse(event.data);
      onMessage(data);
    };
    
    return ws;
  };