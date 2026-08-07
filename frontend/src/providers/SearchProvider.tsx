import { useState, type ReactNode } from 'react';
import { SearchContext } from '../context/SearchContext';

export const SearchProvider = ({ children }: { children: ReactNode }) => {
    const [searchTerm, setSearchTerm] = useState<string>('');
    const [page, setPage] = useState<number>(1);

    return (
        <SearchContext.Provider value={{ searchTerm, setSearchTerm, page, setPage }}>
            {children}
        </SearchContext.Provider>
    );
};
