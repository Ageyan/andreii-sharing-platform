import { useState } from 'react';
import axios from 'axios';

import { updateBookingsStatus } from '../../services/booking';
import type { BookingStatusResponse } from '../../types/booking.types';
import { useBookings } from '../../context/BookingsContext';

import ProfileItemCard from './ProfileItemCard';
import Loader from '../common/Loader';

import { MdDone, MdClose } from 'react-icons/md';

const BookingsOwner = () => {
    const { ownerBookings, setOwnerBookings, setToast } = useBookings();
    const [loadingId, setLoadingId] = useState<number | null>(null);

    const handleUpdateStatus = async ({ status, id }: BookingStatusResponse) => {
        setLoadingId(id);
        setToast(prev => ({ ...prev, show: false }));

        try {
            await updateBookingsStatus({ status, id });
            setOwnerBookings(prev => prev.map(b => (b.id === id ? { ...b, status: status } : b)));
            setToast({
                show: true,
                message: 'Статус бронювання успішно змінено',
                type: 'success',
            });
        } catch (err) {
            let errorMessage = 'Сталася непередбачувана помилка';
            if (axios.isAxiosError(err)) {
                errorMessage = err.response?.data.message || 'Помилка при зміні статусу';
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

    return ownerBookings.length === 0 ? (
        <div className="empty-state">
            <span className="empty-state__icon">📅</span>
            <p>У вас поки немає запитів від інших користувачів</p>
        </div>
    ) : (
        <div className="dash-bookings__grid">
            {ownerBookings.map(item => {
                const isCurrentLoading = loadingId === item.id;
                return (
                    <ProfileItemCard key={item.id} item={item} priceLabel="Дохід:">
                        {item.status === 'pending' && (
                            <div className="profile-card__actions">
                                <button
                                    className="profile-card__btn profile-card__btn--confirm"
                                    disabled={loadingId !== null}
                                    onClick={() =>
                                        handleUpdateStatus({
                                            status: 'confirmed',
                                            id: item.id,
                                        })
                                    }
                                >
                                    {isCurrentLoading ? (
                                        <Loader />
                                    ) : (
                                        <>
                                            <MdDone className="profile-card__btn-icon" />
                                            <span className="profile-card__btn-text">
                                                Підтвердити
                                            </span>
                                        </>
                                    )}
                                </button>
                                <button
                                    className="profile-card__btn profile-card__btn--cancel"
                                    disabled={loadingId !== null}
                                    onClick={() =>
                                        handleUpdateStatus({
                                            status: 'cancelled_by_owner',
                                            id: item.id,
                                        })
                                    }
                                >
                                    {isCurrentLoading ? (
                                        <Loader />
                                    ) : (
                                        <>
                                            <MdClose className="profile-card__btn-icon" />
                                            <span className="profile-card__btn-text">
                                                Відхилити
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

export default BookingsOwner;
