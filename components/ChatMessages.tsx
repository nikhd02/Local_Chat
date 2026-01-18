'use client';

import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, MessageCircle } from 'lucide-react';
import { ChatMessage } from '@/lib/socket-client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';

interface ChatMessagesProps {
  messages: ChatMessage[];
  currentUserId: string;
  onSendMessage: (message: string) => void;
  isConnected: boolean;
}

export default function ChatMessages({
  messages,
  currentUserId,
  onSendMessage,
  isConnected,
}: ChatMessagesProps) {
  const [inputMessage, setInputMessage] = useState('');
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSend = () => {
    if (inputMessage.trim() && isConnected) {
      onSendMessage(inputMessage.trim());
      setInputMessage('');
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="flex flex-col h-full bg-black/40 backdrop-blur-lg border-l border-green-500/20">
      <div className="flex items-center gap-2 p-4 border-b border-green-500/20">
        <MessageCircle className="w-5 h-5 text-green-400" />
        <h3 className="text-white font-semibold">Chat</h3>
        {!isConnected && (
          <span className="ml-auto text-xs text-red-400">Disconnected</span>
        )}
      </div>

      <ScrollArea className="flex-1 p-4" ref={scrollRef}>
        <AnimatePresence initial={false}>
          {messages.length === 0 ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex items-center justify-center h-full text-gray-500 text-sm text-center"
            >
              No messages yet. Start the conversation!
            </motion.div>
          ) : (
            <div className="space-y-3">
              {messages.map((msg, index) => {
                const isCurrentUser = msg.userId === currentUserId;
                return (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 20, scale: 0.8 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.8 }}
                    transition={{ duration: 0.2 }}
                    className={`flex ${isCurrentUser ? 'justify-end' : 'justify-start'}`}
                  >
                    <div
                      className={`max-w-[80%] rounded-2xl px-4 py-2 ${
                        isCurrentUser
                          ? 'bg-green-500 text-white'
                          : 'bg-gray-700 text-white'
                      }`}
                    >
                      <p className="text-sm break-words">{msg.message}</p>
                      <span className="text-xs opacity-70 mt-1 block">
                        {new Date(msg.timestamp).toLocaleTimeString([], {
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                      </span>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          )}
        </AnimatePresence>
      </ScrollArea>

      <div className="p-4 border-t border-green-500/20">
        <div className="flex gap-2">
          <Input
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder={isConnected ? 'Type a message...' : 'Disconnected...'}
            disabled={!isConnected}
            className="flex-1 bg-gray-800/50 border-green-500/30 text-white placeholder:text-gray-500 focus:border-green-500"
          />
          <Button
            onClick={handleSend}
            disabled={!inputMessage.trim() || !isConnected}
            className="bg-green-500 hover:bg-green-600 text-white"
            size="icon"
          >
            <Send className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}
