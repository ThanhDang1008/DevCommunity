// 1. Chat Component Example
import React, { useState, useEffect } from 'react';
import { useSocket } from './hooks/useSocket';

interface Message {
  id: string;
  user: string;
  message: string;
  timestamp: Date;
}

export const ChatComponent: React.FC = () => {
  const { socket, isConnected, emit, on, off } = useSocket({
    url: process.env.NEXT_PUBLIC_SOCKET_URL,
    autoConnect: true
  });
  
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');

  useEffect(() => {
    const handleNewMessage = (message: Message) => {
      setMessages(prev => [...prev, message]);
    };

    const handleUserJoined = (data: { user: string }) => {
      console.log(`${data.user} joined the chat`);
    };

    // Đăng ký event listeners
    on('new-message', handleNewMessage);
    on('user-joined', handleUserJoined);

    // Cleanup khi component unmount
    return () => {
      off('new-message', handleNewMessage);
      off('user-joined', handleUserJoined);
    };
  }, [on, off]);

  const sendMessage = () => {
    if (newMessage.trim() && isConnected) {
      emit('send-message', {
        message: newMessage,
        user: 'current-user',
        timestamp: new Date()
      });
      setNewMessage('');
    }
  };

  return (
    <div className="chat-container">
      <div className="connection-status">
        Status: {isConnected ? '🟢 Connected' : '🔴 Disconnected'}
      </div>
      
      <div className="messages">
        {messages.map((msg) => (
          <div key={msg.id} className="message">
            <strong>{msg.user}:</strong> {msg.message}
          </div>
        ))}
      </div>
      
      <div className="input-area">
        <input
          type="text"
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
          disabled={!isConnected}
        />
        <button onClick={sendMessage} disabled={!isConnected}>
          Send
        </button>
      </div>
    </div>
  );
};

// 2. Real-time Notifications Component
export const NotificationComponent: React.FC = () => {
  const { isConnected, on, off } = useSocket();
  const [notifications, setNotifications] = useState<string[]>([]);

  useEffect(() => {
    const handleNotification = (data: { message: string }) => {
      setNotifications(prev => [...prev.slice(-4), data.message]); // Giữ 5 notification mới nhất
    };

    on('notification', handleNotification);

    return () => {
      off('notification', handleNotification);
    };
  }, [on, off]);

  if (!isConnected) {
    return <div>Connecting to notifications...</div>;
  }

  return (
    <div className="notifications">
      <h3>Live Notifications</h3>
      {notifications.map((notification, index) => (
        <div key={index} className="notification-item">
          {notification}
        </div>
      ))}
    </div>
  );
};

// 3. Game State Component với custom options
export const GameComponent: React.FC = () => {
  const { socket, isConnected, emit, on, off, connect, disconnect } = useSocket({
    url: 'ws://localhost:3002', // Game server khác
    options: {
      timeout: 5000,
      forceNew: true,
    },
    autoConnect: false // Không tự động connect
  });

  const [gameState, setGameState] = useState<any>(null);
  const [playerCount, setPlayerCount] = useState(0);

  useEffect(() => {
    const handleGameUpdate = (state: any) => {
      setGameState(state);
    };

    const handlePlayerCount = (count: number) => {
      setPlayerCount(count);
    };

    on('game-update', handleGameUpdate);
    on('player-count', handlePlayerCount);

    return () => {
      off('game-update', handleGameUpdate);
      off('player-count', handlePlayerCount);
    };
  }, [on, off]);

  const joinGame = () => {
    if (!isConnected) {
      connect();
    }
    emit('join-game', { playerId: 'user-123' });
  };

  const leaveGame = () => {
    emit('leave-game');
    disconnect();
  };

  return (
    <div className="game-container">
      <div className="game-controls">
        <button onClick={joinGame} disabled={isConnected}>
          Join Game
        </button>
        <button onClick={leaveGame} disabled={!isConnected}>
          Leave Game
        </button>
      </div>
      
      <div className="game-info">
        <p>Players online: {playerCount}</p>
        <p>Status: {isConnected ? 'Connected' : 'Disconnected'}</p>
      </div>
      
      {gameState && (
        <div className="game-state">
          <pre>{JSON.stringify(gameState, null, 2)}</pre>
        </div>
      )}
    </div>
  );
};

// 4. Environment variables (.env.local)
/*
NEXT_PUBLIC_SOCKET_URL=ws://localhost:3001
*/

// 5. Package.json dependencies
/*
{
  "dependencies": {
    "socket.io-client": "^4.7.2"
  },
  "devDependencies": {
    "@types/node": "^20.0.0"
  }
}
*/