import { useEffect, useState } from 'react';
import type { GetUserChatsProps } from '../types/chat.types';
import { getUserChats } from '../services/chat';
import { useLocation } from 'react-router-dom';
import Loader from './Loader';
import axios from 'axios';

const DashChats = () => {
    const [chats, setChats] = useState<GetUserChatsProps[]>([]);
    const [activeChat, setActiveChat] = useState<number | null>(null);
    const [error, setError] = useState<string>('');
    const [loader, setLoader] = useState<boolean>(false);

    const location = useLocation();

    useEffect(() => {
        const controller = new AbortController();

        const getChats = async () => {
            setLoader(true);
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
                    setLoader(false);
                }
            }
        };
        getChats();

        return () => controller.abort();
    }, []);
    return (
        <div className="dash-chats">
            <div className="dash-chats__sidebar">
                <h3 className="dash-chats__title">Мої діалоги</h3>
                <div className="dash-chats__list">
                    {loader && <Loader />}
                    {error && (
                        <div className="error-banner">
                            <span>⚠️</span> {error}
                        </div>
                    )}
                    {!loader && !error && chats.length === 0 && (
                        <div className="empty-state">Наразі чатів немає</div>
                    )}
                    {!error &&
                        !loader &&
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

            {/* Доробити вікно чату */}
            <div className="dash-chats__main">
                <div className="dash-chats__empty">
                    <span className="dash-chats__empty-icon">💬</span>
                    <p>Оберіть діалог ліворуч, щоб почати спілкування</p>
                </div>
            </div>
        </div>
    );
};

export default DashChats;
