import { Response } from "express";
import { AuthRequest } from "../middleware/authMiddleware";
import { query } from "../config/db";

export const createBooking = async(req: AuthRequest, res: Response): Promise<void> => {
    const { item_id, start_date, end_date, total_price } = req.body;
    const renter_id = req.user?.userId;

    try {
        const checkQuery = `
            SELECT id FROM bookings
            WHERE item_id = $1 AND renter_id = $2 AND status IN ('pending', 'confirmed')
        `

        const checkBooking = await query(checkQuery, [item_id, renter_id])

        if (checkBooking.rows.length > 0) {
            res.status(409).json({ message: 'Ви вже маєте активний запит на оренду цієї речі' });
            return;
        }

        const sqlQuery = `
            INSERT INTO bookings (item_id, start_date, end_date, renter_id, total_price)
            VALUES ($1, $2, $3, $4, $5)
            RETURNING *
        `

        const result = await query(sqlQuery, [
            item_id,
            start_date,
            end_date,
            renter_id,
            total_price
        ])

        res.status(201).json({
            message: 'Річ успішно орендовано',
            booking: result.rows[0]
        })
    } catch(error) {
        console.error('Помилка при спробі бронювання', error);
        res.status(500).json({message: 'Помилка сервера при спробі бронювання'})
    }
};

export const getMyBookings = async(req: AuthRequest, res: Response): Promise<void> => {
    const renter_id = req.user?.userId;

    try {
        const sqlQuery = `
            SELECT b.*, i.title, i.category, i.image_url 
            FROM bookings b
            INNER JOIN items i ON b.item_id = i.id
            WHERE b.renter_id = $1
        `;

        const result = await query(sqlQuery, [renter_id]);

        res.status(200).json(result.rows);
    } catch(error) {
        console.error('Помилка при отриманні орендованих речей', error);
        res.status(500).json({message: 'Помилка сервера при отриманні орендованих речей'});
    }
};

export const getOwnerBookings = async(req: AuthRequest, res: Response): Promise<void> => {
    const owner_id = req.user?.userId;

    try {
        const sqlQuery = `
            SELECT b.*, i.title, i.category, i.image_url 
            FROM bookings b
            INNER JOIN items i ON b.item_id = i.id
            WHERE i.owner_id = $1
        `;

        const result = await query(sqlQuery, [owner_id]);

        res.status(200).json(result.rows);
    } catch(error) {
        console.error('Помилка при отриманні речей які орендували', error);
        res.status(500).json({message: 'Помилка сервера при отриманні речей які орендували'}); 
    }
};

export const updateBookingStatus = async(req: AuthRequest, res: Response): Promise<void> => {
    const { status } = req.body;
    const bookingId = req.params.id;
    const userId = req.user?.userId;

    try {
        const checkQuery = `
            SELECT i.owner_id 
            FROM bookings b
            INNER JOIN items i ON b.item_id = i.id
            WHERE b.id = $1
        `;
        const checkResult = await query(checkQuery, [bookingId]);

        if (checkResult.rows.length === 0) {
            res.status(404).json({ message: 'Бронювання не знайдено' });
            return;
        }

        const ownerId = checkResult.rows[0].owner_id;
        
        if (ownerId !== userId) {
            res.status(403).json({ message: 'У вас немає прав для керування цим бронюванням' });
            return;
        }

        const sqlQuery = "UPDATE bookings SET status = $1 WHERE id = $2 RETURNING id, status"

        const result = await query(sqlQuery, [status, bookingId])

        res.status(200).json(result.rows[0])
    } catch(error) {
        console.error('Помилка при зміні стастусу оренди', error);
        res.status(500).json({message: 'Помилка сервера при зміні статусу оренди'});
    }
};

export const cancelBooking = async (req: AuthRequest, res: Response): Promise<void> => {
    const renter_id = req.user?.userId;
    const id = req.params.id

    try {
        const sqlQuery = `
            UPDATE bookings SET status = 'cancelled_by_renter'
            WHERE id = $1 AND renter_id = $2
            RETURNING id, status
        `
        
        const result = await query(sqlQuery, [id, renter_id]);

        if (result.rows.length === 0) {
            res.status(404).json({ message: 'Бронювання не знайдено, або ви не маєте прав для зміни статусу' });
            return;
        }

        res.status(200).json(result.rows[0]);
    } catch (error) {
        console.error('Помилка при спробі відмінити бронювання', error);
        res.status(500).json({ message: 'Помилка сервера при спробі відмінити бронювання' });
    }
};
