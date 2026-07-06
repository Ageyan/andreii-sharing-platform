import { Request, Response } from 'express';
import { AuthRequest } from '../middleware/authMiddleware';
import { query } from '../config/db';

export const createItem = async(req: AuthRequest, res: Response): Promise<void> => {
    const { title, description, price_per_day, category } = req.body;
    const owner_id = req.user?.userId;
    const files = req.files as Express.Multer.File[];
    const imageUrls = files ? files.map(file => file.path) : [];

    try {
        const sqlQuery = `
            INSERT INTO items (title, description, price_per_day, category, image_url, owner_id)
            VALUES ($1, $2, $3, $4, $5, $6)
            RETURNING *
        `

        const result = await query(sqlQuery, [
            title,
            description,
            price_per_day,
            category,
            imageUrls,
            owner_id
        ]);

        res.status(201).json({
            message: 'Річ успішно додано для оренди!',
            item: result.rows[0]
        });
    } catch(error) {
        console.error('Помилка при додаванні речі', error)
        res.status(500).json({message: 'Помилка сервера при додаванні речі'})
    }
};

export const getItems = async(req: Request, res: Response): Promise<void> => {
    try {
        const sqlQuery = 'SELECT * FROM items';

        const result = await query(sqlQuery);

        res.status(200).json(result.rows);
    } catch(error) {
        console.error('Помилка при отриманні речей', error);
        res.status(500).json({message: 'Помилка сервера при отриманні речей'});
    }
}

export const getItemById = async(req: Request, res: Response): Promise<void> => {
    const { id } = req.params;

    try{
        const sqlQuery = `
            SELECT i.*, u.name AS owner_name, u.created_at AS owner_created_at
            FROM items i
            INNER JOIN users u ON i.owner_id = u.id
            WHERE i.id = $1;
        `;

        const result = await query(sqlQuery, [id]);

        if(result.rows.length === 0) {
            res.status(404).json({message: 'Річ не знайдено'});
            return;
        }

        res.status(200).json(result.rows[0]);
    } catch(error) {
        console.error('Помилка при отриманні данної речі', error);
        res.status(500).json({message: 'Помилка сервера при отриманні данної речі'});
    }
};

export const deleteItemById = async(req: AuthRequest, res: Response): Promise<void> => {
    const { id } = req.params;
    const owner_id = req?.user?.userId;

    try {
        const sqlQuery = 'DELETE FROM items WHERE id = $1 AND owner_id = $2 RETURNING *'

        const result = await query(sqlQuery, [id, owner_id])

        if(result.rows.length === 0) {
            res.status(404).json({message: 'Річ не знайдено або у вас немає прав для її видалення'});
            return;
        }

        res.status(200).json({ message: 'Річ успішно видалено'});
    } catch (error) {
        console.error('Помилка при видаленні речі', error);
        res.status(500).json({message: 'Помилка сервера при видаленні речі'});
    }
};

export const getMyItems = async(req: AuthRequest, res: Response): Promise<void> => {
    const owner_id = req?.user?.userId

    try {
        const sqlQuery = 'SELECT * FROM items WHERE owner_id = $1'

        const result = await query(sqlQuery, [owner_id])

        res.status(200).json(result.rows);
    } catch (error) {
        console.error('Помилка при отриманні власних речей', error);
        res.status(500).json({message: 'Помилка сервера при отриманні власних речей'});
    }
};