import { useState, type ReactNode } from 'react';
import { SearchContext } from '../context/SearchContext'; // путь к первому файлу

export const SearchProvider = ({ children }: { children: ReactNode }) => {
    const [serchTerm, setSerchTerm] = useState<string>('');

    return (
        <SearchContext.Provider value={{ serchTerm, setSerchTerm }}>
            {children}
        </SearchContext.Provider>
    );
};
