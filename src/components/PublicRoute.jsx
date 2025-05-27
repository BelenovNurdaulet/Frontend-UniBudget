import { useSelector } from 'react-redux';
import { selectIsAuthenticated, selectUser } from '../features/auth/authSlice';
import { Navigate, Outlet } from 'react-router-dom';
import { ROLES } from '../utils/rolesConfig.jsx';

const roleClaim = 'http://schemas.microsoft.com/ws/2008/06/identity/claims/role';

const PublicRoute = () => {
    const isAuthenticated = useSelector(selectIsAuthenticated);
    const user            = useSelector(selectUser);

    if (!isAuthenticated) {
        return <Outlet />;
    }

    const role = user?.[roleClaim];

    if (role === ROLES.Administration || role === ROLES.Finance) {
        return <Navigate to="/all-requests" replace />;
    }
    return <Navigate to="/my-requests" replace />;
};

export default PublicRoute;
