import { useEffect, useState } from 'react';
import type { GetUserChatsProps, GetUserMessage } from '../types/chat.types';
import { getUserChats, getUserMessages } from '../services/chat';
import { useLocation } from 'react-router-dom';
import Loader from './Loader';
import axios from 'axios';
import { useUserInfo } from '../context/UserContext';
import { socket } from '../services/socket';
import Toast from './Toast';
import type { ToastState } from '../types/toast.types';
import { useRef } from 'react';
import { formatTime } from '../utils/date.utils';

const DashChats = () => {
    const [chats, setChats] = useState<GetUserChatsProps[]>([]);
    const [activeChat, setActiveChat] = useState<number | null>(null);
    const [messages, setMessages] = useState<GetUserMessage[]>([]);
    const [error, setError] = useState<string>('');
    const [isChatsLoading, setIsChatsLoading] = useState<boolean>(false);
    const [isMessagesLoading, setIsMessagesLoading] = useState<boolean>(false);
    const [newMessage, setNewMessage] = useState<string>('');
    const [toast, setToast] = useState<ToastState>({ show: false, message: '', type: 'success' });

    const { user } = useUserInfo();
    const location = useLocation();
    const messagesRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const controller = new AbortController();

        const getChats = async () => {
            setIsChatsLoading(true);
            setError('');
            try {
                const activeChatState = location.state?.activeChatId || null;
                const chatsData = await getUserChats({ signal: controller.signal });
                setChats(chatsData);
                setActiveChat(activeChatState);
            } catch (err) {
                if (axios.isCancel(err)) {
                    return;
                }

                if (axios.isAxiosError(err)) {
                    const message =
                        err.response?.data.message || 'Помилка при отриманні списку чатів';
                    setError(message);
                } else {
                    setError('Сталася непередбачувана помилка');
                    console.error('Невідома помилка:', err);
                }
            } finally {
                if (!controller.signal.aborted) {
                    setIsChatsLoading(false);
                }
            }
        };
        getChats();

        return () => controller.abort();
    }, [location]);

    useEffect(() => {
        const controller = new AbortController();
        if (!activeChat) return;

        const getMessages = async () => {
            setIsMessagesLoading(true);
            setError('');
            try {
                const messagesData = await getUserMessages(activeChat, {
                    signal: controller.signal,
                });
                setMessages(messagesData);
            } catch (err) {
                if (axios.isCancel(err)) {
                    return;
                }

                if (axios.isAxiosError(err)) {
                    const message =
                        err.response?.data.message || 'Помилка при отриманні списку повідомлень';
                    setError(message);
                } else {
                    setError('Сталася непередбачувана помилка');
                    console.error('Невідома помилка:', err);
                }
            } finally {
                if (!controller.signal.aborted) {
                    setIsMessagesLoading(false);
                }
            }
        };

        getMessages();

        socket.emit('join_chat', activeChat);
        socket.on('receive_message', message => {
            setMessages(prev => [...prev, message]);
        });

        return () => {
            controller.abort();
            socket.off('receive_message');
        };
    }, [activeChat]);

    useEffect(() => {
        messagesRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    const handleSendMessage = () => {
        if (!newMessage.trim()) {
            setToast({
                show: true,
                message: 'Повідомлення порожнє',
                type: 'error',
            });
            return;
        }

        socket.emit('send_message', { chat_id: activeChat, sender_id: user?.id, text: newMessage });
        setNewMessage('');
    };

    const currentChat = chats.find(c => c.chat_id === activeChat);

    return (
        <div className="dash-chats">
            <div className="dash-chats__sidebar">
                <div className="dash-chats__title-container">
                    <h3 className="dash-chats__title">Мої діалоги</h3>
                </div>
                <div className="dash-chats__list">
                    {isChatsLoading && <Loader />}
                    {error && (
                        <div className="error-banner">
                            <span>⚠️</span> {error}
                        </div>
                    )}
                    {!isChatsLoading && !error && chats.length === 0 && (
                        <div className="empty-state">Наразі чатів немає</div>
                    )}
                    {!error &&
                        !isChatsLoading &&
                        chats.map(c => (
                            <div
                                key={c.chat_id}
                                className={`dash-chats__item ${activeChat === c.chat_id ? 'dash-chats__item--active' : ''}`}
                                onClick={() => setActiveChat(c.chat_id)}
                            >
                                <img
                                    src={c.item_image}
                                    alt={c.item_title}
                                    className="dash-chats__item-img"
                                />
                                <div className="dash-chats__item-info">
                                    <h4 className="dash-chats__item-name">{c.item_title}</h4>
                                    <span className="dash-chats__item-role">Орендар</span>
                                </div>
                            </div>
                        ))}
                </div>
            </div>
            <div className="dash-chats__main">
                {activeChat && currentChat ? (
                    <div className="dash-chats__window">
                        <div className="dash-chats__header">
                            <img
                                src={currentChat.item_image}
                                alt={currentChat.item_title}
                                className="dash-chats__header-img"
                            />
                            <div className="dash-chats__header-info">
                                <h4 className="dash-chats__header-title">
                                    {currentChat.item_title}
                                </h4>
                                <span className="dash-chats__header-status">В мережі</span>{' '}
                            </div>
                        </div>
                        <div className="dash-chats__messages">
                            {isMessagesLoading && <Loader />}
                            {error && (
                                <div className="error-banner">
                                    <span>⚠️</span> {error}
                                </div>
                            )}
                            {!error &&
                                !isMessagesLoading &&
                                messages.map(m => (
                                    <div
                                        key={m.id}
                                        className={`dash-chats__message ${m.sender_id === user?.id ? 'dash-chats__message--own' : ''}`}
                                    >
                                        <div className="dash-chats__message-text">{m.text}</div>
                                        <span className="dash-chats__message-time">
                                            {formatTime(m.created_at)}
                                        </span>
                                    </div>
                                ))}
                            <div ref={messagesRef}></div>
                        </div>
                        <div className="dash-chats__input-area">
                            <input
                                type="text"
                                className="dash-chats__input"
                                placeholder="Напишіть повідомлення..."
                                value={newMessage}
                                onChange={e => setNewMessage(e.target.value)}
                                onKeyDown={e => {
                                    if (e.key === 'Enter') {
                                        handleSendMessage();
                                    }
                                }}
                            />
                            <button className="dash-chats__send-btn" onClick={handleSendMessage}>
                                Відправити
                            </button>
                        </div>
                    </div>
                ) : (
                    <div className="dash-chats__empty">
                        <span className="dash-chats__empty-icon">💬</span>
                        <p>Оберіть діалог ліворуч, щоб почати спілкування</p>
                    </div>
                )}
            </div>
            {toast.show && (
                <Toast
                    message={toast.message}
                    type={toast.type}
                    onClose={() => setToast(prev => ({ ...prev, show: false }))}
                ></Toast>
            )}
        </div>
    );
};

export default DashChats;
