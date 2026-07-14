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

На будь-які інші запитання відповідай у контексті нашого сервісу оренди.
`;

const router = Router();


async function sendReplyToTawk(chatId: string, text: string): Promise<void> {
    const propertyId = process.env.TAWK_PROPERTY_ID;
    const widgetId = process.env.TAWK_WIDGET_ID; // Получаем ID виджета
    const tawkApiKey = process.env.TAWK_API_KEY;

    if (!propertyId || !widgetId || !tawkApiKey) {
        console.error('Помилка: TAWK_PROPERTY_ID, TAWK_WIDGET_ID або TAWK_API_KEY не задані в .env!');
        return;
    }

    try {
    
        const url = `https://api.tawk.to/v3/public/properties/${propertyId}/widgets/${widgetId}/chats/${chatId}/messages`;
        
        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${tawkApiKey}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                text: text,
                sender: {
                    type: 'agent',
                    name: 'AI Assistant'
                }
            })
        });

        if (!response.ok) {
            const errText = await response.text();
            throw new Error(`Tawk.to API returned status ${response.status}: ${errText}`);
        }

        console.log('Відповідь успішно надіслана в Tawk.to чат!');
    } catch (error) {
        console.error('Не вдалося відправити відповідь в Tawk.to:', error);
    }
}

router.post('/chat-bot', async (req: Request, res: Response) => {
    try {
        const payload = req.body;
        console.log('=== ЗАПИТ ПРИЙШОВ НА СЕРВЕР ===');
        console.log('Подія:', payload.event);
        console.log('Вся структура:', JSON.stringify(payload, null, 2));
        console.log('=================================');
        
        if (payload.event === 'chatMessageReceived') {
            const senderType = payload.message?.sender?.type;
            
            if (senderType === 'visitor') {
                const userText = payload.message?.text;
                const chatId = payload.chat?.id || 'test-chat-id'; 
                
                if (userText) {
                    console.log(`Користувач написав: ${userText}`);
                    
                    const response = await ai.models.generateContent({
                        model: 'gemini-3.5-flash',
                        contents: userText,
                        config: {
                            systemInstruction: SYSTEM_INSTRUCTION
                        }
                    });
                    
                    const botReply = response.text;
                    
                    if (!botReply) {
                        console.log('Помилка: Gemini повернув порожню відповідь.');
                        return res.status(200).json({ status: 'no_response_from_ai' });
                    }
                    
                    console.log(`Відповідь Gemini: ${botReply}`);
                    
                    if (chatId !== 'test-chat-id') {
                        await sendReplyToTawk(chatId, botReply);
                    } else {
                        console.log('Тестовий режим: Відправку в Tawk.to пропущено, бо chatId фейковий.');
                    }
                }
            }
        }
        
        return res.status(200).json({ status: 'processed' });
    } catch (error) {
        if (error instanceof Error) {
            console.error('Помилка ІІ-бота:', error.message);
            return res.status(500).json({ error: error.message });
        }
        return res.status(500).json({ error: 'An unknown error occurred' });
    }
});

export default router;