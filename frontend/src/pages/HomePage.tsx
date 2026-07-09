import { useState, useEffect } from 'react';
import axios from 'axios';
import type { Item, ItemCategory } from '../types/items.types';
import { getItems } from '../services/items';
import ItemCard from '../components/ItemCard';
import SortContainer from '../components/SortContainer';
import type { SortValue } from '../components/SortContainer';
import SearchContainer from '../components/SearchContainer';
import { useSearch } from '../context/SearchContext';

const HomePage = () => {
    const [items, setItems] = useState<Item[]>([]);
    const [loader, setLoader] = useState<boolean>(false);
    const [error, setError] = useState<string>('');
    const [selectCategory, setSelectCategory] = useState<ItemCategory>('Усі речі');
    const [sortBy, setSortBy] = useState<SortValue>('newest');

    const { searchTerm, setSearchTerm } = useSearch();

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

    const filteredItems = items
        .filter(item => item.title.toLowerCase().includes(searchTerm.toLowerCase()))
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
            <SearchContainer setSelectCategory={setSelectCategory} />
            <div className="home-page__main-layout">
                <SortContainer
                    setSerchTerm={setSearchTerm}
                    setSelectCategory={setSelectCategory}
                    sortBy={sortBy}
                    setSortBy={setSortBy}
                />
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
    );
};

export default HomePage;
