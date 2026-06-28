import { useSearch } from '../context/SearchContext';
import { BsSearch } from 'react-icons/bs';

const SearchInput = () => {
    const { serchTerm, setSerchTerm } = useSearch();

    const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
        setSerchTerm(event.target.value);
    };

    return (
        <div className="input-container">
            <BsSearch className="input-container__icon" />
            <input
                className="input-container__field"
                type="text"
                value={serchTerm}
                onChange={handleSearch}
                placeholder="Введіть назву товару..."
            />
        </div>
    );
};

export default SearchInput;
