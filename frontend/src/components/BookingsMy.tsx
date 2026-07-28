import { useState, useEffect } from 'react';
import ProfileItemCard from './ProfileItemCard';
import { cancelBookingRequest } from '../services/booking';
import { useBookings } from '../context/BookingsContext';
import Loader from './Loader';
import { MdClose } from 'react-icons/md';

const BookingsMy = () => {
    const { myBookings, setMyBookings } = useBookings();
    const [loadingId, setLoadingId] = useState<number | null>(null);
    const [currentTime, setCurrentTime] = useState<number>(() => Date.now());

    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentTime(Date.now());
        }, 60000);

        return () => clearInterval(interval);
    }, []);

    const canCancel = (createdAt: string, status: string, now: number) => {
        if (status === 'cancelled_by_owner' || status === 'cancelled_by_renter') {
            return false;
        }

        const createdTime = new Date(createdAt).getTime();
        const diffInHours = (now - createdTime) / (1000 * 60 * 60);

        return diffInHours < 3;
    };

    const handleCancel = async (id: number) => {
        setLoadingId(id);
        try {
            await cancelBookingRequest(id);
            setMyBookings(prev =>
                prev.map(b => (b.id === id ? { ...b, status: 'cancelled_by_renter' } : b)),
            );
        } catch (error) {
            console.error('Помилка при скасуванні бронювання', error);
        } finally {
            setLoadingId(null);
        }
    };

    return (
        <>
            {myBookings.length === 0 ? (
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
            )}
        </>
    );
};

export default BookingsMy;
