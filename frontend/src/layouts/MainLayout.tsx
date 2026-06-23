import { Outlet } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';

const MainLayout = () => {
    return (
        <div className="app-container">
            <Header />
            <main className="main-container">
                <Outlet />
            </main>
            <Footer />
        </div>
    );
};

export default MainLayout;
