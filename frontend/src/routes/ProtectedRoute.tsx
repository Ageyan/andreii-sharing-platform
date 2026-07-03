import { Navigate, useLocation } from 'react-router-dom';
import type { JSX } from 'react/jsx-runtime';

const ProtectedRoute = ({ children }: { children: JSX.Element }) => {
    const isAuthenticated = !!localStorage.getItem('token');
    const location = useLocation();

    if (!isAuthenticated) {
        return <Navigate to="/auth" state={{ from: location.pathname }} replace />;
    }

    return children;
};

export default ProtectedRoute;
