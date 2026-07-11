import { useState, useEffect } from 'react';
import { getMyBookings, getOwnerBookings, updateBookingsStatus } from '../services/booking';
import type { BookingResponse } from '../types/booking.types';
import ProfileItemCard from './ProfileItemCard';
import axios from 'axios';

type ActiveTabInfo = 'my' | 'owner';

const DashBookings = () => {
    const [myBookings, setMyBookings] = useState<BookingResponse[]>([]);
    const [ownerBookings, setOwnerBookings] = useState<BookingResponse[]>([]);
    const [activeTab, setActiveTab] = useState<ActiveTabInfo>('my');
    const [error, setError] = useState<string>('');
    const [loader, setLoader] = useState<boolean>(false);

    useEffect(() => {
        const getBookingsItem = async () => {
            setLoader(true);
            setError('');
            try {
                const myRes = await getMyBookings();
                const ownerRes = await getOwnerBookings();
                setMyBookings(myRes);
                setOwnerBookings(ownerRes);
            } catch (err) {
                let errorMessage = 'Сталася непередбачувана помилка';

                if (axios.isAxiosError(err)) {
                    errorMessage =
                        err.response?.data.message || 'Помилка при отриманні списку бронювань';
                } else {
                    console.error('Невідома помилка:', err);
                }

                setError(errorMessage);
            } finally {
                setLoader(false);
            }
        };

        getBookingsItem();
    }, []);

    const handleUpdateStatus = async (status: string, id: number) => {
        try {
            const statusBooking = await updateBookingsStatus(status, id);
            setOwnerBookings(prev =>
                prev.map(b => (b.id === id ? { ...b, status: statusBooking.status } : b)),
            );
        } catch (err) {
            console.error('Статус не змінено', err);
        }
    };

    return (
        <div className="dash-bookings">
            {error && <p className="dash-bookings__error">{error}</p>}
            {loader && (
                <div className="dash-bookings__loader">Сторінка бронювання завантажується...</div>
            )}

            {!error && !loader && (
                <div className="dash-bookings__container">
                    <div className="dash-bookings__tabs">
                        <button
                            className={`dash-bookings__tab-btn ${activeTab === 'my' ? 'dash-bookings__tab-btn--active' : ''}`}
                            onClick={() => setActiveTab('my')}
                        >
                            Мої замовлення ({myBookings.length})
                        </button>
                        <button
                            className={`dash-bookings__tab-btn ${activeTab === 'owner' ? 'dash-bookings__tab-btn--active' : ''}`}
                            onClick={() => setActiveTab('owner')}
                        >
                            Запити на оренду ({ownerBookings.length})
                        </button>
                    </div>
                    <div className="dash-bookings__content">
                        {activeTab === 'my' ? (
                            myBookings.length === 0 ? (
                                <p className="dash-bookings__empty">Ви ще нічого не орендували</p>
                            ) : (
                                <div className="dash-bookings__grid">
                                    {myBookings.map(item => (
                                        <ProfileItemCard key={item.id} item={item} />
                                    ))}
                                </div>
                            )
                        ) : ownerBookings.length === 0 ? (
                            <p className="dash-bookings__empty">
                                У вас поки немає запитів від інших користувачів
                            </p>
                        ) : (
                            <div className="dash-bookings__grid">
                                {ownerBookings.map(item => (
                                    <ProfileItemCard key={item.id} item={item} priceLabel="Дохід:">
                                        {item.status === 'pending' && (
                                            <div className="profile-card__actions">
                                                <button
                                                    className="profile-card__btn profile-card__btn--confirm"
                                                    onClick={() =>
                                                        handleUpdateStatus('confirmed', item.id)
                                                    }
                                                >
                                                    Підтвердити
                                                </button>
                                                <button
                                                    className="profile-card__btn profile-card__btn--cancel"
                                                    onClick={() =>
                                                        handleUpdateStatus('cancelled', item.id)
                                                    }
                                                >
                                                    Відхилити
                                                </button>
                                            </div>
                                        )}
                                    </ProfileItemCard>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};

export default DashBookings;
