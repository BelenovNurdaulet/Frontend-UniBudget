import { useSelector } from 'react-redux'
import { selectUser } from '../features/auth/authSlice'
import { Navigate } from 'react-router'
import { ROLES } from '../utils/roles'

function RouteRedirect() {
    const user = useSelector(selectUser)

    if (!user) {
        return <Navigate to="/login" replace />
    }

    const userRole = user?.userRole
    if (userRole === ROLES.Administration) {
        return <Navigate to="/issuances" replace />
    }

    return <Navigate to="/my-issuances" replace />
}

export default RouteRedirect
