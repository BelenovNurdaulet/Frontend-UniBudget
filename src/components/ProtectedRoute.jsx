import { Navigate, Outlet, useLocation } from 'react-router'
import { useSelector } from 'react-redux'
import { selectIsAuthenticated, selectUser } from '../features/auth/authSlice'
import {ROLES} from "../utils/roles.jsx";



const ProtectedRoute = ({ allowedRoles }) => {
    const user = useSelector(selectUser)
    const isAuthenticated = useSelector(selectIsAuthenticated)
    const location = useLocation()



    if (!isAuthenticated) {
        return <Navigate to="/login" state={{ from: location }} replace />
    }

    const roleClaim  = 'http://schemas.microsoft.com/ws/2008/06/identity/claims/role'
    const roleName   = user?.[roleClaim]      // "Administration"
    const userRole   = ROLES[roleName]


    if (userRole === undefined || !allowedRoles.includes(userRole)) {
        return <Navigate to="/unauthorized" replace />
    }



    return <Outlet />
}

export default ProtectedRoute
