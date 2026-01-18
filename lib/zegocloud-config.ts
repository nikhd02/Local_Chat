export const ZEGOCLOUD_CONFIG = {
  appID: parseInt(process.env.NEXT_PUBLIC_ZEGOCLOUD_APP_ID || '0'),
  serverSecret: process.env.NEXT_PUBLIC_ZEGOCLOUD_SERVER_SECRET || '',
};

export const getZegoConfig = (roomId: string, userId: string) => {
  return {
    appID: ZEGOCLOUD_CONFIG.appID,
    serverSecret: ZEGOCLOUD_CONFIG.serverSecret,
    roomID: roomId,
    userID: userId,
    userName: `User_${userId.slice(0, 6)}`,
  };
};
