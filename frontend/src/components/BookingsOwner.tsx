import { updateBookingsStatus } from '../services/booking';
import ProfileItemCard from './ProfileItemCard';
import { useOutletContext } from 'react-router-dom';
import type { BookingsOwnerProps } from './DashBookings';
import { useState } from 'react';
import Loader from './Loader';

const BookingsOwner = () => {
    const [loadingId, setLoadingId] = useState<number | null>(null);
    const { ownerBookings, setOwnerBookings } = useOutletContext<BookingsOwnerProps>();

    const handleUpdateStatus = async (
        status: 'pending' | 'confirmed' | 'cancelled',
        id: number,
    ) => {
        setLoadingId(id);
        try {
            await updateBookingsStatus(status, id);

            setOwnerBookings(prev => prev.map(b => (b.id === id ? { ...b, status: status } : b)));
        } catch (err) {
            console.error('Статус не змінено', err);
        } finally {
            setLoadingId(null);
        }
    };

    return (
        <>
            {ownerBookings.length === 0 ? (
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
                                            onClick={() => handleUpdateStatus('confirmed', item.id)}
                                        >
                                            {isCurrentLoading ? <Loader /> : 'Підтвердити'}
                                        </button>
                                        <button
                                            className="profile-card__btn profile-card__btn--cancel"
                                            disabled={loadingId !== null}
                                            onClick={() => handleUpdateStatus('cancelled', item.id)}
                                        >
                                            {isCurrentLoading ? <Loader /> : 'Відхилити'}
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

export default BookingsOwner;
