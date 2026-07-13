import ProfileItemCard from './ProfileItemCard';
import type { BookingsOwnerProps } from './DashBookings';
import { useOutletContext } from 'react-router-dom';

const BookingsMy = () => {
    const { myBookings } = useOutletContext<BookingsOwnerProps>();

    return (
        <>
            {myBookings.length === 0 ? (
                <div className="empty-state">
                    <span className="empty-state__icon">📦</span>
                    <p>Ви ще нічого не орендували</p>
                </div>
            ) : (
                <div className="dash-bookings__grid">
                    {myBookings.map(item => (
                        <ProfileItemCard key={item.id} item={item} />
                    ))}
                </div>
            )}
        </>
    );
};

export default BookingsMy;
