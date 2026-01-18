'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { getSocket, sendMessage, leaveRoom, ChatMessage } from '@/lib/socket-client';
import { Button } from '@/components/ui/button';
import { Send, LogOut, Users, Reply } from 'lucide-react';

interface PageProps {
  params: { room: string };
}

export default function ChatRoom({ params }: PageProps) {
  const roomId = params.room;
  const searchParams = useSearchParams();
  const router = useRouter();
  const userId = searchParams.get('userId') || '';
  const userName = searchParams.get('userName') || 'Anonymous';

  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [messageInput, setMessageInput] = useState('');
  const [isConnected, setIsConnected] = useState(false);
  const [users, setUsers] = useState<any[]>([]);
  const [replyingTo, setReplyingTo] = useState<ChatMessage | null>(null);

  useEffect(() => {
    if (!userId || !roomId) {
      console.log('Missing userId or roomId, redirecting home');
      router.push('/');
      return;
    }

    const decodedUserName = decodeURIComponent(userName);
    console.log('Chat page loaded - userId:', userId, 'userName:', decodedUserName, 'roomId:', roomId);

    const socket = getSocket();

    // Emit join-room event when page loads
    socket.emit('join-room', { 
      roomId, 
      userId, 
      userName: decodedUserName 
    });

    // Listen for room joined
    const handleRoomJoined = ({ users: roomUsers }: { users: any[] }) => {
      console.log('Successfully joined room:', roomId, 'users:', roomUsers);
      setIsConnected(true);
      setUsers(roomUsers || []);
    };

    // Listen for new messages
    const handleReceiveMessage = (message: ChatMessage) => {
      console.log('Message received:', message);
      // Only add message if it's from another user (not the current user)
      if (message.userId !== userId) {
        setMessages((prev) => [...prev, message]);
      }
    };

    // Listen for user joined
    const handleUserJoined = ({ userName: newUserName, totalUsers }: any) => {
      console.log('User joined:', newUserName);
      setMessages((prev) => [
        ...prev,
        {
          userId: 'system',
          userName: 'System',
          message: `${newUserName} joined the room`,
          timestamp: Date.now(),
        },
      ]);
    };

    // Listen for user left
    const handleUserLeft = ({ userName: leftUserName, totalUsers }: any) => {
      console.log('User left:', leftUserName);
      setMessages((prev) => [
        ...prev,
        {
          userId: 'system',
          userName: 'System',
          message: `${leftUserName} left the room`,
          timestamp: Date.now(),
        },
      ]);
    };

    // Listen for errors
    const handleError = ({ message: errorMsg }: { message: string }) => {
      console.error('Socket error:', errorMsg);
      alert(errorMsg);
      router.push('/');
    };

    socket.on('room-joined', handleRoomJoined);
    socket.on('receive-message', handleReceiveMessage);
    socket.on('user-joined', handleUserJoined);
    socket.on('user-left', handleUserLeft);
    socket.on('error', handleError);

    return () => {
      socket.off('room-joined', handleRoomJoined);
      socket.off('receive-message', handleReceiveMessage);
      socket.off('user-joined', handleUserJoined);
      socket.off('user-left', handleUserLeft);
      socket.off('error', handleError);
    };
  }, [userId, roomId, userName, router]);

  const handleSendMessage = () => {
    if (!messageInput.trim()) return;

    const decodedUserName = decodeURIComponent(userName);

    // Add message to local state immediately
    const messageData: ChatMessage = {
      userId,
      userName: decodedUserName,
      message: messageInput,
      timestamp: Date.now(),
      replyTo: replyingTo?.message,
      replyToUser: replyingTo?.userName,
    };

    setMessages((prev) => [...prev, messageData]);

    // Send to server with reply info
    const socket = getSocket();
    socket.emit('send-message', { 
      roomId, 
      message: messageInput, 
      userId, 
      userName: decodedUserName,
      replyTo: replyingTo?.message,
      replyToUser: replyingTo?.userName,
    });
    
    setMessageInput('');
    setReplyingTo(null);
  };

  const handleLeaveRoom = () => {
    const decodedUserName = decodeURIComponent(userName);
    leaveRoom(roomId, userId, decodedUserName);
    router.push('/');
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-purple-950 to-black flex flex-col">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-green-900/20 via-transparent to-transparent" />

      {/* Header */}
      <div className="relative z-10 bg-black/50 backdrop-blur-sm border-b border-green-500/20 p-4">
        <div className="flex justify-between items-center max-w-7xl mx-auto">
          <div>
            <h1 className="text-2xl font-bold text-green-400 capitalize">
              {roomId.replace(/-/g, ' ')}
            </h1>
            <p className="text-gray-400 text-sm">Your name: {decodeURIComponent(userName)}</p>
          </div>
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-2 bg-white/5 px-4 py-2 rounded-full">
              <Users className="w-5 h-5 text-green-400" />
              <span className="text-white font-semibold">{users.length + 1}</span>
            </div>
            <Button
              onClick={handleLeaveRoom}
              className="bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-6 rounded-full transition-all"
            >
              <LogOut className="w-4 h-4 mr-2" />
              Leave Room
            </Button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="relative z-10 flex-1 flex flex-col max-w-7xl w-full mx-auto p-6 gap-6">
        {/* Messages Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex-1 bg-white/5 backdrop-blur-sm rounded-2xl border border-green-500/20 p-6 flex flex-col"
        >
          <h2 className="text-xl font-bold text-green-400 mb-4">Messages</h2>
          
          {/* Messages List */}
          <div className="flex-1 overflow-y-auto mb-4 space-y-4 pr-2">
            {messages.length === 0 ? (
              <div className="flex items-center justify-center h-full text-gray-400">
                <p>No messages yet. Start chatting!</p>
              </div>
            ) : (
              messages.map((msg, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className={`flex ${msg.userId === userId ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-xs lg:max-w-md px-4 py-3 rounded-lg ${
                      msg.userId === 'system'
                        ? 'bg-gray-700/30 text-gray-300 text-center w-full'
                        : msg.userId === userId
                        ? 'bg-green-500/30 text-green-100 border border-green-500/50'
                        : 'bg-blue-500/30 text-blue-100 border border-blue-500/50'
                    }`}
                  >
                    {msg.userId !== 'system' && (
                      <>
                        <p className="font-semibold text-xs mb-1 opacity-75">{msg.userName}</p>
                        {msg.replyTo && (
                          <div className="text-xs opacity-60 border-l-2 pl-2 mb-2 italic">
                            Reply to {msg.replyToUser}: "{msg.replyTo}"
                          </div>
                        )}
                      </>
                    )}
                    <p className="break-words">{msg.message}</p>
                    <div className="flex justify-between items-center mt-2">
                      <p className="text-xs opacity-50">
                        {new Date(msg.timestamp).toLocaleTimeString([], {
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                      </p>
                      {msg.userId !== 'system' && (
                        <button
                          onClick={() => setReplyingTo(msg)}
                          className="text-xs opacity-60 hover:opacity-100 ml-2 flex items-center gap-1"
                          title="Reply to this message"
                        >
                          <Reply className="w-3 h-3" />
                        </button>
                      )}
                    </div>
                  </div>
                </motion.div>
              ))
            )}
          </div>

          {/* Reply Preview */}
          {replyingTo && (
            <div className="mb-3 p-3 bg-yellow-500/20 border border-yellow-500/50 rounded-lg flex justify-between items-start">
              <div className="text-sm">
                <p className="text-yellow-300 font-semibold text-xs mb-1">Replying to {replyingTo.userName}</p>
                <p className="text-yellow-100 text-xs opacity-80">{replyingTo.message}</p>
              </div>
              <button
                onClick={() => setReplyingTo(null)}
                className="text-yellow-300 hover:text-yellow-100 ml-2"
                title="Cancel reply"
              >
                ✕
              </button>
            </div>
          )}

          {/* Message Input */}
          <div className="flex gap-2">
            <input
              type="text"
              placeholder="Type your message..."
              value={messageInput}
              onChange={(e) => setMessageInput(e.target.value)}
              onKeyPress={handleKeyPress}
              className="flex-1 px-4 py-3 rounded-lg border border-green-500/30 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent bg-black/50 text-white placeholder-gray-400"
            />
            <Button
              onClick={handleSendMessage}
              className="bg-green-500 hover:bg-green-600 text-white font-bold py-3 px-6 rounded-lg transition-all"
            >
              <Send className="w-4 h-4" />
            </Button>
          </div>
        </motion.div>

        {/* Users Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white/5 backdrop-blur-sm rounded-2xl border border-green-500/20 p-6"
        >
          <h2 className="text-lg font-bold text-green-400 mb-4">Users in Room</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <div className="bg-green-500/20 border border-green-500/50 rounded-lg p-3 text-center">
              <p className="text-green-100 font-semibold">{decodeURIComponent(userName)}</p>
              <p className="text-xs text-green-300">(You)</p>
            </div>
            {users.map((user, index) => (
              <div
                key={index}
                className="bg-blue-500/20 border border-blue-500/50 rounded-lg p-3 text-center"
              >
                <p className="text-blue-100 font-semibold">{user.userName}</p>
              </div>
            ))}
          </div>
        </motion.div>
      </div>

      <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-green-500/50 to-transparent" />
    </div>
  );
}
