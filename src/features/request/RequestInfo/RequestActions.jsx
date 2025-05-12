import { useState } from 'react'
import { useSelector } from 'react-redux'
import { selectUser } from '../../auth/authSlice'
import { useApproveRequestMutation, useManageRequestMutation } from '../requestApi'
import { REQUEST_STATUSES_CONFIG } from '../../../utils/status/statusConfig'
import { ROLES } from '../../../utils/roles'
import { useSnackbar } from '@ozen-ui/kit/Snackbar'
import { Button } from '@ozen-ui/kit/ButtonNext'
import { Dialog, DialogHeader, DialogTitle, DialogBody, DialogFooter } from '@ozen-ui/kit/Dialog'
import { Stack } from '@ozen-ui/kit/Stack'
import { Input } from '@ozen-ui/kit/Input'

const ACTION_COLORS = {
    reject: 'error',
    return: 'secondary',
    cancel: 'error',
    accept: 'primary',
    default: 'tertiary',
}

const DIALOG_BACKDROP_STYLE = {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
    backdropFilter: 'blur(4px)',
}

const DIALOG_WINDOW_STYLE = {
    maxWidth: '500px',
    width: '100%',
    margin: '0 auto',
}

const RequestActions = ({ request, onStatusChanged }) => {
    const user = useSelector(selectUser)
    const roleClaim = 'http://schemas.microsoft.com/ws/2008/06/identity/claims/role'
    const roleName = user?.[roleClaim]

    const isAdmin = roleName === 'Administration'
    const isFinance = roleName === 'Finance'

    const { requestStatus, requestId } = request
    const statusConfig = REQUEST_STATUSES_CONFIG[requestStatus]


    console.log('%c[RequestActions]', 'color: #009', {
        roleName,
        isAdmin,
        isFinance,
        requestStatus,
        statusConfig,
    })

    if (!statusConfig) return null
    const { responsibleRole, actions = [] } = statusConfig

    const canUserAct = isAdmin || roleName === responsibleRole

    console.log('%c[RequestActions::Check]', 'color: #f90', {
        responsibleRole,
        canUserAct,
        actions,
    })

    if (!canUserAct || actions.length === 0) return null

    return (
        <Stack direction="row" gap="m">
            {actions.map((action) => (
                <ActionButton
                    key={action.actionName}
                    requestId={requestId}
                    actionConfig={action}
                    useFinanceEndpoint={responsibleRole === ROLES.Finance}
                    onStatusChanged={onStatusChanged}
                />
            ))}
        </Stack>
    )
}


function ActionButton({ requestId, actionConfig, useFinanceEndpoint, onStatusChanged }) {
    const [approveRequest, { isLoading: isApproving }] = useApproveRequestMutation()
    const [manageRequest, { isLoading: isManaging }] = useManageRequestMutation()
    const { pushMessage } = useSnackbar()
    const [isDialogOpen, setIsDialogOpen] = useState(false)
    const [comment, setComment] = useState('')
    const { actionName, label, requireComment } = actionConfig

    const isLoading = isApproving || isManaging
    const buttonColor = ACTION_COLORS[actionName] || ACTION_COLORS.default

    const handleClose = () => {
        setComment('')
        setIsDialogOpen(false)
    }

    const handleSubmit = async () => {
        const trimmedComment = comment.trim()
        if (requireComment && !trimmedComment) {
            pushMessage({
                title: 'Комментарий обязателен',
                description: `Пожалуйста введите комментарий для действия "${label}"`,
                status: 'warning',
            })
            return
        }

        const payload = {
            requestId,
            action: actionName,
            comment: trimmedComment || '-',
        }

        try {
            if (useFinanceEndpoint) {
                await approveRequest(payload).unwrap()
            } else {
                await manageRequest(payload).unwrap()
            }

            pushMessage({
                title: 'Успешно',
                description: 'Статус заявки изменён',
                status: 'success',
            })
            onStatusChanged?.()
            handleClose()
        } catch (err) {
            console.error(err)
            pushMessage({
                title: 'Ошибка',
                description: err?.data?.error || 'Ошибка изменения статуса',
                status: 'error',
            })
        }
    }

    return (
        <>
            <Button
                variant="contained"
                color={buttonColor}
                size="s"
                onClick={() => setIsDialogOpen(true)}
                disabled={isLoading}
            >
                {label}
            </Button>

            <Dialog
                open={isDialogOpen}
                onClose={handleClose}
                size="l"
                variant="medium"
                backdropProps={{ style: DIALOG_BACKDROP_STYLE }}
                windowProps={{ style: DIALOG_WINDOW_STYLE }}
            >
                <DialogHeader>
                    <DialogTitle>{label}</DialogTitle>
                </DialogHeader>
                <DialogBody>
                    <Input
                        label="Комментарий"
                        value={comment}
                        onChange={(e) => setComment(e.target.value)}
                        required={requireComment}
                        placeholder={requireComment ? 'Введите комментарий (обязательно)' : 'Введите комментарий'}
                        fullWidth
                    />
                </DialogBody>
                <DialogFooter>
                    <Button variant="text" onClick={handleClose} disabled={isLoading}>
                        Отмена
                    </Button>
                    <Button variant="contained" color={buttonColor} onClick={handleSubmit} disabled={isLoading}>
                        {label}
                    </Button>
                </DialogFooter>
            </Dialog>
        </>
    )
}

export default RequestActions
