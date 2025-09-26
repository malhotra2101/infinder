// Minimal realtime service stub to satisfy imports and allow build
// Real-time service for WebSocket and SSE connections

const noop = () => {};

function createUnsubscribe() {
  let active = true;
  return () => {
    if (!active) return;
    active = false;
  };
}

const realtimeService = {
  async connectWebSocket() {
    return Promise.resolve();
  },
  initializeSSE: noop,
  disconnect: noop,
  subscribeToChannel(_channel, _handler) {
    // Return unsubscribe fn
    return createUnsubscribe();
  },
  sendMessage(_type, _payload, _channel) {
    // No-op in stub
  },
  getConnectionStatus() {
    return { isConnected: false };
  },
  subscribeToTable(_table, _event, _handler) {
    // Return a minimal subscription-like object
    return { unsubscribe: noop };
  },
};

export default realtimeService;


