import { Outlet, NavLink } from 'react-router-dom';

const DashboardPage = () => {
    return (
        <div className="dashboard">
            <div className="dashboard__container">
                <aside className="dashboard__sidebar">
                    <div className="dashboard__user-card">
                        <div className="dashboard__avatar-placeholder">A</div>
                        <h2 className="dashboard__user-name">Мій Акаунт</h2>
                    </div>
                    <nav className="dashboard__menu">
                        <NavLink
                            to="/dashboard/profile"
                            end
                            className={({ isActive }) =>
                                `dashboard__menu-btn ${isActive ? 'dashboard__menu-btn--active' : ''}`
                            }
                        >
                            <span className="dashboard__icon">👤</span> Профіль
                        </NavLink>
                        <NavLink
                            to="/dashboard/items"
                            className={({ isActive }) =>
                                `dashboard__menu-btn ${isActive ? 'dashboard__menu-btn--active' : ''}`
                            }
                        >
                            <span className="dashboard__icon">📦</span> Речі
                        </NavLink>
                        <NavLink
                            to="/dashboard/bookings"
                            className={({ isActive }) =>
                                `dashboard__menu-btn ${isActive ? 'dashboard__menu-btn--active' : ''}`
                            }
                        >
                            <span className="dashboard__icon">📅</span> Бронювання
                        </NavLink>
                    </nav>
                </aside>
                <section className="dashboard__content">
                    <div className="dashboard__card animate-fade-in">
                        <Outlet />
                    </div>
                </section>
            </div>
        </div>
    );
};

export default DashboardPage;
