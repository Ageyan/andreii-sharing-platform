import express, { Request, Response } from 'express';
import 'dotenv/config';
import { initDatabase } from '../src/models/initDB';
import authRoutes from './routes/authRoutes';
import itemRoutes from './routes/itemRoutes';
import bookingRoutes from './routes/bookingRoutes';

const app = express();
const port = process.env.PORT || 8000;

app.use(express.json());

initDatabase();

app.use('/api/auth', authRoutes);
app.use('/api/items', itemRoutes);
app.use('/api/bookings', bookingRoutes);

app.get('/', (req: Request, res: Response) => {
    res.send('Сервер RentIt успішно запущено на TypeScript!')
});

app.listen(port, () => {
    console.log(`🚀 Сервер працює на http://localhost:${port}`);
});