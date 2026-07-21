import { Link, useLocation, useNavigate } from 'react-router-dom';
import SearchInput from './SearchInput';
import { BsSearch } from 'react-icons/bs';
import { useState } from 'react';

interface TawkWindow extends Window {
    Tawk_API?: {
        hideWidget?: () => void;
        showWidget?: () => void;
        onLoad?: () => void;
        [key: string]: unknown;
    };
    Tawk_LoadStart?: Date;
}

const Header = () => {
    const [isSearchOpen, setIsSearchOpen] = useState<boolean>(false);
    const isAuthenticated = !!localStorage.getItem('token');
    const navigate = useNavigate();
    const location = useLocation();

    const isHomePage = location.pathname === '/';
    const isPersonalAccount = location.pathname.startsWith('/dashboard');

    const handleLogout = () => {
        localStorage.removeItem('token');

        const tawkWindow = window as unknown as TawkWindow;
        if (tawkWindow.Tawk_API && typeof tawkWindow.Tawk_API.endChat === 'function') {
            try {
                tawkWindow.Tawk_API.endChat();
            } catch (error) {
                console.error('Помилка при завершенні сесії чату:', error);
            }
        }

        navigate('/');
    };

    return (
        <div className="header">
            <div className="header__container">
                <Link to="/" className="header__logo">
                    <span>Sharing Platform</span>
                </Link>
                {isHomePage && (
                    <div className="header__desktop-search">
                        <SearchInput />
                    </div>
                )}
                <div className="header__nav">
                    {isHomePage && (
                        <BsSearch
                            className={`header__nav--search-icon ${isSearchOpen ? 'header__nav--search-icon--active' : ''}`}
                            onClick={() => setIsSearchOpen(!isSearchOpen)}
                        />
                    )}
                    {!isHomePage && (
                        <Link className="header__nav--link" to="/">
                            Головна
                        </Link>
                    )}
                    {isAuthenticated ? (
                        <>
                            {!isPersonalAccount && (
                                <Link className="header__nav--link" to="/dashboard/profile">
                                    Особистий кабінет
                                </Link>
                            )}
                            <button className="header__btn-logout" onClick={handleLogout}>
                                Вихід
                            </button>
                        </>
                    ) : (
                        <>
                            <Link className="header__nav--link" to="/auth">
                                Увійти
                            </Link>
                        </>
                    )}
                </div>
            </div>

            {isHomePage && isSearchOpen && (
                <div className="header__mobile-search">
                    <SearchInput />
                </div>
            )}
        </div>
    );
};

export default Header;
