import { useState, useRef } from 'react';
import { useSearch } from '../context/SearchContext';
import { BsSearch } from 'react-icons/bs';

const SearchInput = () => {
    const { searchTerm, setSearchTerm, setPage } = useSearch();
    const [inputValue, setInputValue] = useState(searchTerm);

    const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

    const [prevSearch, setPrevSearch] = useState(searchTerm);

    if (searchTerm !== prevSearch) {
        setPrevSearch(searchTerm);
        setInputValue(searchTerm);
    }

    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const newValue = event.target.value;

        setInputValue(newValue);

        if (timerRef.current) {
            clearTimeout(timerRef.current);
        }

        timerRef.current = setTimeout(() => {
            setSearchTerm(newValue);
            setPage(1);
        }, 500);
    };

    return (
        <div className="input-container">
            <BsSearch className="input-container__icon" />
            <input
                className="input-container__field"
                type="text"
                value={inputValue}
                onChange={handleChange}
                placeholder="Введіть назву товару..."
            />
        </div>
    );
};

export default SearchInput;
