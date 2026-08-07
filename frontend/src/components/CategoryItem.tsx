import { useSearch } from '../context/SearchContext';
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
    const { setPage } = useSearch();
    return (
        <div
            className="category-item"
            onClick={() => {
                setSelectCategory(category.name);
                setPage(1);
            }}
        >
            <div className={`category-item__icon-wrapper ${category.bg}`}>
                <img className="category-item__img" src={category.src} alt={category.name} />
            </div>
            <h3 className="category-item__title">{category.name}</h3>
        </div>
    );
};

export default CategoryItem;
