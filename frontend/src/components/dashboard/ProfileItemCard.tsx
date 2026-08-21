import type { BookingResponse } from '../../types/booking.types';

import { MdOutlineArrowRightAlt } from 'react-icons/md';

interface ProfileCardProps {
    item: BookingResponse;
    children?: React.ReactNode;
    priceLabel?: string;
}

const ProfileItemCard = ({ item, children, priceLabel = 'Всього:' }: ProfileCardProps) => {
    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('uk-UA', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
        });
    };

    const getStatusLabel = (status: string) => {
        switch (status) {
            case 'pending':
                return 'Очікує підтвердження';
            case 'confirmed':
                return 'Підтверджено';
            case 'cancelled_by_owner':
                return 'Відхилено власником';
            case 'cancelled_by_renter':
                return 'Скасовано замовником';
            case 'completed':
                return 'Виконано';
            case 'expired':
                return 'Термін дії заявки минув';
            default:
                return status;
        }
    };

    const fallbackImage =
        'https://wezom.com.ua/Media/filemanager/blog/struktura-internet-magazina-klyuchevye-momenty-sozdaniya/original/rEd1gfWUQnNVLIM0caWoMcl8aDVQ27G6372YEQYQ.jpg';

    return (
        <div className="profile-card">
            <div className="profile-card__image-wrapper">
                <img
                    src={item.image_url[0] || fallbackImage}
                    alt={item.title}
                    className="profile-card__image"
                    draggable="false"
                />
            </div>
            <div className="profile-card__info">
                <h3 className="profile-card__title">{item.title}</h3>
                <div className="profile-card__dates">
                    <span>{formatDate(item.start_date)}</span>
                    <MdOutlineArrowRightAlt className="profile-card__dates-icon" />
                    <span>{formatDate(item.end_date)}</span>
                </div>
                <p className="profile-card__price">
                    {priceLabel} <strong>{item.total_price}</strong> грн
                </p>
                <span className={`profile-card__status profile-card__status--${item.status}`}>
                    {getStatusLabel(item.status)}
                </span>
                {children}
            </div>
        </div>
    );
};

export default ProfileItemCard;
