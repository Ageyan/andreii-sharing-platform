import { Outlet } from 'react-router-dom';
import DashProfileSidebar from '../components/dashboard/DashProfileSidebar';

const DashboardPage = () => {
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
