import { useState, useEffect, type ReactNode } from 'react';
import axios from 'axios';

import { BookingsContext } from '../context/BookingsContext';
import { getMyBookings, getOwnerBookings } from '../services/booking';
import type { BookingResponse } from '../types/booking.types';
import type { ToastState } from '../types/toast.types';

export const BookingsProvider = ({ children }: { children: ReactNode }) => {
    const [ownerBookings, setOwnerBookings] = useState<BookingResponse[]>([]);
    const [myBookings, setMyBookings] = useState<BookingResponse[]>([]);
    const [error, setError] = useState<string>('');
    const [loader, setLoader] = useState<boolean>(false);
    const [toast, setToast] = useState<ToastState>({ show: false, message: '', type: 'success' });

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
        <BookingsContext.Provider
            value={{
                ownerBookings,
                setOwnerBookings,
                myBookings,
                setMyBookings,
                error,
                loader,
                toast,
                setToast,
            }}
        >
            {children}
        </BookingsContext.Provider>
    );
};
