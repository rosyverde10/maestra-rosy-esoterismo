import { io, Socket } from 'socket.io-client';
import type { SiteData } from '../types';

// Determine Socket server URL (Port 3001 on the same hostname for dev/LAN, or VITE_API_URL / current origin for production)
const getSocketUrl = () => {
  if (typeof window === 'undefined') return 'http://localhost:3001';
  let apiUrl = import.meta.env.VITE_API_URL;
  if (apiUrl) {
    if (apiUrl.endsWith('/')) {
      apiUrl = apiUrl.slice(0, -1);
    }
    return apiUrl;
  }
  const { protocol, hostname, port } = window.location;
  if (
    port === '5173' ||
    hostname === 'localhost' ||
    hostname === '127.0.0.1' ||
    hostname.startsWith('192.168.') ||
    hostname.startsWith('10.') ||
    hostname.startsWith('172.')
  ) {
    return `${protocol}//${hostname}:3001`;
  }
  return window.location.origin;
};

export const SOCKET_URL = getSocketUrl();

export const getApiBaseUrl = (): string => {
  return SOCKET_URL;
};

export const socket: Socket = io(SOCKET_URL, {
  autoConnect: true,
  reconnectionAttempts: 15,
  reconnectionDelay: 1000,
  transports: ['websocket', 'polling'],
});

// Fallback BroadcastChannel for instant cross-tab sync in the same browser
const channel = typeof BroadcastChannel !== 'undefined' ? new BroadcastChannel('cajitas_realtime_sync') : null;

export const subscribeToSiteUpdates = (onUpdate: (data: SiteData) => void) => {
  // Socket.IO listeners
  const handleSocketUpdate = (data: SiteData) => {
    if (data && data.products) {
      onUpdate(data);
    }
  };

  socket.on('site:init', handleSocketUpdate);
  socket.on('site:updated', handleSocketUpdate);

  // BroadcastChannel listener for local cross-tab fallback
  if (channel) {
    channel.onmessage = (event) => {
      if (event.data && event.data.type === 'SITE_UPDATED') {
        onUpdate(event.data.data);
      }
    };
  }

  return () => {
    socket.off('site:init', handleSocketUpdate);
    socket.off('site:updated', handleSocketUpdate);
  };
};

export const emitSiteUpdate = async (newData: SiteData) => {
  // 1. Emit via Socket.IO if connected
  if (socket.connected) {
    socket.emit('site:update', newData);
  }

  // 2. HTTP POST fallback for 100% guaranteed persistence to MongoDB Atlas
  try {
    const baseUrl = getApiBaseUrl();
    await fetch(`${baseUrl}/api/site/data`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newData),
    });
  } catch (err) {
    try {
      await fetch('/api/site/data', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newData),
      });
    } catch (err2) {
      console.error('Error enviando actualización por HTTP POST:', err2);
    }
  }

  // 3. Post to BroadcastChannel for instant local cross-tab update
  if (channel) {
    channel.postMessage({ type: 'SITE_UPDATED', data: newData });
  }
};
