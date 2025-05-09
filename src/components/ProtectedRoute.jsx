import { Navigate, Outlet, useLocation } from 'react-router'
import { useSelector } from 'react-redux'
import { selectIsAuthenticated, selectUser } from '../features/auth/authSlice'



const ProtectedRoute = ({ allowedRoles }) => {
    const user = useSelector(selectUser)
    const isAuthenticated = useSelector(selectIsAuthenticated)
    const location = useLocation()



    if (!isAuthenticated) {
        return <Navigate to="/login" state={{ from: location }} replace />
    }

    const userRole = user?.userRole
    if (!userRole || !allowedRoles.includes(userRole)) {
        return <Navigate to="/unauthorized" replace />
    }



    return <Outlet />
}

export default ProtectedRoute
