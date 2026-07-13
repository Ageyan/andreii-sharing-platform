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

interface SortProps {
    setSerchTerm: (value: string) => void;
    setSelectCategory: (value: ItemCategory) => void;
    sortBy: SortValue;
    setSortBy: (value: SortValue) => void;
}

const SortContainer = ({ setSerchTerm, setSelectCategory, sortBy, setSortBy }: SortProps) => {
    const [isOpen, setIsOpen] = useState<boolean>(false);

    return (
        <div className="sort">
            <div
                className="sort__container"
                onClick={e => {
                    setIsOpen(!isOpen);
                    e.stopPropagation();
                }}
            >
                <span>{sorts.find(s => s.sort === sortBy)?.title}</span>
                <IoIosArrowDown className={`sort__icon ${isOpen ? 'sort__icon--open' : ''}`} />
                {isOpen && (
                    <div className="sort__options">
                        {sorts.map(s => (
                            <div
                                key={s.id}
                                className={`sort__option ${sortBy === s.sort ? 'sort__option--selected' : ''}`}
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
                className="sort__clear-btn"
                onClick={() => {
                    setSerchTerm('');
                    setSelectCategory('Усі речі');
                    setSortBy('newest');
                }}
            >
                Скинути фільтри
            </button>
        </div>
    );
};
export default SortContainer;
