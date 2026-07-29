import express, { Request, Response } from 'express';
import 'dotenv/config';
import cors from 'cors';
import http from 'http';
import { Server } from 'socket.io';
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

const io = new Server(httpServer, {
    cors: {
        origin: ['http://localhost:5173', 'https://andreii-sharing-platform.vercel.app'],
        methods: ['GET', 'POST']
    }
})

io.on('connection', (socket) => {
    console.log(`🟢 Користувач підключився: ${socket.id}`)

    socket.on('disconnect', () => {
        console.log(`🔴 Користувач відключився: ${socket.id}`);
    })
});

app.get('/', (req: Request, res: Response) => {
    res.send('Сервер RentIt успішно запущено на TypeScript!')
});

// app.listen(port, () => {
//     console.log(`🚀 Сервер працює на http://localhost:${port}`);
// });

httpServer.listen(port, () => {
    console.log(`🚀 Сервер працює на http://localhost:${port}`);
})