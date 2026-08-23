import { useState, useRef } from 'react';

import type { ItemCategory } from '../../types/items.types';
import type { SortValue, Sorts } from '../../types/items.types';
import { useOutsideClick } from '../../hooks/useOutsideClick';

import { IoIosArrowDown } from 'react-icons/io';

const sorts: Sorts[] = [
    { id: 1, title: 'Спочатку нові', sort: 'newest' },
    { id: 2, title: 'Спочатку старі', sort: 'oldest' },
    { id: 3, title: 'Спочатку дорожчі', sort: 'price-desc' },
    { id: 4, title: 'Спочатку дешевші', sort: 'price-asc' },
];

interface SortProps {
    setSearchTerm: (value: string) => void;
    setSelectCategory: (value: ItemCategory) => void;
    sortBy: SortValue;
    setSortBy: (value: SortValue) => void;
}

const SortContainer = ({ setSearchTerm, setSelectCategory, sortBy, setSortBy }: SortProps) => {
    const [isOpen, setIsOpen] = useState<boolean>(false);
    const containRef = useRef<HTMLDivElement | null>(null);
    useOutsideClick(containRef, () => setIsOpen(false));

    return (
        <div className="sort">
            <div
                className="sort__container"
                onClick={e => {
                    setIsOpen(!isOpen);
                    e.stopPropagation();
                }}
                ref={containRef}
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
                    setSearchTerm('');
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
