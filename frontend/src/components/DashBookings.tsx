import { useState, useEffect } from 'react';
import { getMyBookings, getOwnerBookings } from '../services/booking';
import type { BookingResponse } from '../types/booking.types';
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
                if (axios.isAxiosError(err)) {
                    const message =
                        err.response?.data.message || 'Помилка при отриманні даних про користувача';
                    setError(message);
                } else {
                    setError('Сталася непередбачувана помилка');
                    console.error('Невідома помилка:', err);
                }
            } finally {
                setLoader(false);
            }
        };

        getBookingsItem();
    }, []);

    return (
        <div>
            {error && <p>{error}</p>}
            {loader && <div>Сторінка бронювання завантажується...</div>}
            {!error && !loader && (
                <div>
                    <div className="tabs-navigation">
                        <button onClick={() => setActiveTab('my')}>
                            Мої замовлення ({myBookings.length})
                        </button>
                        <button onClick={() => setActiveTab('owner')}>
                            Запити на оренду ({ownerBookings.length})
                        </button>
                    </div>
                    <div className="tabs-content">
                        {activeTab === 'my' ? (
                            myBookings.length === 0 ? (
                                <p>Ви ще нічого не орендували</p>
                            ) : (
                                myBookings.map(item => (
                                    <div key={item.id}>
                                        <p>Назва: {item.title}</p>
                                        <img
                                            src={item.image_url[0]}
                                            alt={item.title}
                                            style={{ width: '100px' }}
                                        />
                                        <p>Початок оренди: {item.start_date}</p>
                                        <p>Кінець оренди: {item.end_date}</p>
                                        <p>Загальна вартість: {item.total_price} грн</p>
                                        <p>Статус: {item.status}</p>
                                    </div>
                                ))
                            )
                        ) : ownerBookings.length === 0 ? (
                            <p>У вас поки немає запитів від інших користувачів</p>
                        ) : (
                            ownerBookings.map(item => (
                                <div key={item.id}>
                                    <p>Назва: {item.title}</p>
                                    <img
                                        src={item.image_url[0]}
                                        alt={item.title}
                                        style={{ width: '100px' }}
                                    />
                                    <p>Початок оренди: {item.start_date}</p>
                                    <p>Кінець оренди: {item.end_date}</p>
                                    <p>Загальна вартість: {item.total_price} грн</p>
                                    <p>Статус: {item.status}</p>
                                </div>
                            ))
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};

export default DashBookings;
