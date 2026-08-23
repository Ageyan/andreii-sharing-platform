import express, { Response } from 'express';
import 'dotenv/config';
import cors from 'cors';
import http from 'http';
import { Server } from 'socket.io';

import { saveMessages } from './controllers/chatController';

import { initDatabase } from './models/initDB';

import authRoutes from './routes/authRoutes';
import itemRoutes from './routes/itemRoutes';
import bookingRoutes from './routes/bookingRoutes';
import userRoutes from './routes/userRoutes';
import chatAiRoutes from './routes/chatAiRoutes';
import chatRoutes from './routes/chatRoutes';

const app = express();
const port = process.env.PORT || 8000;

app.use(express.json());

app.use(cors({
    origin: [
        'http://localhost:5173', 
        'https://andreii-sharing-platform.vercel.app' 
    ],
    credentials: true, 
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));

initDatabase();

app.use('/api/auth', authRoutes);
app.use('/api/items', itemRoutes);
app.use('/api/bookings', bookingRoutes);
app.use('/api/users', userRoutes)
app.use('/api', chatAiRoutes);
app.use('/api', chatRoutes);

const httpServer = http.createServer(app);

export const io = new Server(httpServer, {
    cors: {
        origin: ['http://localhost:5173', 'https://andreii-sharing-platform.vercel.app'],
        methods: ['GET', 'POST'],
        credentials: true 
    }
})

let onlineUsers: { userId: number, socketId: string }[] = [];

const addNewUser = (userId: number, socketId: string) => {
    const userIndex = onlineUsers.findIndex(user => user.userId === userId);

    if (userIndex !== -1) {
        onlineUsers[userIndex].socketId = socketId;
    } else {
        onlineUsers.push({ userId, socketId });
    }
}

const removeUser = (socketId: string) => {
    onlineUsers = onlineUsers.filter(user => user.socketId !== socketId)
}

io.on('connection', (socket) => { 
    console.log(`Клієнт підключився: ${socket.id}`);

    socket.on('user_connected', (userId: number) => {
        addNewUser(userId, socket.id)

        const onlineUsersIds = onlineUsers.map(user => user.userId);
        io.emit('update_online_users', onlineUsersIds)
    })

    socket.on('disconnect', () => {
        removeUser(socket.id)

        const onlineUsersIds = onlineUsers.map(user => user.userId);
        io.emit('update_online_users', onlineUsersIds)
    })

    socket.on('join_chat', (chatId) => {
        socket.join(chatId.toString());
    })

    socket.on('send_message', saveMessages);
});

app.get('/', (res: Response) => {
    res.send('Сервер RentIt успішно запущено на TypeScript!')
});

httpServer.listen(port, () => {
    console.log(`🚀 Сервер працює на http://localhost:${port}`);
})