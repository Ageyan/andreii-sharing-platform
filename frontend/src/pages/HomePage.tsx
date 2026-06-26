import { useState, useEffect } from 'react';
import axios from 'axios';
import type { Item, ItemCategory } from '../types/items.types';
import { getItems } from '../services/items';
import ItemCard from '../components/ItemCard';
import CategoryItem from '../components/CategoryItem';
import { IoIosArrowDown } from 'react-icons/io';

interface CategoryList {
    id: number;
    name: ItemCategory;
    bg: string;
    src: string;
}

type SortTitle =
    | 'Нещодавно додані речі'
    | 'Від дорогих до дешевих речей'
    | 'Від дешевих до дорогих речей';
type SortValue = 'newest' | 'price-desc' | 'price-asc';

interface SortsList {
    id: number;
    title: SortTitle;
    sort: SortValue;
}

const HomePage = () => {
    const [items, setItems] = useState<Item[]>([]);
    const [loader, setLoader] = useState<boolean>(false);
    const [error, setError] = useState<string>('');
    const [serchTerm, setSerchTerm] = useState<string>('');
    const [selectCategory, setSelectCategory] = useState<ItemCategory>('Усі речі');
    const [sortBy, setSortBy] = useState<SortValue>('newest');
    const [isOpen, setIsOpen] = useState<boolean>(false);

    const categories: CategoryList[] = [
        {
            id: 1,
            name: 'Усі речі',
            bg: 'all',
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
            name: 'Работа',
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

    const sorts: SortsList[] = [
        { id: 1, title: 'Нещодавно додані речі', sort: 'newest' },
        { id: 2, title: 'Від дорогих до дешевих речей', sort: 'price-desc' },
        { id: 3, title: 'Від дешевих до дорогих речей', sort: 'price-asc' },
    ];

    useEffect(() => {
        const controller = new AbortController();

        const getItemsList = async () => {
            setLoader(true);
            try {
                const res = await getItems({ signal: controller.signal });
                setItems(res);
            } catch (err) {
                if (axios.isCancel(err)) {
                    return;
                }

                if (axios.isAxiosError(err)) {
                    const message =
                        err.response?.data.message || 'Помилка при отриманні списку речей';
                    setError(message);
                } else {
                    setError('Сталася непередбачувана помилка');
                    console.error('Невідома помилка:', err);
                }
            } finally {
                if (!controller.signal.aborted) {
                    setLoader(false);
                }
            }
        };
        getItemsList();

        return () => controller.abort();
    }, []);

    useEffect(() => {
        const closeSelect = () => setIsOpen(false);
        document.addEventListener('click', closeSelect);
        return () => document.removeEventListener('click', closeSelect);
    }, []);

    const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
        setSerchTerm(event.target.value);
    };

    const filteredItems = items
        .filter(item => item.title.toLowerCase().includes(serchTerm.toLowerCase()))
        .filter(item => selectCategory === 'Усі речі' || item.category === selectCategory)
        .sort((a, b) => {
            if (sortBy === 'price-desc') {
                return b.price_per_day - a.price_per_day;
            } else if (sortBy === 'price-asc') {
                return a.price_per_day - b.price_per_day;
            } else {
                return 0;
            }
        });

    return (
        <div className="home-page">
            <div className="home-page__search-container">
                <input
                    className="home-page__search-input"
                    type="text"
                    value={serchTerm}
                    onChange={handleSearch}
                    placeholder="Введіть назву товару..."
                />
                <div className="home-page__category-container">
                    {categories.map(category => (
                        <CategoryItem
                            setSelectCategory={setSelectCategory}
                            key={category.id}
                            category={category}
                        />
                    ))}
                </div>
            </div>
            <div className="home-page__main-layout">
                <aside className="home-page__aside">
                    <div
                        className="home-page__sort"
                        onClick={e => {
                            setIsOpen(!isOpen);
                            e.nativeEvent.stopImmediatePropagation();
                        }}
                    >
                        <span>{sorts.find(s => s.sort === sortBy)?.title}</span>
                        <IoIosArrowDown className={isOpen ? 'open' : ''} />
                    </div>
                    {isOpen && (
                        <div className="home-page__sort-options">
                            {sorts.map(s => (
                                <div
                                    key={s.id}
                                    className={`home-page__sort-option ${sortBy === s.sort ? 'selected' : ''}`}
                                    onClick={() => {
                                        setSortBy(s.sort);
                                        setIsOpen(false);
                                    }}
                                >
                                    {s.title}
                                </div>
                            ))}
                        </div>
                    )}
                    <button
                        onClick={() => {
                            setSerchTerm('');
                            setSelectCategory('Усі речі');
                            setSortBy('newest');
                        }}
                    >
                        Скинути фільтри
                    </button>
                </aside>
                <div className="home-page__grid">
                    <div className="home-page__item-list">
                        {loader && <div className="text-loader">Завантаження товарів...</div>}
                        {error && <div className="text-error">{error}</div>}
                        {!loader &&
                            !error &&
                            filteredItems.map(item => <ItemCard key={item.id} item={item} />)}

                        {!loader && !error && filteredItems.length === 0 && (
                            <div className="text-empty">Нічого не знайдено за вашим запитом</div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default HomePage;
