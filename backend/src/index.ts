import express, { Request, Response } from 'express';
import 'dotenv/config';
import cors from 'cors';
import { initDatabase } from '../src/models/initDB';
import authRoutes from './routes/authRoutes';
import itemRoutes from './routes/itemRoutes';
import bookingRoutes from './routes/bookingRoutes';
import userRoutes from './routes/userRoutes';

const app = express();
const port = process.env.PORT || 8000;

app.use(express.json());

app.use(cors({
    origin: 'http://localhost:5173', 
    credentials: true
}));

initDatabase();

app.use('/api/auth', authRoutes);
app.use('/api/items', itemRoutes);
app.use('/api/bookings', bookingRoutes);
app.use('/api/users', userRoutes)

app.get('/', (req: Request, res: Response) => {
    res.send('Сервер RentIt успішно запущено на TypeScript!')
});

app.listen(port, () => {
    console.log(`🚀 Сервер працює на http://localhost:${port}`);
});