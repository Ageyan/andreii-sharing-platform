import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import type { ToastState } from '../types/toast.types';
import type { Item } from '../types/items.types';
import { createBooking } from '../services/booking';
import { useUserInfo } from '../context/UserContext';
import { getLocalDateString, getNextDay } from '../utils/date.utils';
import axios from 'axios';
import Loader from './Loader';

interface ItemPageSidebarProps {
    item: Item | null;
    setToast: React.Dispatch<React.SetStateAction<ToastState>>;
}

const ItemPageSidebar = ({ item, setToast }: ItemPageSidebarProps) => {
    const [bookingLoader, setBookingLoader] = useState<boolean>(false);
    const isAuthenticated = !!localStorage.getItem('token');
    const navigate = useNavigate();
    const location = useLocation();
    const { user } = useUserInfo();

    const myItem = user?.id === item?.owner_id;

    const authNavigate = () => {
        navigate('/auth', { state: { from: location.pathname } });
    };

    const today = getLocalDateString(new Date());
    const tomorrow = getNextDay(today);

    const [startDate, setStartDate] = useState<string>(today);
    const [endDate, setEndDate] = useState<string>(tomorrow);

    const startBooking = async (event: React.SubmitEvent<HTMLFormElement>) => {
        event.preventDefault();
        const start = new Date(startDate).getTime();
        const end = new Date(endDate).getTime();
        const totalDays = Math.ceil((end - start) / (1000 * 60 * 60 * 24));
        const totalPrice = totalDays * Number(item!.price_per_day);

        setBookingLoader(true);
        try {
            await createBooking(item!.id, startDate, endDate, totalPrice);
            setToast({
                show: true,
                message: 'Запит на оренду надіслано! Очікуйте на підтвердження від власника',
                type: 'success',
            });
        } catch (err) {
            let errorMessage = 'Сталася непередбачувана помилка';
            if (axios.isAxiosError(err)) {
                errorMessage = err.response?.data.message || 'Помилка при створенні бронювання';
            }
            setToast({
                show: true,
                message: errorMessage,
                type: 'error',
            });
        } finally {
            setBookingLoader(false);
        }
    };

    return (
        <div className="item-sidebar__widget">
            <div className="item-sidebar__price-block">
                <span className="item-sidebar__price-label">Вартість оренди:</span>
                <p className="item-sidebar__price">
                    <strong>{item?.price_per_day}</strong> грн / доба
                </p>
            </div>
            <form className="item-sidebar__form" onSubmit={startBooking}>
                <div className="item-sidebar__input-group">
                    <label className="item-sidebar__label">Початок оренди</label>
                    <input
                        type="date"
                        className="item-sidebar__date-input"
                        value={startDate}
                        min={today}
                        onChange={e => {
                            const newStartDate = e.target.value;
                            setStartDate(newStartDate);
                            const nextDayForEnd = getNextDay(newStartDate);
                            setEndDate(nextDayForEnd);
                        }}
                        required
                    />
                </div>
                <div className="item-sidebar__input-group">
                    <label className="item-sidebar__label">Кінець оренди</label>
                    <input
                        type="date"
                        className="item-sidebar__date-input"
                        value={endDate}
                        min={getNextDay(startDate)}
                        onChange={e => setEndDate(e.target.value)}
                        required
                    />
                </div>
                {isAuthenticated ? (
                    <button
                        type="submit"
                        className={`item-sidebar__action-btn ${myItem ? 'item-sidebar__action-btn--disabled' : ''}`}
                        disabled={bookingLoader || myItem}
                    >
                        {bookingLoader ? <Loader /> : 'Орендувати зараз'}
                    </button>
                ) : (
                    <button
                        onClick={authNavigate}
                        type="button"
                        className="item-sidebar__action-btn"
                    >
                        Увійти для оренди
                    </button>
                )}
            </form>
            <p className="item-sidebar__widget-note">
                {isAuthenticated
                    ? myItem
                        ? 'Ви не можете орендувати власні речі'
                        : `* Ви можете скасувати бронь безкоштовно після 3-х годин від початку
                        оренди.`
                    : `* Для орендування необхідно здійснити вхід у особистий кабінет`}
            </p>
        </div>
    );
};

export default ItemPageSidebar;
