import CategoryItem from './CategoryItem';
import type { ItemCategory } from '../types/items.types';

interface CategoryList {
    id: number;
    name: ItemCategory;
    bg: string;
    src: string;
}

const categories: CategoryList[] = [
    {
        id: 1,
        bg: 'all',
        name: 'Усі речі',
        src: 'https://categories.olxcdn.com/assets/categories/olxua/vidomi-rechi-3901-1x.png',
    },
    {
        id: 2,
        bg: 'auto',
        name: 'Авто',
        src: 'https://categories.olxcdn.com/assets/categories/olxua/transport-1532-1x.png',
    },
    {
        id: 3,
        bg: 'electronics',
        name: 'Електроніка',
        src: 'https://categories.olxcdn.com/assets/categories/olxua/elektronika-37-1x.png',
    },
    {
        id: 4,
        bg: 'work',
        name: 'Робота',
        src: 'https://categories.olxcdn.com/assets/categories/olxua/rabota-6-1x.png',
    },
    {
        id: 5,
        bg: 'spare-parts',
        name: 'Запчастини',
        src: 'https://categories.olxcdn.com/assets/categories/olxua/zapchasti-dlya-transporta-3-1x.png',
    },
    {
        id: 6,
        bg: 'house',
        name: 'Дім і сад',
        src: 'https://categories.olxcdn.com/assets/categories/olxua/dom-i-sad-899-1x.png',
    },
    {
        id: 7,
        bg: 'business',
        name: 'Бізнес та послуги',
        src: 'https://categories.olxcdn.com/assets/categories/olxua/uslugi-7-1x.png',
    },
    {
        id: 8,
        bg: 'kids',
        name: 'Дитячий світ',
        src: 'https://categories.olxcdn.com/assets/categories/olxua/detskiy-mir-36-1x.png',
    },
    {
        id: 9,
        bg: 'sports',
        name: 'Відпочинок і спорт',
        src: 'https://categories.olxcdn.com/assets/categories/olxua/hobbi-otdyh-i-sport-903-1x.png',
    },
    {
        id: 10,
        bg: 'gamer',
        name: 'Товари для геймерів',
        src: 'https://categories.olxcdn.com/assets/promo/olxua/cybersport-1x.png',
    },
    {
        id: 11,
        bg: 'real-estate',
        name: 'Нерухомість',
        src: 'https://categories.olxcdn.com/assets/categories/olxua/nedvizhimost-1-1x.png',
    },
];

interface SearchContainerProps {
    setSelectCategory: (value: ItemCategory) => void;
}

const SearchContainer = ({ setSelectCategory }: SearchContainerProps) => {
    return (
        <div className="category-container">
            {categories.map(category => (
                <CategoryItem
                    setSelectCategory={setSelectCategory}
                    key={category.id}
                    category={category}
                />
            ))}
        </div>
    );
};

export default SearchContainer;
