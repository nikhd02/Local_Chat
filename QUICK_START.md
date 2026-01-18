# LocalChat Setup - Quick Start Guide

## What Was Changed

Your application has been completely transformed into a **Local Network Chat Application** where:
- Users on the same WiFi can create rooms
- Users can join existing rooms
- Real-time messaging between users
- No third-party APIs or services needed
- All communication through a local Socket.IO server

## Files Modified/Created

### Modified Files:
1. **socket-server.js** - Complete rewrite
   - Proper room management
   - User tracking
   - Message broadcasting
   - Automatic cleanup of empty rooms

2. **lib/socket-client.ts** - Complete rewrite
   - New socket helper functions
   - Room creation/joining
   - Message sending/receiving

3. **app/page.tsx** - Complete rewrite
   - Home page with room creation and joining UI
   - User name input
   - Available rooms listing

4. **app/chat/[room]/page.tsx** - Complete rewrite
   - Chat room interface
   - Message display
   - User list
   - Real-time messaging

### New Files:
- **SETUP_GUIDE.md** - Comprehensive documentation

## How to Run

### Option 1: Using the script (Recommended)
```bash
npm run dev:separate
```
This runs both the Next.js frontend and Socket.IO server simultaneously.

### Option 2: Manual (Two Terminals)

**Terminal 1:**
```bash
node socket-server.js
```
Should see: `Socket.IO server running on port 3001`

**Terminal 2:**
```bash
npm run dev
```
Should see: `http://localhost:3000`

### Option 3: Just Socket Server
```bash
npm run socket
```

## Testing the Application

1. Open http://localhost:3000 in your browser
2. Enter your username
3. Create a room with a unique name OR join an existing room
4. Open another browser window/tab and repeat steps 1-3
5. Users in the same room will see each other's messages in real-time

## Key Features Implemented

✅ Room Creation
- Enter room name and create a new chat room
- Room name is auto-formatted (spaces to dashes)

✅ Room Discovery
- See list of all active rooms
- Shows number of users in each room

✅ Real-Time Chat
- Send and receive messages instantly
- See who sent the message
- Timestamps for each message

✅ User Presence
- See who's in the room
- System messages when users join/leave
- User count in room

✅ Room Management
- Automatic cleanup when last user leaves
- Proper disconnection handling
- Error handling for non-existent rooms

## Network Setup for Multiple Devices

To test on multiple physical devices:

1. Find the host machine's IP address:
   - Windows: `ipconfig` (look for IPv4 Address, e.g., 192.168.1.100)
   - Mac/Linux: `ifconfig` (look for inet, e.g., 192.168.1.100)

2. Update environment variable on client machines:
   - In the browser, change `localhost:3001` to `[HOST_IP]:3001`
   - Or set: `NEXT_PUBLIC_SOCKET_URL=http://192.168.1.100:3001`

3. Make sure all devices are on the same WiFi network

4. Ensure firewall allows port 3001

## Architecture Overview

```
┌─────────────────────────┐
│   Browser 1             │
│  - LocalChat UI         │
│  - User: "John"         │
└────────────┬────────────┘
             │ WebSocket
             │
    ┌────────▼────────┐
    │ Socket.IO Server│
    │  Port 3001      │
    │                 │
    │ Room Management:│
    │ - Gaming        │
    │ - Study         │
    │ - Chat          │
    └────────▲────────┘
             │ WebSocket
┌────────────┴────────────┐
│   Browser 2             │
│  - LocalChat UI         │
│  - User: "Jane"         │
└─────────────────────────┘
```

## Troubleshooting

**Port 3001 already in use:**
```bash
netstat -ano | findstr :3001  # Find PID
taskkill /PID [PID] /F         # Kill it
```

**Can't see other users:**
- Verify both on same WiFi
- Refresh the "Join Room" list
- Check console for errors (F12)

**Messages not sending:**
- Check that socket-server.js is running
- Verify network connectivity
- Check browser console for errors

## Next Steps

For production/deployment:
1. Add user authentication
2. Persist messages to a database
3. Add SSL/TLS certificates
4. Implement proper CORS security
5. Add rate limiting
6. Add moderation tools

## Support
Refer to SETUP_GUIDE.md for detailed documentation and troubleshooting.

---

**The app is ready to use!** 🎉
