import React, { useState, useEffect } from 'react';
import { useWebSocket, useConnectionStatus } from '../../../hooks/useRealtime.js';

const RealtimeTest = () => {
  const [messages, setMessages] = useState([]);
  const [testMessage, setTestMessage] = useState('');
  const connectionStatus = useConnectionStatus();

  const { isConnected, sendMessage, lastMessage } = useWebSocket('test', (message) => {
    setMessages(prev => [...prev, { ...message, timestamp: new Date().toLocaleTimeString() }]);
  });

  const sendTestMessage = () => {
    if (testMessage.trim()) {
      sendMessage('test', { text: testMessage, userId: 'test-user' });
      setTestMessage('');
    }
  };

  const clearMessages = () => {
    setMessages([]);
  };

  return (
    <div style={{
      position: 'fixed',
      bottom: '20px',
      right: '20px',
      width: '300px',
      background: 'white',
      border: '1px solid #ccc',
      borderRadius: '8px',
      padding: '16px',
      boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
      zIndex: 1000,
      maxHeight: '400px',
      overflow: 'hidden'
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
        <h4 style={{ margin: 0 }}>Real-time Test</h4>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          fontSize: '12px'
        }}>
          <div style={{
            width: '8px',
            height: '8px',
            borderRadius: '50%',
            background: connectionStatus.isConnected ? '#10B981' : '#EF4444'
          }}></div>
          {connectionStatus.isConnected ? 'Connected' : 'Disconnected'}
        </div>
      </div>

      <div style={{
        height: '200px',
        overflowY: 'auto',
        border: '1px solid #eee',
        borderRadius: '4px',
        padding: '8px',
        marginBottom: '12px',
        fontSize: '12px'
      }}>
        {messages.length === 0 ? (
          <div style={{ color: '#666', textAlign: 'center', marginTop: '20px' }}>
            No messages yet
          </div>
        ) : (
          messages.map((msg, index) => (
            <div key={index} style={{ marginBottom: '8px', padding: '4px' }}>
              <div style={{ fontWeight: 'bold', fontSize: '10px', color: '#666' }}>
                {msg.timestamp}
              </div>
              <div>{JSON.stringify(msg.payload)}</div>
            </div>
          ))
        )}
      </div>

      <div style={{ display: 'flex', gap: '8px', marginBottom: '8px' }}>
        <input
          type="text"
          value={testMessage}
          onChange={(e) => setTestMessage(e.target.value)}
          placeholder="Type a test message..."
          style={{
            flex: 1,
            padding: '6px 8px',
            border: '1px solid #ddd',
            borderRadius: '4px',
            fontSize: '12px'
          }}
          onKeyPress={(e) => e.key === 'Enter' && sendTestMessage()}
        />
        <button
          onClick={sendTestMessage}
          disabled={!isConnected}
          style={{
            padding: '6px 12px',
            background: isConnected ? '#3B82F6' : '#ccc',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: isConnected ? 'pointer' : 'not-allowed',
            fontSize: '12px'
          }}
        >
          Send
        </button>
      </div>

      <button
        onClick={clearMessages}
        style={{
          width: '100%',
          padding: '6px',
          background: '#6B7280',
          color: 'white',
          border: 'none',
          borderRadius: '4px',
          cursor: 'pointer',
          fontSize: '12px'
        }}
      >
        Clear Messages
      </button>
    </div>
  );
};

export default RealtimeTest; 