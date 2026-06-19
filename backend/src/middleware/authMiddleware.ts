import { Request, Response, NextFunction } from "express";
import jwt from 'jsonwebtoken';

export interface AuthRequest extends Request {
    user?: {userId: number}
}

export const protect = async(req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
    let token;

    if(req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        try {
            token = req.headers.authorization.split(' ')[1];

            const decoded = jwt.verify(token, process.env.JWT_SECRET as string);

            req.user = decoded as {userId: number};
            
            next();
        } catch(error) {
            res.status(401).json({ message: 'Авторизацію відхилено, токен невалідний' });
            return;
        }
    }
    
    if(!token) {
        res.status(401).json({
            message: 'Користувача не авторизовано, токен відсутній'
        });
        return;
    }
};