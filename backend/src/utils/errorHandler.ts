import { Response } from "express";

export const handleError = (error: unknown, res: Response, errorText: string): void => {
    console.error(`Помилка при ${errorText}:`, error);
    res.status(500).json({ message: `Помилка сервера при ${errorText}` });
};