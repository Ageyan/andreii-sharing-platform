import { Request, Response } from 'express';
import { query } from '../config/db';

export const getUserInfo = async(req: Request, res: Response ): Promise<void> => {
    const userId = req.user?.userId;

    try {
        const sqlQuery = 'SELECT id, name, email, phone, created_at, avatar_url FROM users WHERE id = $1';

        const result = await query(sqlQuery, [userId])

        if(result.rows.length === 0) {
            res.status(404).json({message: 'Користувача не знайдено'});
            return;
        }

        res.status(200).json(result.rows[0]);
    } catch(error) {
        console.error('Помилка при отриманні даних про користувача', error);
        res.status(500).json({message: 'Помилка сервера при отриманні даних про користувача'});
    }
};

export const putUserUpdate = async(req: Request, res: Response): Promise<void> => {
    const userId = req.user?.userId;
    const { name, phone } = req.body;

    try {
        const sqlQuerry = `
            UPDATE users SET name = $1, phone = $2 WHERE id = $3
            RETURNING id, name, email, phone, created_at
        `

        const result = await query(sqlQuerry, 
            [
                name, 
                phone,
                userId
            ]
        )

        res.status(200).json(result.rows[0]);
    } catch(error) {
        console.error('Помилка при зміні даних про користувача', error);
        res.status(500).json({message: 'Помилка сервера при зміні даних про користувача'});
    }
};

export const updateAvatar = async (req: Request, res: Response): Promise<void> => {
    const userId = req.user?.userId;
    const file = req.file?.path;

    if (!file) {
        res.status(400).json({ message: 'Файл зображення не знайдено' });
        return;
    }

    try {
        const sqlQuery = `
            UPDATE users SET avatar_url = $1 WHERE id = $2
            RETURNING avatar_url
        `

        const result = await query(sqlQuery, [file, userId])

        res.status(200).json(result.rows[0]);
    } catch (error) {
        console.error('Помилка при зміні аватара', error)
        res.status(500).json({message: 'Помилка сервера при зміні аватара'})
    }
}