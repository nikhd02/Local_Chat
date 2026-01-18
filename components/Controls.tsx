'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Mic,
  MicOff,
  Video,
  VideoOff,
  SkipForward,
  Phone,
  MessageSquare,
} from 'lucide-react';
import { Button } from '@/components/ui/button';

interface ControlsProps {
  onSkip: () => void;
  onToggleMic: (enabled: boolean) => void;
  onToggleVideo: (enabled: boolean) => void;
  onToggleChat: () => void;
  onEndCall: () => void;
  isChatOpen: boolean;
}

export default function Controls({
  onSkip,
  onToggleMic,
  onToggleVideo,
  onToggleChat,
  onEndCall,
  isChatOpen,
}: ControlsProps) {
  const [isMicEnabled, setIsMicEnabled] = useState(true);
  const [isVideoEnabled, setIsVideoEnabled] = useState(true);

  const handleMicToggle = () => {
    const newState = !isMicEnabled;
    setIsMicEnabled(newState);
    onToggleMic(newState);
  };

  const handleVideoToggle = () => {
    const newState = !isVideoEnabled;
    setIsVideoEnabled(newState);
    onToggleVideo(newState);
  };

  const controls = [
    {
      icon: isMicEnabled ? Mic : MicOff,
      label: isMicEnabled ? 'Mute' : 'Unmute',
      onClick: handleMicToggle,
      active: isMicEnabled,
      color: 'green',
    },
    {
      icon: isVideoEnabled ? Video : VideoOff,
      label: isVideoEnabled ? 'Stop Video' : 'Start Video',
      onClick: handleVideoToggle,
      active: isVideoEnabled,
      color: 'green',
    },
    {
      icon: MessageSquare,
      label: 'Chat',
      onClick: onToggleChat,
      active: isChatOpen,
      color: 'blue',
    },
    {
      icon: SkipForward,
      label: 'Next',
      onClick: onSkip,
      active: false,
      color: 'yellow',
    },
    {
      icon: Phone,
      label: 'End Call',
      onClick: onEndCall,
      active: false,
      color: 'red',
    },
  ];

  return (
    <motion.div
      initial={{ y: 100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ delay: 0.3 }}
      className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-50"
    >
      <div className="flex items-center gap-3 bg-black/80 backdrop-blur-xl rounded-full px-6 py-4 border border-green-500/30 shadow-2xl">
        {controls.map((control, index) => {
          const Icon = control.icon;
          const colorClasses = {
            green: control.active
              ? 'bg-green-500 hover:bg-green-600 text-white'
              : 'bg-gray-700 hover:bg-gray-600 text-gray-300',
            blue: control.active
              ? 'bg-blue-500 hover:bg-blue-600 text-white'
              : 'bg-gray-700 hover:bg-gray-600 text-gray-300',
            yellow: 'bg-yellow-500 hover:bg-yellow-600 text-white',
            red: 'bg-red-500 hover:bg-red-600 text-white',
          };

          return (
            <motion.div
              key={index}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
            >
              <Button
                onClick={control.onClick}
                className={`${
                  colorClasses[control.color as keyof typeof colorClasses]
                } rounded-full w-12 h-12 p-0 transition-all duration-200`}
                title={control.label}
              >
                <Icon className="w-5 h-5" />
              </Button>
            </motion.div>
          );
        })}
      </div>

      <div className="absolute -bottom-12 left-1/2 transform -translate-x-1/2 text-center">
        <p className="text-xs text-gray-400">
          Press Next to find someone new
        </p>
      </div>
    </motion.div>
  );
}
