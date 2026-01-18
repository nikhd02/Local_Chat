const { createServer } = require('http');
const { parse } = require('url');
const next = require('next');
const { Server } = require('socket.io');

const dev = process.env.NODE_ENV !== 'production';
const hostname = 'localhost';
const port = parseInt(process.env.PORT || '3000', 10);

const app = next({ dev, hostname, port });
const handle = app.getRequestHandler();

const rooms = new Map();

app.prepare().then(() => {
  const httpServer = createServer(async (req, res) => {
    try {
      const parsedUrl = parse(req.url, true);
      await handle(req, res, parsedUrl);
    } catch (err) {
      console.error('Error occurred handling', req.url, err);
      res.statusCode = 500;
      res.end('internal server error');
    }
  });

  const io = new Server(httpServer, {
    cors: {
      origin: '*',
      methods: ['GET', 'POST'],
    },
    transports: ['websocket', 'polling'],
  });

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
      console.log(`User ${userName} (${userId}) joined room ${roomId}. Total users: ${room.users.size}`);

      // Notify all users in the room (excluding self)
      socket.to(roomId).emit('user-joined', { 
        userId, 
        userName,
        totalUsers: room.users.size,
        message: `${userName} joined the room`
      });

      // Send room info to the joining user
      const usersList = Array.from(room.users.values()).filter(u => u.userId !== userId);
      socket.emit('room-joined', { 
        roomId, 
        users: usersList,
        totalUsers: usersList.length
      });
    });

    // Send message in room
    socket.on('send-message', ({ roomId, message, userId, userName, replyTo, replyToUser }) => {
      if (!rooms.has(roomId)) {
        socket.emit('error', { message: 'Room does not exist!' });
        return;
      }

      console.log(`[${roomId}] ${userName}: ${message}`);
      
      // Broadcast to all users in the room EXCEPT sender
      socket.to(roomId).emit('receive-message', {
        userId,
        userName,
        message,
        timestamp: Date.now(),
        replyTo,
        replyToUser,
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
      console.log(`User ${userName} left room ${roomId}. Remaining users: ${room.users.size}`);

      // Notify remaining users
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

  httpServer
    .once('error', (err) => {
      console.error(err);
      process.exit(1);
    })
    .listen(port, () => {
      console.log(`> Ready on http://${hostname}:${port}`);
      console.log(`> Socket.IO server running`);
    });
});
