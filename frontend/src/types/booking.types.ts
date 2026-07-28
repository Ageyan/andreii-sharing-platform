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
    status: 'pending' | 'confirmed' | 'cancelled_by_owner' | 'cancelled_by_renter'; 
    created_at: string;
    title: string;
    category: string;
    image_url: string[]; 
}

export interface BookingStatusResponse {
    id: number;
    status: 'pending' | 'confirmed' | 'cancelled_by_owner' | 'cancelled_by_renter';
}

