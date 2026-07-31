import { io } from 'socket.io-client';

const rawUrl = import.meta.env.VITE_API_URL || 'http://localhost:8000';

const socketUrl = rawUrl.replace('/api', '');

export const socket = io(socketUrl, {
    transports: ['websocket']
});