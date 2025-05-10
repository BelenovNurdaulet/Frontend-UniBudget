import { useSelector } from 'react-redux'
import { selectUser } from '../features/auth/authSlice'
import { Navigate } from 'react-router'
import { ROLES } from '../utils/roles'

function RouteRedirect() {
    const user = useSelector(selectUser)

    if (!user) {
        return <Navigate to="/login" replace />
    }

    const roleClaim  = 'http://schemas.microsoft.com/ws/2008/06/identity/claims/role'
    const roleName   = user?.[roleClaim]      // "Administration"
    const userRole   = ROLES[roleName]

    if (userRole === ROLES.Administration) {
        return <Navigate to="/issuances" replace />
    }

    return <Navigate to="/my-issuances" replace />
}

export default RouteRedirect
