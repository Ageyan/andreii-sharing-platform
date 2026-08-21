import { useState, useEffect } from 'react';
import axios from 'axios';

import { cancelBookingRequest } from '../../services/booking';
import { useBookings } from '../../context/BookingsContext';

import ProfileItemCard from './ProfileItemCard';
import Loader from '../common/Loader';

import { MdClose } from 'react-icons/md';

const canCancel = (createdAt: string, status: string, now: number) => {
    if (status !== 'pending' && status !== 'confirmed') {
        return false;
    }

    const createdTime = new Date(createdAt).getTime();
    const diffInHours = (now - createdTime) / (1000 * 60 * 60);

    return diffInHours < 3;
};

const BookingsMy = () => {
    const { myBookings, setMyBookings, setToast } = useBookings();
    const [loadingId, setLoadingId] = useState<number | null>(null);
    const [currentTime, setCurrentTime] = useState<number>(() => Date.now());

    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentTime(Date.now());
        }, 60000);

        return () => clearInterval(interval);
    }, []);

    const handleCancel = async (id: number) => {
        setLoadingId(id);
        setToast(prev => ({ ...prev, show: false }));

        try {
            await cancelBookingRequest(id);
            setMyBookings(prev =>
                prev.map(b => (b.id === id ? { ...b, status: 'cancelled_by_renter' } : b)),
            );
            setToast({
                show: true,
                message: 'Бронювання успішно скасовано',
                type: 'success',
            });
        } catch (err) {
            let errorMessage = 'Сталася непередбачувана помилка';
            if (axios.isAxiosError(err)) {
                errorMessage = err.response?.data.message || 'Помилка при скасуванні бронювання';
            } else {
                console.error('Невідома помилка:', err);
            }
            setToast({
                show: true,
                message: errorMessage,
                type: 'error',
            });
        } finally {
            setLoadingId(null);
        }
    };

    return myBookings.length === 0 ? (
        <div className="empty-state">
            <span className="empty-state__icon">📦</span>
            <p>Ви ще нічого не орендували</p>
        </div>
    ) : (
        <div className="dash-bookings__grid">
            {myBookings.map(item => {
                const isCancelable = canCancel(item.created_at, item.status, currentTime);
                const isCurrentLoading = loadingId === item.id;
                return (
                    <ProfileItemCard key={item.id} item={item}>
                        {isCancelable && (
                            <div className="profile-card__actions">
                                <button
                                    className="profile-card__btn profile-card__btn--cancel"
                                    disabled={loadingId !== null}
                                    onClick={() => handleCancel(item.id)}
                                >
                                    {isCurrentLoading ? (
                                        <Loader />
                                    ) : (
                                        <>
                                            <MdClose className="profile-card__btn-icon" />
                                            <span className="profile-card__btn-text">
                                                Скасувати
                                            </span>
                                        </>
                                    )}
                                </button>
                            </div>
                        )}
                    </ProfileItemCard>
                );
            })}
        </div>
    );
};

export default BookingsMy;
