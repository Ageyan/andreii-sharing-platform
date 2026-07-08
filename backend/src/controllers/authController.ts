import { Request, Response } from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { query } from '../config/db';

export const register = async(req: Request, res: Response): Promise<void> => {
    const { name,phone, email, password } = req.body;
        
    try {
        const userExist = await query('SELECT * FROM users WHERE email = $1', [email]);

        if(userExist.rows.length > 0) {
            res.status(400).json({ message: 'Користувач з таким email вже зареєстрований'});
            return;
        }

        const salt = await bcrypt.genSalt(10);
        const passwordHash = await bcrypt.hash(password, salt);

        const newUserQuery = `
            INSERT INTO users (name, phone, email, password_hash )
            VALUES ($1, $2, $3, $4)
            RETURNING id, name, email, phone;
        `;

        const newUser = await query(newUserQuery, [name, phone, email, passwordHash ]);

        res.status(201).json({
            message: 'Користувач успішно зареєстрований',
            user: newUser.rows[0]
        });
        
    } catch(error) {
        console.error('помилка при реєстрації:', error);
        res.status(500).json({ message: 'Помилка сервера при реєстрації'});
    }
};

export const login = async(req: Request, res: Response): Promise<void> => {
    const { email, password } = req.body;

    try {
        const sqlQuery = 'SELECT * FROM users WHERE email = $1';

        const result = await query(sqlQuery, [email]);
        const user = result.rows[0];

        if (!user) {
            res.status(400).json({message: 'Не правильний email або password'});
            return;
        }

        const isMatch = await bcrypt.compare(password, user.password_hash);
        if (!isMatch) {
            res.status(400).json({message: 'Не правильний email або password'});
            return;
        }

        const token = jwt.sign(
            { userId: user.id }, 
            process.env.JWT_SECRET as string, 
            { expiresIn: '1d' }
        );

        res.status(200).json({
            token,
            user: {id: user.id, name: user.name, email: user.email}
        });
    } catch(error) {
        console.error('Помилка при вході:', error);
        res.status(500).json({ message: 'Помилка серверу при вході' });
    }
};