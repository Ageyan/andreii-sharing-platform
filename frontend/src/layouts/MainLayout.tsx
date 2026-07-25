import { Outlet } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';
import AiChat from '../components/AiChat';

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
