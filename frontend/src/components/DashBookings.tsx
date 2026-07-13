import { useState, useEffect } from 'react';
import { getMyBookings, getOwnerBookings } from '../services/booking';
import type { BookingResponse } from '../types/booking.types';
import { NavLink, Outlet } from 'react-router-dom';
import axios from 'axios';
import Loader from './Loader';

export interface BookingsOwnerProps {
    myBookings: BookingResponse[];
    ownerBookings: BookingResponse[];
    setOwnerBookings: React.Dispatch<React.SetStateAction<BookingResponse[]>>;
}

const DashBookings = () => {
    const [myBookings, setMyBookings] = useState<BookingResponse[]>([]);
    const [ownerBookings, setOwnerBookings] = useState<BookingResponse[]>([]);
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

    return (
        <div className="dash-bookings">
            {error && (
                <div className="error-banner">
                    <span>⚠️</span> {error}
                </div>
            )}
            {loader && <Loader />}
            {!error && !loader && (
                <div className="dash-bookings__container">
                    <div className="dash-bookings__tabs">
                        <NavLink
                            to="/dashboard/bookings/my"
                            end
                            className={({ isActive }) =>
                                `dash-bookings__tab-btn ${isActive ? 'dash-bookings__tab-btn--active' : ''}`
                            }
                        >
                            Мої замовлення ({myBookings.length})
                        </NavLink>
                        <NavLink
                            to="/dashboard/bookings/owner"
                            end
                            className={({ isActive }) =>
                                `dash-bookings__tab-btn ${isActive ? 'dash-bookings__tab-btn--active' : ''}`
                            }
                        >
                            Запити на оренду ({ownerBookings.length})
                        </NavLink>
                    </div>
                    <div className="dash-bookings__content">
                        <Outlet
                            context={
                                {
                                    myBookings,
                                    ownerBookings,
                                    setOwnerBookings,
                                } satisfies BookingsOwnerProps
                            }
                        />
                    </div>
                </div>
            )}
        </div>
    );
};

export default DashBookings;
