import { Response } from 'express';
import { AuthRequest } from '../middleware/authMiddleware';
import { query } from '../config/db';

export const getUserInfo = async(req: AuthRequest, res: Response ): Promise<void> => {
    const userId = req.user?.userId;

    try {
        const sqlQuery = 'SELECT id, name, email, phone, created_at FROM users WHERE id = $1';

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

export const putUserUpdate = async(req: AuthRequest, res: Response): Promise<void> => {
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