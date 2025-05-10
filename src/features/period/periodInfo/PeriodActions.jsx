import { Button } from '@ozen-ui/kit/ButtonNext'
import { useSelector } from 'react-redux'


import { useNavigate } from 'react-router-dom'
import {selectUser} from "../../auth/authSlice.js";

const PeriodActions = ({ period }) => {
    const user = useSelector(selectUser)
    const navigate = useNavigate()

    const roleClaim = 'http://schemas.microsoft.com/ws/2008/06/identity/claims/role'
    const roleName = user?.[roleClaim]
    const isAdmin = roleName === 'Administration'

    if (!isAdmin) return null

    const handleEdit = () => {
        navigate(`/period/${period.id}/edit`)
    }

    return (
        <Button variant="contained" color="primary" onClick={handleEdit} size="s">
            Редактировать
        </Button>
    )
}

export default PeriodActions