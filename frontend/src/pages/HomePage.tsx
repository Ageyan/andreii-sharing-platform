import { useState, useEffect, useRef, useLayoutEffect } from 'react';
import axios from 'axios';
import type { Item, ItemCategory } from '../types/items.types';
import { getItems } from '../services/items';
import ItemCard from '../components/ItemCard';
import SortContainer from '../components/SortContainer';
import type { SortValue } from '../components/SortContainer';
import CategoryContainer from '../components/CategoryContainer';
import { useSearch } from '../context/SearchContext';
import Loader from '../components/Loader';

const HomePage = () => {
    const [items, setItems] = useState<Item[]>([]);
    const [loader, setLoader] = useState<boolean>(false);
    const [error, setError] = useState<string>('');
    const [selectCategory, setSelectCategory] = useState<ItemCategory>('Усі речі');
    const [sortBy, setSortBy] = useState<SortValue>('newest');
    const [hasMore, setHasMore] = useState<boolean>(true);
    const [isLoading, setIsLoading] = useState<boolean>(false);

    const { searchTerm, setSearchTerm, page, setPage } = useSearch();
    const pageRef = useRef<HTMLDivElement>(null);
    const observerState = useRef({ loader, isLoading, hasMore, itemsLength: items.length });

    useLayoutEffect(() => {
        observerState.current = { loader, isLoading, hasMore, itemsLength: items.length };
    }, [loader, isLoading, hasMore, items.length]);

    useEffect(() => {
        const controller = new AbortController();

        const getItemsList = async () => {
            if (page === 1) {
                setLoader(true);
                setItems([]);
            } else {
                setIsLoading(true);
            }

            setError('');

            try {
                const res = await getItems(
                    { page, limit: 20, category: selectCategory, search: searchTerm, sort: sortBy },
                    { signal: controller.signal },
                );
                setHasMore(res.hasMore);

                if (page === 1) {
                    setItems(res.data);
                } else {
                    setItems(prev => [...prev, ...res.data]);
                }
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
                    setIsLoading(false);
                }
            }
        };
        getItemsList();

        return () => controller.abort();
    }, [page, selectCategory, searchTerm, sortBy]);

    useEffect(() => {
        const currentLoader = pageRef.current;

        if (!currentLoader) return;

        const observer = new IntersectionObserver(
            entries => {
                const first = entries[0];
                if (first.isIntersecting) {
                    const state = observerState.current;
                    if (
                        state.hasMore &&
                        !state.isLoading &&
                        !state.loader &&
                        state.itemsLength > 0
                    ) {
                        setPage(prev => prev + 1);
                    }
                }
            },
            {
                threshold: 1.0,
            },
        );

        observer.observe(currentLoader);

        return () => {
            if (currentLoader) {
                observer.unobserve(currentLoader);
            }
        };
    }, [setPage]);

    useEffect(() => {
        setPage(1);
    }, [setPage]);

    return (
        <div className="home-page">
            <CategoryContainer setSelectCategory={setSelectCategory} />
            <div className="home-page__main-layout">
                <SortContainer
                    setSerchTerm={setSearchTerm}
                    setSelectCategory={setSelectCategory}
                    sortBy={sortBy}
                    setSortBy={setSortBy}
                />
                <div className="home-page__item-list">
                    {loader && <Loader />}
                    {error && (
                        <div className="error-banner">
                            <span>⚠️</span> {error}
                        </div>
                    )}
                    {!loader && !error && items.map(item => <ItemCard key={item.id} item={item} />)}

                    {!loader && !error && items.length === 0 && (
                        <div className="empty-state">Нічого не знайдено за вашим запитом</div>
                    )}
                </div>
                <div ref={pageRef} style={{ height: '10px' }}>
                    {isLoading && <Loader />}
                </div>
            </div>
        </div>
    );
};

export default HomePage;
