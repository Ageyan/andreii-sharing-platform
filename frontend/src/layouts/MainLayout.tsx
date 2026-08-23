import { useEffect } from 'react';
import { Outlet, useLocation } from 'react-router-dom';

import Header from '../components/layout/Header';
import Footer from '../components/layout/Footer';
import AiChat from '../components/common/AiChat';

const MainLayout = () => {
    const location = useLocation();

    useEffect(() => {
        document.body.classList.remove('page-home', 'page-dashboard');

        if (location.pathname === '/' || location.pathname === '/auth') {
            document.body.classList.add('page-home-auth');
        } else if (location.pathname.startsWith('/dashboard')) {
            document.body.classList.add('page-dashboard');
        }
    }, [location.pathname]);

    return (
        <div className="app-container">
            <Header />
            <main className="main-container">
                <Outlet />
            </main>
            <AiChat />
            <Footer />
        </div>
    );
};

export default MainLayout;
