import { NavLink } from 'react-router-dom';

const DashProfileSidebar = () => {
    return (
        <aside className="profile-sidebar">
            <div className="profile-sidebar__user-card">
                <div className="profile-sidebar__avatar-placeholder">A</div>
                <h2 className="profile-sidebar__user-name">Мій Акаунт</h2>
            </div>
            <nav className="profile-sidebar__menu">
                <NavLink
                    to="/dashboard/profile"
                    end
                    className={({ isActive }) =>
                        `profile-sidebar__menu-btn ${isActive ? 'profile-sidebar__menu-btn--active' : ''}`
                    }
                >
                    <span className="profile-sidebar__icon">👤</span> Профіль
                </NavLink>
                <NavLink
                    to="/dashboard/items"
                    className={({ isActive }) =>
                        `profile-sidebar__menu-btn ${isActive ? 'profile-sidebar__menu-btn--active' : ''}`
                    }
                >
                    <span className="profile-sidebar__icon">📦</span> Речі
                </NavLink>
                <NavLink
                    to="/dashboard/bookings"
                    className={({ isActive }) =>
                        `profile-sidebar__menu-btn ${isActive ? 'profile-sidebar__menu-btn--active' : ''}`
                    }
                >
                    <span className="profile-sidebar__icon">📅</span> Бронювання
                </NavLink>
            </nav>
        </aside>
    );
};

export default DashProfileSidebar;
