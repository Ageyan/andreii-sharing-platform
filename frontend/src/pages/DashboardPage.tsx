import { useState } from 'react';
import DashProfile from '../components/DashProfile';
import DashItems from '../components/DashItems';
import DashBookings from '../components/DashBookings';

type activeTabType = 'profile' | 'items' | 'bookings';

const DashboardPage = () => {
    const [activeTab, setActiveTab] = useState<activeTabType>('profile');

    return (
        <div className="dashboard">
            <div className="dashboard__container">
                <aside className="dashboard__sidebar">
                    <div className="dashboard__user-card">
                        <div className="dashboard__avatar-placeholder">A</div>
                        <h2 className="dashboard__user-name">Мій Акаунт</h2>
                    </div>
                    <nav className="dashboard__menu">
                        <button
                            className={`dashboard__menu-btn ${activeTab === 'profile' ? 'dashboard__menu-btn--active' : ''}`}
                            onClick={() => setActiveTab('profile')}
                        >
                            <span className="dashboard__icon">👤</span> Профіль
                        </button>
                        <button
                            className={`dashboard__menu-btn ${activeTab === 'items' ? 'dashboard__menu-btn--active' : ''}`}
                            onClick={() => setActiveTab('items')}
                        >
                            <span className="dashboard__icon">📦</span> Речі
                        </button>
                        <button
                            className={`dashboard__menu-btn ${activeTab === 'bookings' ? 'dashboard__menu-btn--active' : ''}`}
                            onClick={() => setActiveTab('bookings')}
                        >
                            <span className="dashboard__icon">📅</span> Бронювання
                        </button>
                    </nav>
                </aside>
                <section className="dashboard__content">
                    <div className="dashboard__card animate-fade-in">
                        {activeTab === 'profile' && <DashProfile />}
                        {activeTab === 'items' && <DashItems />}
                        {activeTab === 'bookings' && <DashBookings />}
                    </div>
                </section>
            </div>
        </div>
    );
};

export default DashboardPage;
