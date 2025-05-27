// src/routes/ProtectedRoute.jsx
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useSelector }              from 'react-redux';
import {
    selectIsAuthenticated,
    selectUser
} from '../features/auth/authSlice';

const roleClaim = 'http://schemas.microsoft.com/ws/2008/06/identity/claims/role';

const ProtectedRoute = ({ allowedRoles = [] }) => {
    const isAuthenticated = useSelector(selectIsAuthenticated);
    const user            = useSelector(selectUser);
    const location        = useLocation();

    if (!isAuthenticated) {
        return <Navigate to="/login" state={{ from: location }} replace />;
    }

    const userRole = user?.[roleClaim];

    if (!userRole || !allowedRoles.includes(userRole)) {
        return <Navigate to="/unauthorized" replace />;
    }
    return <Outlet />;
};

export default ProtectedRoute;
