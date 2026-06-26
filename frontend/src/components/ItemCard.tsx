import type { Item } from '../types/items.types';

interface ItemCardProps {
    item: Item;
}

const ItemCard = ({ item }: ItemCardProps) => {
    return (
        <div
            className="item-card"
            style={{
                background: '#fff',
                padding: '20px',
                borderRadius: '8px',
            }}
        >
            <h3 className="item-card__title">{item.title}</h3>
            <p className="item-card__description">{item.description}</p>
            <p className="item-card__category">{item.category}</p>
            <p className="item-card__price">{item.price_per_day} грн/день</p>
        </div>
    );
};
export default ItemCard;
