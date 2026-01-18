# LocalChat - Network Based Chat Application

## Overview
LocalChat is a local network chat application that allows users connected to the same WiFi network to create rooms and communicate in real-time without requiring any third-party APIs or services.

## Features
- ✅ Create chat rooms on local network
- ✅ Join existing rooms
- ✅ Real-time messaging
- ✅ User presence (see who's in the room)
- ✅ System notifications (user joined/left)
- ✅ No external APIs or third-party services
- ✅ Fully peer-to-peer communication

## Prerequisites
- Node.js (v14 or higher)
- npm or yarn
- All devices must be on the same WiFi network

## Installation

### 1. Install Dependencies
```bash
npm install
```

### 2. Configuration
The application uses default ports:
- **Frontend**: `http://localhost:3000`
- **Socket.IO Server**: `http://localhost:3001`

You can change these by setting environment variables:
```bash
NEXT_PUBLIC_SOCKET_URL=http://localhost:3001
SOCKET_PORT=3001
```

## Running the Application

### Method 1: Run Both Servers (Recommended)

Open two terminals:

**Terminal 1 - Start the Socket.IO Server:**
```bash
node socket-server.js
```
You should see: `Socket.IO server running on port 3001`

**Terminal 2 - Start the Next.js Frontend:**
```bash
npm run dev
```
You should see: `http://localhost:3000`

### Method 2: Run with npm scripts (if configured)
```bash
npm run dev:all
```

## How to Use

### Step 1: Open the Application
- Open your browser and navigate to `http://localhost:3000`
- Each user should do this on their device

### Step 2: Enter Your Name
- Enter your preferred username in the "Enter your name" field
- This will be displayed to other users in the room

### Step 3: Create or Join a Room

#### Create a New Room:
1. Click the **"Create Room"** button
2. Enter a room name (e.g., "Gaming", "Study", "Chat")
3. Click **"Create Room"**
4. You'll be redirected to the room and can start chatting

#### Join an Existing Room:
1. Click the **"Join Room"** button
2. Click **"Refresh"** to see available rooms
3. Select a room and click **"Join"**
4. You'll be added to the room with other users

### Step 4: Send Messages
- Type your message in the input field
- Press Enter or click the Send button
- Messages will appear in real-time for all users in the room

### Step 5: Leave Room
- Click the **"Leave Room"** button in the top right
- You'll be removed from the room and returned to the home page

## How It Works

### Architecture
```
User Browser 1
    ↓ (WebSocket)
    ↓
Socket.IO Server (socket-server.js) ← Room Management
    ↑ (WebSocket)
User Browser 2
```

### Key Components

1. **socket-server.js**: Node.js Socket.IO server
   - Manages room creation and joining
   - Handles message broadcasting
   - Tracks user presence
   - Automatically deletes empty rooms

2. **lib/socket-client.ts**: Client-side socket utilities
   - Connects to Socket.IO server
   - Emits events for room operations
   - Listens for incoming messages

3. **app/page.tsx**: Home/Lobby page
   - Room creation form
   - Available rooms list
   - User name input

4. **app/chat/[room]/page.tsx**: Chat room page
   - Message display
   - Message input
   - User list
   - Leave room option

## API Events

### Client → Server Events
```
create-room: { roomName, userId, userName }
join-room: { roomId, userId, userName }
send-message: { roomId, message, userId, userName }
get-rooms: {}
leave-room: { roomId, userId, userName }
```

### Server → Client Events
```
room-created: { roomId, message }
room-joined: { roomId, users, totalUsers }
receive-message: { userId, userName, message, timestamp }
user-joined: { userId, userName, totalUsers, message }
user-left: { userId, userName, totalUsers, message }
rooms-list: { rooms }
error: { message }
```

## Troubleshooting

### Issue: "Socket.IO server running on port 3001" but can't connect
**Solution**: 
- Check if port 3001 is not already in use
- Try: `netstat -an | grep 3001` (Unix) or `netstat -ano | findstr :3001` (Windows)
- Kill the process using the port or change the port number

### Issue: Can't see other users' rooms
**Solution**:
- Make sure all devices are on the same WiFi network
- Click the "Refresh" button in the Join Room section
- Check that the Socket.IO server is running

### Issue: Messages not appearing in real-time
**Solution**:
- Check browser console for errors (F12)
- Verify Socket.IO server is running and accessible
- Check network connectivity between devices

### Issue: Room name contains spaces but shows with dashes
**Solution**: This is expected behavior. Room names are normalized (spaces converted to dashes) for URL compatibility.

## Network Requirements
- All devices must be able to reach the device running the Socket.IO server
- Default address: `http://localhost:3001`
- For accessing from other devices: Replace `localhost` with the host machine's IP address
  - Get IP: `ipconfig` (Windows) or `ifconfig` (Mac/Linux)
  - Example: `http://192.168.1.100:3001`

## Environment Variables
Create a `.env.local` file if needed:
```
NEXT_PUBLIC_SOCKET_URL=http://localhost:3001
SOCKET_PORT=3001
```

## Production Deployment
For production use:
1. Update `NEXT_PUBLIC_SOCKET_URL` to your server's public IP or domain
2. Use a proper Node.js process manager (PM2, systemd, etc.)
3. Set up SSL/TLS certificates for secure WebSocket connections (wss://)
4. Configure proper CORS settings in socket-server.js
5. Consider adding authentication and room passwords

## Security Notes
- This application is designed for local network use only
- No encryption is used by default (messages sent in plain text)
- Consider using HTTPS/WSS for internet deployment
- Add authentication if needed for production

## Performance
- The application can handle multiple rooms with many users
- Room data is stored in memory (resets on server restart)
- For persistence, implement a database

## Future Enhancements
- [ ] Message history/persistence
- [ ] User authentication
- [ ] Room passwords
- [ ] File sharing
- [ ] Voice/Video calls
- [ ] User profiles
- [ ] Typing indicators
- [ ] Message reactions

## Support
For issues or questions, check the troubleshooting section or review the browser console for error messages.

---

**Happy Chatting!** 🚀
