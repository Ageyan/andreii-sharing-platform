import { Link, useNavigate } from 'react-router-dom';

const Header = () => {
    const isAuthenticated = !!localStorage.getItem('token');
    const navigate = useNavigate();

    const handleLogout = () => {
        localStorage.removeItem('token');
        navigate('/auth');
    };

    return (
        <div className="header">
            <div className="header__container">
                <Link to="/">
                    <span>Sharing Platform</span>
                </Link>
                {isAuthenticated ? (
                    <div className="header__nav">
                        <Link to="/dashboard">Особистий кабінет</Link>
                        <button onClick={handleLogout}>Вихід</button>
                    </div>
                ) : (
                    <div className="header__nav">
                        <Link to="/auth">Увійти</Link>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Header;
