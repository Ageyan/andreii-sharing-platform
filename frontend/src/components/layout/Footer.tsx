import { useLocation } from 'react-router-dom';

const Footer = () => {
    const location = useLocation();

    const isHiddenOnMobile =
        location.pathname.includes('/items') || location.pathname.includes('/dashboard');

    return (
        <div className={`footer ${isHiddenOnMobile ? 'footer--hidden-mobile' : ''}`}>
            <div className="footer__container">
                <p className="footer__text">Sharing Platform</p>
                <p className="footer__copy">&copy; 2026 Andrey. All rights reserved.</p>
            </div>
        </div>
    );
};

export default Footer;
