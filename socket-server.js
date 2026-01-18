const { createServer } = require('http');
const { Server } = require('socket.io');

const port = parseInt(process.env.SOCKET_PORT || '3001', 10);

const httpServer = createServer();
const io = new Server(httpServer, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST'],
  },
  transports: ['websocket', 'polling'],
});

const rooms = new Map();

io.on('connection', (socket) => {
  console.log('Client connected:', socket.id);

  // Create a new room
  socket.on('create-room', ({ roomName, userId, userName }) => {
    const roomId = roomName.replace(/\s+/g, '-').toLowerCase();
    
    if (!rooms.has(roomId)) {
      rooms.set(roomId, {
        users: new Map(),
        createdAt: Date.now(),
      });
      console.log(`Room created: ${roomId}`);
    }
    
    socket.emit('room-created', { roomId, message: `Room '${roomName}' created successfully!` });
  });

  // Join an existing room
  socket.on('join-room', ({ roomId, userId, userName }) => {
    if (!rooms.has(roomId)) {
      socket.emit('error', { message: 'Room does not exist!' });
      return;
    }

    const room = rooms.get(roomId);
    room.users.set(socket.id, { userId, userName });
    
    socket.join(roomId);
    console.log(`User ${userName} (${userId}) joined room ${roomId}`);

    // Notify all users in the room
    io.to(roomId).emit('user-joined', { 
      userId, 
      userName,
      totalUsers: room.users.size,
      message: `${userName} joined the room`
    });

    // Send room info to the joining user
    socket.emit('room-joined', { 
      roomId, 
      users: Array.from(room.users.values()),
      totalUsers: room.users.size 
    });
  });

  // Send message in room
  socket.on('send-message', ({ roomId, message, userId, userName }) => {
    if (!rooms.has(roomId)) {
      socket.emit('error', { message: 'Room does not exist!' });
      return;
    }

    console.log(`[${roomId}] ${userName}: ${message}`);
    
    io.to(roomId).emit('receive-message', {
      userId,
      userName,
      message,
      timestamp: Date.now(),
    });
  });

  // Get available rooms
  socket.on('get-rooms', () => {
    const availableRooms = Array.from(rooms.keys()).map(roomId => ({
      roomId,
      totalUsers: rooms.get(roomId).users.size,
    }));
    socket.emit('rooms-list', { rooms: availableRooms });
  });

  // Leave room
  socket.on('leave-room', ({ roomId, userId, userName }) => {
    if (!rooms.has(roomId)) return;

    const room = rooms.get(roomId);
    room.users.delete(socket.id);

    socket.leave(roomId);
    console.log(`User ${userName} left room ${roomId}`);

    io.to(roomId).emit('user-left', {
      userId,
      userName,
      totalUsers: room.users.size,
      message: `${userName} left the room`
    });

    // Delete room if empty
    if (room.users.size === 0) {
      rooms.delete(roomId);
      console.log(`Room ${roomId} deleted (empty)`);
    }
  });

  socket.on('disconnect', () => {
    console.log('Client disconnected:', socket.id);
    
    // Remove user from all rooms
    rooms.forEach((room, roomId) => {
      if (room.users.has(socket.id)) {
        const userData = room.users.get(socket.id);
        room.users.delete(socket.id);
        
        io.to(roomId).emit('user-left', {
          userId: userData.userId,
          userName: userData.userName,
          totalUsers: room.users.size,
          message: `${userData.userName} disconnected`
        });

        if (room.users.size === 0) {
          rooms.delete(roomId);
        }
      }
    });
  });
});

httpServer.listen(port, () => {
  console.log(`Socket.IO server running on port ${port}`);
});
