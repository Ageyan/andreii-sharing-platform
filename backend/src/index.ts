import express, { Request, Response } from 'express';
import 'dotenv/config';
import cors from 'cors';
import { initDatabase } from './models/initDB';
import authRoutes from './routes/authRoutes';
import itemRoutes from './routes/itemRoutes';
import bookingRoutes from './routes/bookingRoutes';
import userRoutes from './routes/userRoutes';
import chatRouter from './routes/chatRoutes';

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
app.use('/api', chatRouter);

app.get('/', (req: Request, res: Response) => {
    res.send('Сервер RentIt успішно запущено на TypeScript!')
});

app.listen(port, () => {
    console.log(`🚀 Сервер працює на http://localhost:${port}`);
});