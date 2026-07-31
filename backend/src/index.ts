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
import { query } from './config/db';

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

io.on('connection', (socket) => {
    socket.on('join_chat', (chatId) => {
        socket.join(chatId.toString());
    })

    socket.on('send_message', async(data) => {
        const { chat_id, sender_id, text } = data;

        try {
            const sqlQuerry = `
                INSERT INTO messages (chat_id, sender_id, text)
                VALUES ($1, $2, $3)
                RETURNING *
            `

            const result = await query(sqlQuerry, [chat_id, sender_id, text])

            io.to(data.chat_id.toString()).emit('receive_message', result.rows[0]);
        } catch (error) {
            console.error('Помилка при отриманні чатів', error);
            io.to(data.chat_id.toString()).emit('error', error);
        }
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