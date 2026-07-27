import { Link, useLocation, useNavigate } from 'react-router-dom';
import SearchInput from './SearchInput';
import { BsSearch } from 'react-icons/bs';
import { useState } from 'react';
import { MdAccountCircle } from 'react-icons/md';
import { useUserInfo } from '../context/UserContext';

const Header = () => {
    const [isSearchOpen, setIsSearchOpen] = useState<boolean>(false);
    const isAuthenticated = !!localStorage.getItem('token');
    const navigate = useNavigate();
    const location = useLocation();
    const { user } = useUserInfo();

    const isHomePage = location.pathname === '/';
    const isPersonalAccount = location.pathname.startsWith('/dashboard');

    const handleLogout = () => {
        localStorage.removeItem('token');

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
                                    <span className="header__nav--text">Особистий кабінет</span>
                                    {user?.avatar_url ? (
                                        <div className="header__nav--avatar-placeholder">
                                            <img
                                                src={user.avatar_url}
                                                alt="User avatar"
                                                style={{ width: '100%', height: '100%' }}
                                            />
                                        </div>
                                    ) : (
                                        <MdAccountCircle className="header__nav--icon" />
                                    )}
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
