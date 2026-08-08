import { NavLink } from 'react-router-dom';
import { useUserInfo } from '../context/UserContext';
import { useBookings } from '../context/BookingsContext';
import { getUnreadMessages } from '../services/chat';
import { useState, useEffect } from 'react';
import { socket } from '../services/socket';
import axios from 'axios';

const DashProfileSidebar = () => {
    const [countUnreadMessages, setCountUnreadMessages] = useState<number>(0);
    const { ownerBookings } = useBookings();
    const { user } = useUserInfo();

    const fetchUnreadCount = async () => {
        try {
            const messages = await getUnreadMessages({});
            setCountUnreadMessages(messages);
        } catch (err) {
            setCountUnreadMessages(0);
            console.error('Помилка при отриманні непрочитаних повідомлень:', err);
        }
    };

    useEffect(() => {
        const controller = new AbortController();
        const getUnread = async () => {
            try {
                const messages = await getUnreadMessages({ signal: controller.signal });
                setCountUnreadMessages(messages);
            } catch (err) {
                if (axios.isCancel(err)) {
                    return;
                }

                setCountUnreadMessages(0);
                console.error('Помилка при отриманні непрочитаних повідомлень:', err);
            }
        };

        getUnread();

        return () => controller.abort();
    }, []);

    useEffect(() => {
        if (!user) return;

        socket.on('receive_message', message => {
            if (user.id !== message.sender_id) {
                setCountUnreadMessages(prev => prev + 1);
            }
        });

        socket.on('messages_read', () => {
            fetchUnreadCount();
        });

        return () => {
            socket.off('receive_message');
            socket.off('messages_read');
        };
    }, [user]);

    return (
        <aside className="profile-sidebar">
            <div className="profile-sidebar__user-card">
                <div className="profile-sidebar__avatar-placeholder">
                    {user?.avatar_url ? (
                        <img
                            src={user.avatar_url}
                            alt="User avatar"
                            style={{ width: '100%', height: '100%' }}
                            draggable="false"
                        />
                    ) : (
                        user?.name?.charAt(0).toUpperCase() || 'U'
                    )}
                </div>
                <h2 className="profile-sidebar__user-name">Мій Акаунт</h2>
            </div>
            <nav className="profile-sidebar__menu">
                <NavLink
                    to="/dashboard/profile"
                    end
                    className={({ isActive }) =>
                        `profile-sidebar__menu-btn ${isActive ? 'profile-sidebar__menu-btn--active' : ''}`
                    }
                >
                    <span className="profile-sidebar__icon">👤</span>
                    <span className="profile-sidebar__title">Профіль</span>
                </NavLink>
                <NavLink
                    to="/dashboard/items"
                    className={({ isActive }) =>
                        `profile-sidebar__menu-btn ${isActive ? 'profile-sidebar__menu-btn--active' : ''}`
                    }
                >
                    <span className="profile-sidebar__icon">📦</span>
                    <span className="profile-sidebar__title">Речі</span>
                </NavLink>
                <NavLink
                    to="/dashboard/bookings"
                    className={({ isActive }) =>
                        `profile-sidebar__menu-btn ${isActive ? 'profile-sidebar__menu-btn--active' : ''}`
                    }
                >
                    <span className="profile-sidebar__icon">📅</span>
                    <span className="profile-sidebar__title">Бронь</span>
                    <span
                        className={`profile-sidebar__bookings-owner 
                            ${
                                ownerBookings.filter(i => i.status === 'pending').length === 0
                                    ? 'profile-sidebar__bookings-owner--hidden'
                                    : ''
                            }`}
                    >
                        {ownerBookings.filter(i => i.status === 'pending').length}
                    </span>
                </NavLink>
                <NavLink
                    to="/dashboard/chats"
                    className={({ isActive }) =>
                        `profile-sidebar__menu-btn ${isActive ? 'profile-sidebar__menu-btn--active' : ''}`
                    }
                >
                    <span className="profile-sidebar__icon">💬</span>
                    <span className="profile-sidebar__title">Чати</span>
                    <span
                        className={`profile-sidebar__bookings-unread ${countUnreadMessages === 0 ? 'profile-sidebar__bookings-unread--hidden' : ''}`}
                    >
                        {countUnreadMessages}
                    </span>
                </NavLink>
            </nav>
        </aside>
    );
};

export default DashProfileSidebar;
