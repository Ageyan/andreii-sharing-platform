import { useSearch } from '../context/SearchContext';
import { BsSearch } from 'react-icons/bs';

const SearchInput = () => {
    const { searchTerm, setSearchTerm } = useSearch();

    const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
        setSearchTerm(event.target.value);
    };

    return (
        <div className="input-container">
            <BsSearch className="input-container__icon" />
            <input
                className="input-container__field"
                type="text"
                value={searchTerm}
                onChange={handleSearch}
                placeholder="Введіть назву товару..."
            />
        </div>
    );
};

export default SearchInput;
