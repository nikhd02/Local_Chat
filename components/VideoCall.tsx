'use client';

import { useEffect, useRef } from 'react';
import { ZegoUIKitPrebuilt } from '@zegocloud/zego-uikit-prebuilt';
import { getZegoConfig } from '@/lib/zegocloud-config';

interface VideoCallProps {
  roomId: string;
  userId: string;
  onLeave?: () => void;
}

export default function VideoCall({ roomId, userId, onLeave }: VideoCallProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const zegoInstanceRef = useRef<any>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    const config = getZegoConfig(roomId, userId);

    if (!config.appID || !config.serverSecret) {
      console.error('ZEGOCLOUD credentials missing');
      return;
    }

    const kitToken = ZegoUIKitPrebuilt.generateKitTokenForTest(
      config.appID,
      config.serverSecret,
      config.roomID,
      config.userID,
      config.userName
    );

    const zc = ZegoUIKitPrebuilt.create(kitToken);
    zegoInstanceRef.current = zc;

    zc.joinRoom({
      container: containerRef.current,
      scenario: {
        mode: ZegoUIKitPrebuilt.OneONoneCall,
      },
      showPreJoinView: false,
      showScreenSharingButton: true,
      showRoomTimer: true,
      turnOnCameraWhenJoining: true,
      turnOnMicrophoneWhenJoining: true,
      showMyCameraToggleButton: true,
      showMyMicrophoneToggleButton: true,
      showAudioVideoSettingsButton: true,
      showTextChat: false,
      showUserList: false,
      maxUsers: 2,
      layout: 'Auto',
      showLayoutButton: false,
      onJoinRoom: () => {
        console.log('Joined room:', roomId);
      },
      onLeaveRoom: () => {
        console.log('Left room:', roomId);
        if (onLeave) {
          onLeave();
        }
      },
    });

    return () => {
      if (zegoInstanceRef.current) {
        zegoInstanceRef.current.destroy();
        zegoInstanceRef.current = null;
      }
    };
  }, [roomId, userId, onLeave]);

  return (
    <div
      ref={containerRef}
      className="w-full h-full absolute inset-0"
      style={{
        background: 'linear-gradient(to bottom right, #000000, #1a0033)',
      }}
    />
  );
}
