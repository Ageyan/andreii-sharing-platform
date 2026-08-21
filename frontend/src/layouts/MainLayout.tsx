import { Outlet } from 'react-router-dom';
import Header from '../components/layout/Header';
import Footer from '../components/layout/Footer';
import AiChat from '../components/common/AiChat';

const MainLayout = () => {
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
