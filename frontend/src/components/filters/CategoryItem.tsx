import type { ItemCategory } from '../../types/items.types';
import type { Category } from '../../types/items.types';

interface CategoryItemProps {
    category: Category;
    setSelectCategory: (value: ItemCategory) => void;
    selectCategory: ItemCategory;
}

const CategoryItem = ({ category, setSelectCategory, selectCategory }: CategoryItemProps) => {
    return (
        <div
            className="category-item"
            onClick={() => {
                setSelectCategory(category.name);
            }}
        >
            <div className={`category-item__icon-wrapper ${category.bg}`}>
                <img
                    className="category-item__img"
                    src={category.src}
                    alt={category.name}
                    draggable="false"
                />
            </div>
            <h3
                className={`category-item__title ${selectCategory === category.name ? 'active' : ''}`}
            >
                {category.name}
            </h3>
        </div>
    );
};

export default CategoryItem;
