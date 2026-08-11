import { useEffect, useRef, useState } from 'react';
import { CiLocationArrow1 } from 'react-icons/ci';
import { useOutsideClick } from '../hooks/useOutsideClick';

interface Message {
    sender: 'user' | 'ai';
    text: string;
}

const AiChat = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState<Message[]>([
        { sender: 'ai', text: 'Привіт! Я штучний інтелект Sharing Platform. Чим можу допомогти?' },
    ]);
    const [input, setInput] = useState<string>('');
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [isCollapsed, setIsCollapsed] = useState<boolean>(false);
    const [isTooltip, setIsTooltip] = useState<boolean>(true);

    const windowRef = useRef<HTMLDivElement | null>(null);
    useOutsideClick(windowRef, () => setIsOpen(false));

    const touchStartX = useRef<number | null>(null);
    const touchEndX = useRef<number | null>(null);
    const isSwiping = useRef(false);
    const isDragging = useRef(false);

    const handleDragStart = (clientX: number) => {
        isSwiping.current = false;
        touchEndX.current = null;
        touchStartX.current = clientX;
    };

    const handleDragMove = (clientX: number) => {
        touchEndX.current = clientX;

        if (touchStartX.current !== null) {
            const distance = Math.abs(touchStartX.current - clientX);
            if (distance > 5) {
                isSwiping.current = true;
            }
        }
    };

    const handleDragEnd = () => {
        if (touchStartX.current === null || touchEndX.current === null) return;

        const distance = touchStartX.current - touchEndX.current;
        const minSwipeDistance = 30;

        if (distance < -minSwipeDistance && !isCollapsed) {
            setIsCollapsed(true);
        }

        if (distance > minSwipeDistance && isCollapsed) {
            setIsCollapsed(false);
        }

        touchStartX.current = null;
        touchEndX.current = null;
    };

    const handlePointerDown = (e: React.PointerEvent) => {
        isDragging.current = true;
        handleDragStart(e.clientX);
    };

    const handlePointerMove = (e: React.PointerEvent) => {
        if (isDragging.current) handleDragMove(e.clientX);
    };

    const handlePointerUpOrLeave = () => {
        if (isDragging.current) {
            isDragging.current = false;
            handleDragEnd();
        }
    };

    const handleClick = (e: React.MouseEvent) => {
        if (isSwiping.current) {
            e.preventDefault();
            return;
        }
        if (isCollapsed) setIsCollapsed(false);
        else setIsOpen(true);
    };

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

    useEffect(() => {
        const timer = setTimeout(() => {
            setIsTooltip(false);
        }, 4000);

        return () => {
            clearTimeout(timer);
        };
    }, []);

    return (
        <div className="ai-chat">
            <div className={`ai-chat__window ${isOpen ? 'show' : ''}`} ref={windowRef}>
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

            {!isOpen && (
                <>
                    <div className={`ai-chat__tool-tip ${isTooltip ? 'show' : ''}`}>
                        <p>Якщо я заважаю, свайпніть мене вправо</p>
                    </div>
                    <button
                        className={`ai-chat__toggle ${isCollapsed ? 'ai-chat__toggle--collapsed' : ''}`}
                        onClick={handleClick}
                        onPointerDown={handlePointerDown}
                        onPointerMove={handlePointerMove}
                        onPointerUp={handlePointerUpOrLeave}
                        onPointerLeave={handlePointerUpOrLeave}
                        onPointerCancel={handlePointerUpOrLeave}
                    >
                        <img
                            className="ai-chat__toggle--img"
                            src="/pwa-192x192.png"
                            alt="AI Асистент"
                            draggable="false"
                        />
                    </button>
                </>
            )}
        </div>
    );
};

export default AiChat;
