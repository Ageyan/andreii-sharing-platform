import { Request, Response } from "express";
import { query } from "../config/db";

export const getOrCreateChat = async (req: Request, res: Response): Promise<void> => {
    const { item_id, owner_id } = req.body;
    const renter_id = req.user?.userId;

    try {
        const checkQuery = `
            SELECT * FROM chats
            WHERE item_id = $1 AND renter_id = $2
        `

        const checkChat = await query(checkQuery, [item_id, renter_id]);

        if (checkChat.rows.length > 0) {
            res.status(200).json(checkChat.rows[0]);
            return;
        }

        const sqlQuery = `
            INSERT INTO chats (item_id, renter_id, owner_id)
            VALUES ($1, $2, $3)
            RETURNING *
        `

        const result = await query(sqlQuery, [item_id, renter_id, owner_id])

        res.status(201).json(result.rows[0])        
    } catch (error) {
        console.error('Помилка при створенні чату', error);
        res.status(500).json({message: 'Помилка сервера при створенні чату'});
    }
}

export const getUserChats = async (req: Request, res: Response): Promise<void> => {
    const userId = req.user?.userId;

    try {
        const sqlQuery = `
            SELECT 
                c.id AS chat_id,
                c.item_id,
                c.renter_id,
                c.owner_id,
                c.created_at,
                i.title AS item_title,
                i.image_url AS item_image
            FROM chats c
            JOIN items i ON c.item_id = i.id
            WHERE c.renter_id = $1 OR c.owner_id = $1
            ORDER BY c.created_at DESC;
        `

        const result = await query(sqlQuery, [userId]);

        res.status(200).json(result.rows);
    } catch (error) {
        console.error('Помилка при отриманні чатів', error);
        res.status(500).json({message: 'Помилка сервера при отриманні чатів'});
    }
}

export const getChatMessages = async (req: Request, res: Response): Promise<void> => {
    const { id } = req.params;
    const userId = req.user?.userId;

    try {
        const checkQuery = `SELECT * FROM chats WHERE id = $1`

        const checkChat = await query(checkQuery, [id])

        if (checkChat.rows.length === 0) {
            res.status(400).json({ message: 'Чат не знайдено, повідомлення не знайдені' })
            return;
        }

        const chat = checkChat.rows[0];

        if (userId !== chat.renter_id && userId !== chat.owner_id) { 
            res.status(403).json({ message: 'У вас немає доступу до цього чату' })
            return;
        }

        const sqlQuery = `SELECT * FROM messages WHERE chat_id = $1 ORDER BY created_at ASC`

        const result = await query(sqlQuery, [id])

        res.status(200).json(result.rows)
    } catch (error) {
        console.error('Помилка при отриманні повідомлень', error);
        res.status(500).json({message: 'Помилка сервера при отриманні повідомлень'});
    }
}