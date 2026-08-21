import { useContext, createContext } from 'react';

import type { BookingResponse } from '../types/booking.types';
import type { ToastState } from '../types/toast.types';

interface BookingsContextType {
    ownerBookings: BookingResponse[];
    setOwnerBookings: React.Dispatch<React.SetStateAction<BookingResponse[]>>;
    myBookings: BookingResponse[];
    setMyBookings: React.Dispatch<React.SetStateAction<BookingResponse[]>>;
    loader: boolean;
    error: string;
    setToast: React.Dispatch<React.SetStateAction<ToastState>>;
    toast: ToastState;
}

export const BookingsContext = createContext<BookingsContextType | null>(null);

export const useBookings = () => {
    const context = useContext(BookingsContext);
    if (!context) {
        throw new Error('useBookings must be used inside BookingsProvider');
    }
    return context;
};
