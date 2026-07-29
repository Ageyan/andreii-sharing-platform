import { GoogleGenAI } from '@google/genai';
import { Request, Response, Router } from 'express';

const ai = new GoogleGenAI({
    apiKey: process.env.GEMINI_API_KEY
});

const SYSTEM_INSTRUCTION = `
    Ти — розумний ІІ-асистент платформи "Sharing Platform" (сервіс оренди речей).
    Твоє завдання — допомагати користувачам сайту.
    Спілкуйся виключно ввічливо, коротко та українською мовою.

    Головні правила платформи:
    1. Як орендувати річ: Перейти на картку цієї речі в каталозі та натиснути кнопку "Орендувати зараз".
    2. Як здати свою річ в оренду: Зайти в "Особистий кабінет" у вкладку "Речі" та натиснути кнопку "Додати нову річ".
    3. Скасування бронювання: Безкоштовно за 24 години до початку оренди в Особистому кабінеті.
    4. Валюта: Усі розрахунки відбуваються в гривнях (грн).
    5. Хто такий Андрій Агеєнко?: Це засновник цієї платформи. 

    На будь-які інші запитання відповідай у контексті нашого сервісу оренди.
`;

const router = Router();

router.post('/chat-bot', async (req: Request, res: Response) => {
    try {
        const { prompt } = req.body;
        
        if (!prompt) {
            return res.status(400).json({ error: 'Порожній запит' });
        }

        const response = await ai.models.generateContent({
            model: 'gemini-3.5-flash-lite', 
            contents: prompt,
            config: {
                systemInstruction: SYSTEM_INSTRUCTION
            }
        });
        
        const botReply = response.text;
        
        return res.status(200).json({ reply: botReply });
    } catch (error) {
        console.error('Помилка ІІ:', error);
        return res.status(500).json({ error: 'Помилка сервера' });
    }
});

export default router;