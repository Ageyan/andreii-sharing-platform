import { Link } from 'react-router-dom';
import type { Item } from '../types/items.types';

interface ItemCardProps {
    item: Item;
    children?: React.ReactNode;
}

const ItemCard = ({ item, children }: ItemCardProps) => {
    const fallbackImage =
        'https://wezom.com.ua/Media/filemanager/blog/struktura-internet-magazina-klyuchevye-momenty-sozdaniya/original/rEd1gfWUQnNVLIM0caWoMcl8aDVQ27G6372YEQYQ.jpg';
    const itemImage = item?.image_url?.[0] || fallbackImage;

    return (
        <Link to={`/items/${item.id}`} className="item-card">
            <div className="item-card__image-wrapper">
                <img className="item-card__img" src={itemImage} alt={item.title} loading="lazy" />
                <span className="item-card__badge">{item.category}</span>
            </div>
            <div className="item-card__content">
                <h3 className="item-card__title" title={item.title}>
                    {item.title}
                </h3>
                <p className="item-card__description" title={item.description}>
                    {item.description}
                </p>

                <div className="item-card__footer">
                    <span className="item-card__price">
                        <strong>{item.price_per_day}</strong> грн / день
                    </span>
                </div>
            </div>
            {children}
        </Link>
    );
};

export default ItemCard;
