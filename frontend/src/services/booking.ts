import type { CreateBookingResponse, BookingResponse } from "../types/booking.types";
import api from "./api";

export const createBooking = async(item_id: number, start_date: string, end_date: string, total_price: number): Promise<CreateBookingResponse> => {
    const { data } = await api.post<CreateBookingResponse>('/bookings', {item_id, start_date, end_date, total_price});
    return data;
};

export const getMyBookings = async(): Promise<BookingResponse[]> => {
    const { data } = await api.get<BookingResponse[]>('/bookings/my');
    return data;
}

export const getOwnerBookings = async(): Promise<BookingResponse[]> => {
    const { data } = await api.get<BookingResponse[]>('/bookings/owner');
    return data;
}