import { useState, type ReactNode } from 'react';
import { SearchContext } from '../context/SearchContext'; // путь к первому файлу

export const SearchProvider = ({ children }: { children: ReactNode }) => {
    const [searchTerm, setSearchTerm] = useState<string>('');

    return (
        <SearchContext.Provider value={{ searchTerm, setSearchTerm }}>
            {children}
        </SearchContext.Provider>
    );
};
