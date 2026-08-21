import { NavLink, Outlet } from 'react-router-dom';

import { useBookings } from '../../context/BookingsContext';

import Loader from '../common/Loader';
import Toast from '../common/Toast';

const DashBookings = () => {
    const { myBookings, ownerBookings, loader, error, toast, setToast } = useBookings();

    return (
        <div className="dash-bookings">
            {error && (
                <div className="error-banner">
                    <span>⚠️</span> {error}
                </div>
            )}
            {loader && <Loader />}
            {!error && !loader && (
                <div className="dash-bookings__container">
                    <nav className="dash-bookings__tabs">
                        <NavLink
                            to="/dashboard/bookings/my"
                            end
                            className={({ isActive }) =>
                                `dash-bookings__tab-btn ${isActive ? 'dash-bookings__tab-btn--active' : ''}`
                            }
                        >
                            Мої замовлення ({myBookings.length})
                        </NavLink>
                        <NavLink
                            to="/dashboard/bookings/owner"
                            end
                            className={({ isActive }) =>
                                `dash-bookings__tab-btn ${isActive ? 'dash-bookings__tab-btn--active' : ''}`
                            }
                        >
                            Запити на оренду ({ownerBookings.length})
                        </NavLink>
                    </nav>
                    <div className="dash-bookings__content">
                        <Outlet />
                    </div>
                </div>
            )}
            <Toast
                show={toast.show}
                message={toast.message}
                type={toast.type}
                onClose={() => setToast(prev => ({ ...prev, show: false }))}
            />
        </div>
    );
};

export default DashBookings;
