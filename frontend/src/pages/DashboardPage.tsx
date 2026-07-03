import { useState } from 'react';
import DashProfile from '../components/DashProfile';
import DashItems from '../components/DashItems';
import DashBookings from '../components/DashBookings';

type activeTabType = 'profile' | 'items' | 'bookings';

const DashboardPage = () => {
    const [activeTab, setActiveTab] = useState<activeTabType>('profile');

    return (
        <div className="dashboard-page">
            <aside>
                <button
                    className={`dashboard-page__btn ${activeTab === 'profile' ? 'active' : ''}`}
                    onClick={() => setActiveTab('profile')}
                >
                    Профіль
                </button>
                <button
                    className={`dashboard-page__btn ${activeTab === 'items' ? 'active' : ''}`}
                    onClick={() => setActiveTab('items')}
                >
                    Речі
                </button>
                <button
                    className={`dashboard-page__btn ${activeTab === 'bookings' ? 'active' : ''}`}
                    onClick={() => setActiveTab('bookings')}
                >
                    Бронювання
                </button>
            </aside>
            <div>
                {activeTab === 'profile' && <DashProfile />}
                {activeTab === 'items' && <DashItems />}
                {activeTab === 'bookings' && <DashBookings />}
            </div>
        </div>
    );
};

export default DashboardPage;
