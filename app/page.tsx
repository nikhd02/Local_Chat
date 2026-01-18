'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { Video, Users, Zap, Shield, Globe, Plus, LogIn } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { getSocket, createRoom, joinRoom } from '@/lib/socket-client';
import MatchingSpinner from '@/components/MatchingSpinner';

export default function Home() {
  const router = useRouter();
  const [userId, setUserId] = useState('');
  const [userName, setUserName] = useState('');
  const [roomName, setRoomName] = useState('');
  const [availableRooms, setAvailableRooms] = useState<any[]>([]);
  const [showCreateRoom, setShowCreateRoom] = useState(false);
  const [showJoinRoom, setShowJoinRoom] = useState(false);

  useEffect(() => {
    const id = `user_${Math.random().toString(36).substr(2, 9)}`;
    setUserId(id);
  }, []);

  useEffect(() => {
    const socket = getSocket();
    
    // Listen for room creation
    const handleRoomCreated = ({ roomId }: { roomId: string }) => {
      console.log('Room created:', roomId, 'userId:', userId, 'userName:', userName);
      if (userId && userName) {
        router.push(`/chat/${roomId}?userId=${userId}&userName=${encodeURIComponent(userName)}`);
      }
    };

    // Listen for room joined
    const handleRoomJoined = ({ roomId }: { roomId: string }) => {
      console.log('Room joined:', roomId, 'userId:', userId, 'userName:', userName);
      if (userId && userName) {
        router.push(`/chat/${roomId}?userId=${userId}&userName=${encodeURIComponent(userName)}`);
      }
    };

    // Listen for rooms list
    const handleRoomsList = ({ rooms }: { rooms: any[] }) => {
      console.log('Rooms list received:', rooms);
      setAvailableRooms(rooms);
    };

    // Listen for errors
    const handleError = ({ message }: { message: string }) => {
      alert(message);
    };

    socket.on('room-created', handleRoomCreated);
    socket.on('room-joined', handleRoomJoined);
    socket.on('rooms-list', handleRoomsList);
    socket.on('error', handleError);

    return () => {
      socket.off('room-created', handleRoomCreated);
      socket.off('room-joined', handleRoomJoined);
      socket.off('rooms-list', handleRoomsList);
      socket.off('error', handleError);
    };
  }, [userId, userName, router]);

  const handleCreateRoom = () => {
    if (!userName || !roomName) {
      alert('Please enter your name and room name');
      return;
    }
    createRoom(roomName, userId, userName);
  };

  const handleJoinRoom = (roomId: string) => {
    if (!userName) {
      alert('Please enter your name');
      return;
    }
    joinRoom(roomId, userId, userName);
  };

  const handleGetRooms = () => {
    const socket = getSocket();
    socket.emit('get-rooms');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-purple-950 to-black overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-green-900/20 via-transparent to-transparent" />

      <div className="relative z-10 flex flex-col items-center justify-center min-h-screen p-4">
        <motion.div
          initial={{ scale: 0.5, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="text-center space-y-8 max-w-4xl mx-auto"
        >
          <motion.div
            initial={{ y: -50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="relative inline-block"
          >
            <div className="absolute inset-0 blur-3xl bg-green-500/30 rounded-full" />
            <h1 className="text-6xl md:text-8xl font-black text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-emerald-600 relative z-10">
              LocalChat
            </h1>
          </motion.div>

          <motion.p
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="text-xl md:text-2xl text-gray-300 max-w-2xl mx-auto"
          >
            Chat with people on your network. Create a room or join an existing one.
          </motion.p>

          {/* User Name Input */}
          <motion.div
            initial={{ y: 30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="mt-8"
          >
            <input
              type="text"
              placeholder="Enter your name"
              value={userName}
              onChange={(e) => setUserName(e.target.value)}
              className="px-6 py-3 rounded-full border-2 border-green-500 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent bg-black/50 text-white placeholder-gray-400 text-center w-64"
            />
          </motion.div>

          {/* Create/Join Room Options */}
          <motion.div
            initial={{ y: 30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.6 }}
            className="flex flex-col sm:flex-row gap-4 justify-center items-center mt-12"
          >
            <Button
              onClick={() => setShowCreateRoom(!showCreateRoom)}
              className="group relative bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white text-lg font-bold py-6 px-10 rounded-full shadow-2xl hover:shadow-green-500/50 transition-all duration-300 transform hover:scale-105"
            >
              <Plus className="w-5 h-5 mr-2 inline" />
              Create Room
            </Button>

            <Button
              onClick={() => {
                setShowJoinRoom(!showJoinRoom);
                handleGetRooms();
              }}
              className="group relative bg-gradient-to-r from-blue-500 to-cyan-600 hover:from-blue-600 hover:to-cyan-700 text-white text-lg font-bold py-6 px-10 rounded-full shadow-2xl hover:shadow-blue-500/50 transition-all duration-300 transform hover:scale-105"
            >
              <LogIn className="w-5 h-5 mr-2 inline" />
              Join Room
            </Button>
          </motion.div>

          {/* Create Room Form */}
          {showCreateRoom && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-8 bg-white/5 backdrop-blur-sm rounded-2xl p-8 border border-green-500/20"
            >
              <h2 className="text-2xl font-bold text-white mb-6">Create New Room</h2>
              <div className="space-y-4">
                <input
                  type="text"
                  placeholder="Room Name (e.g., Gaming, Study, Chat)"
                  value={roomName}
                  onChange={(e) => setRoomName(e.target.value)}
                  className="w-full px-4 py-3 rounded-lg border border-green-500/30 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent bg-black/50 text-white placeholder-gray-400"
                />
                <Button
                  onClick={handleCreateRoom}
                  className="w-full bg-green-500 hover:bg-green-600 text-white font-bold py-3 rounded-lg transition-all duration-300"
                >
                  Create Room
                </Button>
              </div>
            </motion.div>
          )}

          {/* Join Room List */}
          {showJoinRoom && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-8 bg-white/5 backdrop-blur-sm rounded-2xl p-8 border border-blue-500/20 w-full max-w-2xl"
            >
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-white">Available Rooms</h2>
                <Button
                  onClick={handleGetRooms}
                  className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded-lg"
                >
                  Refresh
                </Button>
              </div>
              
              {availableRooms.length === 0 ? (
                <p className="text-gray-400 text-center py-8">No rooms available. Create one to get started!</p>
              ) : (
                <div className="space-y-3">
                  {availableRooms.map((room) => (
                    <motion.div
                      key={room.roomId}
                      initial={{ x: -20, opacity: 0 }}
                      animate={{ x: 0, opacity: 1 }}
                      className="flex justify-between items-center bg-black/30 p-4 rounded-lg border border-blue-500/20 hover:border-blue-500/50 transition-all"
                    >
                      <div>
                        <h3 className="text-white font-semibold capitalize">{room.roomId.replace(/-/g, ' ')}</h3>
                        <p className="text-gray-400 text-sm">{room.totalUsers} user{room.totalUsers !== 1 ? 's' : ''}</p>
                      </div>
                      <Button
                        onClick={() => handleJoinRoom(room.roomId)}
                        className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-6 rounded-lg"
                      >
                        Join
                      </Button>
                    </motion.div>
                  ))}
                </div>
              )}
            </motion.div>
          )}

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.4 }}
            className="mt-16 text-gray-500 text-sm"
          >
            <p>Local network chat • No external servers • Peer-to-peer communication</p>
          </motion.div>
        </motion.div>

        <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-green-500/50 to-transparent" />
      </div>
    </div>
  );
}
