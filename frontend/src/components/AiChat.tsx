import { useState } from 'react';
import { CiLocationArrow1 } from 'react-icons/ci';

interface Message {
    sender: 'user' | 'ai';
    text: string;
}

const AiChat = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState<Message[]>([
        { sender: 'ai', text: 'Привіт! Я штучний інтелект Sharing Platform. Чим можу допомогти?' },
    ]);
    const [input, setInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const sendMessage = async () => {
        if (!input.trim()) return;

        const userText = input;
        setMessages(prev => [...prev, { sender: 'user', text: userText }]);
        setInput('');
        setIsLoading(true);

        try {
            const res = await fetch(`${import.meta.env.VITE_API_URL}/chat-bot`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ prompt: userText }),
            });

            const data = await res.json();

            if (res.ok) {
                setMessages(prev => [...prev, { sender: 'ai', text: data.reply }]);
            } else {
                setMessages(prev => [...prev, { sender: 'ai', text: 'Упс, сталася помилка...' }]);
            }
        } catch (error) {
            setMessages(prev => [...prev, { sender: 'ai', text: "Втрачено зв'язок із сервером." }]);
            console.error('Помилка чату:', error);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="ai-chat">
            {isOpen && (
                <div className="ai-chat__window">
                    <div className="ai-chat__header">
                        <span>AI Асистент</span>
                        <button className="ai-chat__header--btn" onClick={() => setIsOpen(false)}>
                            ✕
                        </button>
                    </div>
                    <div className="ai-chat__messages">
                        {messages.map((msg, idx) => (
                            <div key={idx} className={`ai-chat__message ${msg.sender}`}>
                                {msg.text}
                            </div>
                        ))}
                        {isLoading && <div className="ai-chat__message ai">Друкує...</div>}
                    </div>
                    <div className="ai-chat__input-container">
                        <input
                            type="text"
                            value={input}
                            className="ai-chat__input"
                            onChange={e => setInput(e.target.value)}
                            onKeyDown={e => e.key === 'Enter' && sendMessage()}
                            placeholder="Напишіть повідомлення..."
                        />
                        <button
                            className="ai-chat__input-btn"
                            onClick={sendMessage}
                            disabled={isLoading}
                        >
                            <CiLocationArrow1 className="ai-chat__input-btn--icon" />
                        </button>
                    </div>
                </div>
            )}

            {!isOpen && (
                <button className="ai-chat__toggle" onClick={() => setIsOpen(true)}>
                    <img
                        className="ai-chat__toggle--img"
                        src="/pwa-192x192.png"
                        alt="AI Асистент"
                    />
                </button>
            )}
        </div>
    );
};

export default AiChat;
