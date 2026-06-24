import { Link, useNavigate } from 'react-router-dom';

const Header = () => {
    const isAuthenticated = !!localStorage.getItem('token');
    const navigate = useNavigate();

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
                {isAuthenticated ? (
                    <div className="header__nav">
                        <Link className="header__nav--link" to="/">
                            Головна
                        </Link>
                        <Link className="header__nav--link" to="/dashboard">
                            Особистий кабінет
                        </Link>
                        <button onClick={handleLogout}>Вихід</button>
                    </div>
                ) : (
                    <div className="header__nav">
                        <Link className="header__nav--link" to="/">
                            Головна
                        </Link>
                        <Link className="header__nav--link" to="/auth">
                            Увійти
                        </Link>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Header;
