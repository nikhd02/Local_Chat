import { io, Socket } from 'socket.io-client';

let socket: Socket | null = null;

export const getSocket = (): Socket => {
  if (!socket) {
    const socketUrl = process.env.NEXT_PUBLIC_SOCKET_URL || 'http://localhost:3001';

    socket = io(socketUrl, {
      transports: ['websocket', 'polling'],
      reconnection: true,
      reconnectionAttempts: 5,
      reconnectionDelay: 1000,
      timeout: 10000,
    });

    socket.on('connect', () => {
      console.log('Socket connected:', socket?.id);
    });

    socket.on('disconnect', (reason) => {
      console.log('Socket disconnected:', reason);
    });

    socket.on('connect_error', (error) => {
      console.error('Socket connection error:', error);
    });
  }

  return socket;
};

export const disconnectSocket = () => {
  if (socket) {
    socket.disconnect();
    socket = null;
  }
};

export const createRoom = (roomName: string, userId: string, userName: string) => {
  const socket = getSocket();
  socket.emit('create-room', { roomName, userId, userName });
};

export const joinRoom = (roomId: string, userId: string, userName: string) => {
  const socket = getSocket();
  socket.emit('join-room', { roomId, userId, userName });
};

export const sendMessage = (roomId: string, message: string, userId: string, userName: string) => {
  const socket = getSocket();
  socket.emit('send-message', { roomId, message, userId, userName });
};

export const leaveRoom = (roomId: string, userId: string, userName: string) => {
  const socket = getSocket();
  socket.emit('leave-room', { roomId, userId, userName });
};

export const getRooms = () => {
  const socket = getSocket();
  socket.emit('get-rooms');
};

export interface ChatMessage {
  userId: string;
  userName: string;
  message: string;
  timestamp: number;
  replyTo?: string;
  replyToUser?: string;
}
