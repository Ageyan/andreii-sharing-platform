import { useEffect } from 'react';
import { Outlet, useLocation } from 'react-router-dom';

import { useScrollToTop } from '../hooks/useScrollToTop';

import Header from '../components/layout/Header';
import Footer from '../components/layout/Footer';
import AiChat from '../components/common/AiChat';

const MainLayout = () => {
    useScrollToTop();
    const location = useLocation();

    useEffect(() => {
        document.body.classList.remove('mobile-bg-accent', 'mobile-bg-main');

        if (location.pathname === '/' || location.pathname === '/auth') {
            document.body.classList.add('mobile-bg-accent');
        } else if (
            location.pathname.startsWith('/dashboard') ||
            location.pathname.startsWith('/items')
        ) {
            document.body.classList.add('mobile-bg-main');
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
