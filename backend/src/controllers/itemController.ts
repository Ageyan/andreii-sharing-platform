import { Request, Response } from 'express';
import { query } from '../config/db';
import { handleError } from '../utils/errorHandler';

export const createItem = async(req: Request, res: Response): Promise<void> => {
    const { title, description, price_per_day, category } = req.body;
    const owner_id = req.user?.userId;
    const files = req.files as Express.Multer.File[];
    const image_url = files ? files.map(file => file.path) : [];

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
            image_url,
            owner_id
        ]);

        res.status(201).json({
            message: 'Річ успішно додано для оренди!',
            item: result.rows[0]
        });
    } catch(error) {
        handleError(error, res, 'додаванні речі')
    }
};

export const updateItem = async(req: Request, res: Response): Promise<void> => {
    const { title, description, price_per_day, category } = req.body;
    const files = req.files as Express.Multer.File[];
    const image_url = files ? files.map(file => file.path) : [];
    const id  = Number(req.params.id);
    const owner_id = req.user?.userId;

    try {
        const sqlQuery = `
            UPDATE items SET title = $1, description = $2, price_per_day = $3, category = $4, image_url = $5
            WHERE id = $6 AND owner_id = $7
            RETURNING id, title, description, price_per_day, category, image_url
        `

        const result = await query(sqlQuery, [title, description, price_per_day, category, image_url, id, owner_id])

        res.status(200).json(result.rows[0]);
    } catch (error) {
        handleError(error, res, 'редагуванні речі')
    }
}

export const getItems = async (req: Request, res: Response): Promise<void> => {
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 20;
    const search = req.query.search as string | undefined;
    const category = req.query.category as string | undefined;
    const sort = req.query.sort as string | undefined;

    const offset = (page - 1) * limit;

    try {
        let baseQuery = 'FROM items WHERE 1=1';
        const values : any[] = [];
        let paramIndex = 1;

        if (category && category != 'Усі речі') {
            values.push(category);
            baseQuery += ` AND category = $${paramIndex}`;
            paramIndex++;
        }

        if (search) {
            values.push(`%${search}%`);
            baseQuery += ` AND title ILIKE $${paramIndex}`;
            paramIndex++;
        }

        const sqlCount = `SELECT COUNT(*) ${baseQuery}`;
        const countResult = await query(sqlCount, values);
        const totalCount = parseInt(countResult.rows[0].count, 10);

        let orderQuery = '';
        switch (sort) {
            case 'newest':
                orderQuery = ' ORDER BY created_at DESC';
                break;
            case 'oldest':
                orderQuery = ' ORDER BY created_at ASC'; 
                break;
            case 'price-desc':
                orderQuery = ' ORDER BY price_per_day DESC'; 
                break;
            case 'price-asc': 
                orderQuery = ' ORDER BY price_per_day ASC'; 
                break;
            default: 
                orderQuery = ' ORDER BY created_at DESC';
                break;
        }

        const mainValues = [...values];

        mainValues.push(limit);
        const limitIndex = paramIndex;
        paramIndex++;

        mainValues.push(offset);
        const offsetIndex = paramIndex;

        const sqlQuery = `
            SELECT * ${baseQuery}
            ${orderQuery}
            LIMIT $${limitIndex}
            OFFSET $${offsetIndex}
        `;

        const result = await query(sqlQuery, mainValues);

        const hasMore = totalCount > limit * page;
        res.status(200).json({
            data: result.rows,
            hasMore: hasMore 
        });
    } catch(error) {
        handleError(error, res, 'при отриманні речей');
    }
}

export const getItemById = async(req: Request, res: Response): Promise<void> => {
    const { id } = req.params;

    try{
        const sqlQuery = `
            SELECT i.*, u.name AS owner_name, u.created_at AS owner_created_at, u.avatar_url AS owner_avatar
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
        handleError(error, res, 'отриманні речі за id')
    }
};

export const deleteItemById = async(req: Request, res: Response): Promise<void> => {
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
        handleError(error, res, 'видаленні речі')
    }
};

export const getMyItems = async(req: Request, res: Response): Promise<void> => {
    const owner_id = req?.user?.userId

    try {
        const sqlQuery = 'SELECT * FROM items WHERE owner_id = $1'

        const result = await query(sqlQuery, [owner_id])

        res.status(200).json(result.rows);
    } catch (error) {
        handleError(error, res, 'отриманні власних речей')
    }
};