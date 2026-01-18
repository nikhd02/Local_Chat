# StrangerChat - Production Omegle Clone

A modern, fully-featured random video chat application built with Next.js 15, TypeScript, Tailwind CSS, Socket.IO, and ZEGOCLOUD. Connect with strangers worldwide instantly with real-time video, audio, and text chat.

## Features

- **Dark Neon Theme**: Beautiful glassmorphism UI with green neon accents
- **Random 1:1 Matching**: Socket.IO-based queue system for instant pairing
- **Video Chat**: ZEGOCLOUD UIKit with camera/mic controls and screen sharing
- **Text Chat**: Real-time messaging during video calls
- **Skip/Next**: Instantly skip to find another stranger
- **Mobile Perfect**: Fully responsive design with touch controls
- **Production Ready**: Optimized for deployment on Vercel, Netlify, or any Node.js server

## Tech Stack

- **Frontend**: Next.js 15, React 18, TypeScript, Tailwind CSS, Framer Motion
- **Backend**: Node.js with Socket.IO, integrated with Next.js
- **Video**: ZEGOCLOUD UIKit
- **Icons**: Lucide React
- **Animation**: Framer Motion

## Quick Start

### 1. Clone & Install

```bash
git clone <repository>
cd project
npm install
```

### 2. ZEGOCLOUD Setup

1. Go to [https://console.zegocloud.com](https://console.zegocloud.com)
2. Sign up and create a new project
3. Get your `APP_ID` from the project dashboard
4. Generate a `Server Secret` token
5. Create `.env.local` file:

```env
NEXT_PUBLIC_ZEGOCLOUD_APP_ID=your_app_id
NEXT_PUBLIC_ZEGOCLOUD_SERVER_SECRET=your_server_secret
NEXT_PUBLIC_SOCKET_URL=http://localhost:3000
```

### 3. Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser. Open it in two tabs to test the full flow.

### 4. Testing the App

1. **First Tab**: Click "Start Video Chat"
2. **Second Tab**: Click "Start Video Chat"
3. Both tabs will match and show video chat interface
4. Use buttons to:
   - Toggle mic/video
   - Send text messages
   - Skip to next stranger
   - End call

## Project Structure

```
app/
├── page.tsx                  # Homepage with dark neon theme
├── chat/
│   └── [room]/
│       └── page.tsx         # Video chat room interface
├── layout.tsx               # Root layout with providers

components/
├── VideoCall.tsx            # ZEGOCLOUD integration
├── ChatMessages.tsx         # Real-time text chat
├── MatchingSpinner.tsx      # Finding stranger animation
├── Controls.tsx             # Mic/video/skip/chat controls
└── ui/                      # Shadcn UI components

lib/
├── socket-client.ts         # Socket.IO client configuration
└── zegocloud-config.ts      # ZEGOCLOUD setup

public/                       # Static assets
server.js                     # Socket.IO server with Next.js
socket-server.js             # Standalone Socket.IO server
package.json                 # Dependencies & scripts
.env.example                 # Environment variables template
```

## Scripts

```bash
# Development with integrated Socket.IO
npm run dev

# Development with separate Socket.IO server
npm run dev:separate

# Production build
npm run build

# Start production server
npm start

# Run Socket.IO server separately
npm run socket

# Type checking
npm run typecheck

# Linting
npm run lint
```

## Environment Variables

Create a `.env.local` file (use `.env.example` as template):

```env
# ZEGOCLOUD (Required for video chat)
NEXT_PUBLIC_ZEGOCLOUD_APP_ID=123456789
NEXT_PUBLIC_ZEGOCLOUD_SERVER_SECRET=your_secret_key

# Socket.IO (Required for matching)
NEXT_PUBLIC_SOCKET_URL=http://localhost:3000

# Server
PORT=3000
SOCKET_PORT=3001
NODE_ENV=development
```

## How It Works

### User Flow

1. **Homepage**: User lands on beautiful dark neon homepage
2. **Start Chat**: Click "Start Video Chat" button
3. **Queue**: Join matching queue, see "Finding stranger..." animation
4. **Match**: Get matched with random stranger in 3-5 seconds
5. **Video Chat**: ZEGOCLOUD video interface loads
6. **Interact**:
   - Video/audio call
   - Real-time text chat
   - Screen sharing
   - Control mic/camera
7. **Skip**: Press "Next" to skip and find another stranger
8. **End Call**: Hang up anytime to return to homepage

### Matching System

Socket.IO manages:
- Waiting queue of users
- Room creation when 2 users match
- Real-time message relay
- Skip/disconnect handling
- Auto-cleanup of empty rooms

## Deployment

### Vercel Deployment

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel

# Set environment variables in Vercel dashboard:
# NEXT_PUBLIC_ZEGOCLOUD_APP_ID
# NEXT_PUBLIC_ZEGOCLOUD_SERVER_SECRET
# NEXT_PUBLIC_SOCKET_URL (use your Vercel URL)
```

### Self-Hosted (Node.js)

```bash
# Build
npm run build

# Start
npm start

# Set environment variables:
export NEXT_PUBLIC_ZEGOCLOUD_APP_ID=your_id
export NEXT_PUBLIC_ZEGOCLOUD_SERVER_SECRET=your_secret
```

### Docker Deployment

```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build
EXPOSE 3000
CMD ["npm", "start"]
```

## Mobile Responsiveness

- Touch-optimized controls
- Mobile-friendly video layout
- Responsive button sizing
- Full-screen video on mobile
- Chat sidebar collapses on small screens

## Browser Support

- Chrome/Chromium (v90+)
- Firefox (v88+)
- Safari (v14+)
- Edge (v90+)

Requires WebRTC support and camera/microphone permissions.

## Performance

- Optimized animations with Framer Motion
- Lazy-loaded components
- Socket.IO transport fallbacks (websocket + polling)
- Automatic reconnection handling
- Efficient state management

## Security & Privacy

- No data persistence (Socket.IO rooms only)
- Peer-to-peer video via ZEGOCLOUD
- No recording by default
- Users can end calls anytime
- Messages cleared on disconnect

## Troubleshooting

### Camera/Mic Not Working

1. Check browser permissions (allow camera/mic)
2. Test in different browser
3. Check ZEGOCLOUD credentials in `.env.local`
4. Restart development server

### Socket.IO Connection Issues

1. Verify `NEXT_PUBLIC_SOCKET_URL` is correct
2. Check if port 3000/3001 are available
3. Try opening app in new incognito window
4. Check browser console for errors

### ZEGOCLOUD Not Loading

1. Verify `NEXT_PUBLIC_ZEGOCLOUD_APP_ID` is set
2. Check credential validity in ZEGOCLOUD console
3. Ensure both credentials are non-empty
4. Clear browser cache and reload

### No Match Found

1. Open app in 2 separate tabs/browsers
2. Both users must click "Start Video Chat"
3. Wait 5-10 seconds for matching
4. Check console for Socket.IO errors

## Features Roadmap

- [ ] User authentication (optional)
- [ ] Chat history storage
- [ ] Rating/blocking system
- [ ] Custom user avatars
- [ ] Screen sharing UI improvements
- [ ] Mobile app (React Native)
- [ ] AI content moderation
- [ ] Analytics dashboard

## Contributing

Contributions welcome! Please follow:
- TypeScript strict mode
- Component-based architecture
- Responsive design principles
- Accessibility standards

## License

MIT License - feel free to use commercially

## Support

- ZEGOCLOUD Docs: https://docs.zegocloud.com
- Socket.IO Docs: https://socket.io/docs
- Next.js Docs: https://nextjs.org/docs
- Issue Tracker: GitHub Issues

---

**Built with passion for connecting people worldwide.**
