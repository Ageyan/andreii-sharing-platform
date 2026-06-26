import type { ItemCategory } from '../types/items.types';

interface Category {
    id: number;
    name: ItemCategory;
    bg: string;
    src: string;
}

interface CategoryItemProps {
    category: Category;
    setSelectCategory: (vaule: ItemCategory) => void;
}

const CategoryItem = ({ category, setSelectCategory }: CategoryItemProps) => {
    return (
        <div className="category-item" onClick={() => setSelectCategory(category.name)}>
            <img
                className={`category-item__img ${category.bg}`}
                src={category.src}
                alt={category.name}
            />
            <h3 className="category-item__title">{category.name}</h3>
        </div>
    );
};

export default CategoryItem;
