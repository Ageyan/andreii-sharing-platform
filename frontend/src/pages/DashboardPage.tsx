import { Outlet } from 'react-router-dom';
import DashProfileSidebar from '../components/DashProfileSidebar';
import { useEffect } from 'react';

const DashboardPage = () => {
    useEffect(() => {
        const container = document.querySelector('.app-container');

        container!.classList.add('has-mobile-padding');

        return () => container!.classList.remove('has-mobile-padding');
    }, []);

    return (
        <div className="dashboard">
            <div className="dashboard__container">
                <div className="dashboard__desktop-sidebar">
                    <DashProfileSidebar />
                </div>
                <section className="dashboard__content">
                    <div className="dashboard__card animate-fade-in">
                        <Outlet />
                    </div>
                </section>
            </div>
            <div className="dashboard__mobile-sidebar">
                <DashProfileSidebar />
            </div>
        </div>
    );
};

export default DashboardPage;
