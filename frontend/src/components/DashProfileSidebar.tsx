import { NavLink } from 'react-router-dom';
import { useUserInfo } from '../context/UserContext';

const DashProfileSidebar = () => {
    const { user } = useUserInfo();

    return (
        <aside className="profile-sidebar">
            <div className="profile-sidebar__user-card">
                <div className="profile-sidebar__avatar-placeholder">
                    {user?.avatar_url ? (
                        <img
                            src={user.avatar_url}
                            alt="User avatar"
                            style={{ width: '100%', height: '100%' }}
                        />
                    ) : (
                        user?.name?.charAt(0).toUpperCase() || 'U'
                    )}
                </div>
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
                    <span className="profile-sidebar__icon">👤</span>
                    <span className="profile-sidebar__title">Профіль</span>
                </NavLink>
                <NavLink
                    to="/dashboard/items"
                    className={({ isActive }) =>
                        `profile-sidebar__menu-btn ${isActive ? 'profile-sidebar__menu-btn--active' : ''}`
                    }
                >
                    <span className="profile-sidebar__icon">📦</span>
                    <span className="profile-sidebar__title">Речі</span>
                </NavLink>
                <NavLink
                    to="/dashboard/bookings"
                    className={({ isActive }) =>
                        `profile-sidebar__menu-btn ${isActive ? 'profile-sidebar__menu-btn--active' : ''}`
                    }
                >
                    <span className="profile-sidebar__icon">📅</span>
                    <span className="profile-sidebar__title">Бронювання</span>
                </NavLink>
            </nav>
        </aside>
    );
};

export default DashProfileSidebar;
