import express, { Request, Response } from 'express';
import 'dotenv/config';
import { initDatabase } from '../src/models/initDB';

const app = express();
const port = process.env.PORT || 5000;

app.use(express.json());

initDatabase();

app.get('/', (req: Request, res: Response) => {
    res.send('Сервер RentIt успішно запущено на TypeScript!')
});

app.listen(port, () => {
    console.log(`🚀 Сервер працює на http://localhost:${port}`);
})