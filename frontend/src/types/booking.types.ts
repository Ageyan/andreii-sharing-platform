export interface CreateBookingResponse {
    message: string;
    booking: {
        id: number;
        item_id: number;
        renter_id: number;
        start_date: string;
        end_date: string;
        total_price: string;
        status: string;
        created_at: string;
    };
}

export interface BookingResponse {
    id: number;
    item_id: number;
    renter_id: number;
    start_date: string;
    end_date: string;
    total_price: string; 
    status: 'pending' | 'confirmed' | 'cancelled'; 
    created_at: string;
    title: string;
    category: string;
    image_url: string[]; // Помнишь, у нас теперь это массив!
}

