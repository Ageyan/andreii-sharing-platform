import { createContext, useContext } from 'react';

interface SearchContextType {
    searchTerm: string;
    setSearchTerm: (value: string) => void;
}

export const SearchContext = createContext<SearchContextType | null>(null);

export const useSearch = () => {
    const context = useContext(SearchContext);
    if (!context) {
        throw new Error('useSearch must be used inside SearchProvider');
    }
    return context;
};
