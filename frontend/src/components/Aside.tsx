import { useState } from 'react';
import { IoIosArrowDown } from 'react-icons/io';
import type { ItemCategory } from '../types/items.types';

type SortTitle = 'Спочатку нові' | 'Спочатку дорожчі' | 'Спочатку дешевші';
export type SortValue = 'newest' | 'price-desc' | 'price-asc';

interface SortsList {
    id: number;
    title: SortTitle;
    sort: SortValue;
}

const sorts: SortsList[] = [
    { id: 1, title: 'Спочатку нові', sort: 'newest' },
    { id: 2, title: 'Спочатку дорожчі', sort: 'price-desc' },
    { id: 3, title: 'Спочатку дешевші', sort: 'price-asc' },
];

interface AsideProps {
    setSerchTerm: (value: string) => void;
    setSelectCategory: (value: ItemCategory) => void;
    sortBy: SortValue;
    setSortBy: (value: SortValue) => void;
}

const Aside = ({ setSerchTerm, setSelectCategory, sortBy, setSortBy }: AsideProps) => {
    const [isOpen, setIsOpen] = useState<boolean>(false);

    return (
        <aside className="aside">
            <div
                className="aside__sort-container"
                onClick={e => {
                    setIsOpen(!isOpen);
                    e.nativeEvent.stopImmediatePropagation();
                }}
            >
                <span>{sorts.find(s => s.sort === sortBy)?.title}</span>
                <IoIosArrowDown className={`aside__icon ${isOpen ? 'open' : ''}`} />
                {isOpen && (
                    <div className="aside__sort-options">
                        {sorts.map(s => (
                            <div
                                key={s.id}
                                className={`aside__sort-option ${sortBy === s.sort ? 'selected' : ''}`}
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
            </div>

            <button
                className="aside__clear-btn"
                onClick={() => {
                    setSerchTerm('');
                    setSelectCategory('Усі речі');
                    setSortBy('newest');
                }}
            >
                Скинути фільтри
            </button>
        </aside>
    );
};
export default Aside;
