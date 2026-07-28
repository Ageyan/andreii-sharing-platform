import { useContext, createContext } from 'react';
import type { BookingResponse } from '../types/booking.types';

interface bookingsContextType {
    ownerBookings: BookingResponse[];
    setOwnerBookings: React.Dispatch<React.SetStateAction<BookingResponse[]>>;
    myBookings: BookingResponse[];
    setMyBookings: React.Dispatch<React.SetStateAction<BookingResponse[]>>;
    loader: boolean;
    error: string;
}

export const BookingsContext = createContext<bookingsContextType | null>(null);

export const useBookings = () => {
    const context = useContext(BookingsContext);
    if (!context) {
        throw new Error('useBookings must be used inside BookingsProvider');
    }
    return context;
};
