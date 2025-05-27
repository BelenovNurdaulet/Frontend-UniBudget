import { useState } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';

import { useActOnRequestMutation } from '../requestApi';
import { REQUEST_STATUSES_CONFIG } from '../../../utils/status/statusConfig';
import { ROLES } from '../../../utils/rolesConfig';
import { useSnackbar } from '@ozen-ui/kit/Snackbar';
import { Button } from '@ozen-ui/kit/ButtonNext';
import {
    Dialog,
    DialogHeader,
    DialogTitle,
    DialogBody,
    DialogFooter
} from '@ozen-ui/kit/Dialog';
import { Stack } from '@ozen-ui/kit/Stack';
import { Input } from '@ozen-ui/kit/Input';
import { selectUser } from '../../auth/authSlice.js';
import { useGetPeriodByIdQuery } from '../../period/periodApi.js';

const ACTION_COLORS = {
    reject: 'error',
    return: 'secondary',
    cancel: 'error',
    approve: 'primary',
    default: 'tertiary',
};

const DIALOG_BACKDROP_STYLE = {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
    backdropFilter: 'blur(4px)',
};

const DIALOG_WINDOW_STYLE = {
    maxWidth: '500px',
    width: '100%',
    margin: '0 auto',
};

const RequestActions = ({ request, onStatusChanged }) => {
    const navigate = useNavigate();
    const { pushMessage } = useSnackbar();
    const user = useSelector(selectUser);

    const roleClaim = 'http://schemas.microsoft.com/ws/2008/06/identity/claims/role';
    const nameClaim = 'http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name';

    const roleName = user?.[roleClaim];
    const userRole = ROLES[roleName];
    const userName = user?.[nameClaim];

    const {
        requestId,
        requestStatus,
        periodId,
        creatorName,
        headOfDepartmentName,
    } = request;

    const { data: period } = useGetPeriodByIdQuery(periodId);

    const now = new Date();
    const isInSubmissionPeriod = Boolean(
        period &&
        now >= new Date(period.submissionStartDate) &&
        now <= new Date(period.submissionEndDate)
    );


    const isInExecutionPeriod = Boolean(
        period &&
        now >= new Date(period.executionStartDate) &&
        now <= new Date(period.executionEndDate)
    );

    const isInApprovalPeriod = Boolean(
        period &&
        now >= new Date(period.approvalStartDate) &&
        now <= new Date(period.approvalEndDate)
    );
    const canHeadActInPeriod =
        userRole === ROLES.HeadOfDepartment &&
        (requestStatus === 'InReview' || requestStatus === 'ReturnToReviewer') &&
        isInApprovalPeriod;

    const canFinanceActInPeriod =
        userRole === ROLES.Finance &&
        requestStatus === 'Approved' &&
        isInExecutionPeriod;

    const isCreator = userName === creatorName;
    const isHead =
        userRole === ROLES.HeadOfDepartment ||
        userName === headOfDepartmentName;

    const canEdit =
        (isInSubmissionPeriod && isCreator) ||
        (requestStatus === 'ReturnToCreator' && isCreator) ||
        (requestStatus === 'ReturnToReviewer' && isHead);


    const statusConfig = REQUEST_STATUSES_CONFIG[requestStatus];
    const actions = statusConfig?.actions || [];
    //   const responsibleRole = statusConfig?.responsibleRole;

    const canUserAct =
        (userRole === ROLES.Administration ||
            canHeadActInPeriod ||
            canFinanceActInPeriod) &&
        actions.length > 0;

    const [actOnRequest, { isLoading: isActing }] = useActOnRequestMutation();

    const [activeAction, setActiveAction] = useState(null);
    const [comment, setComment] = useState('');

    const openDialog = (action) => {
        setActiveAction(action);
        setComment('');
    };
    const closeDialog = () => {
        setActiveAction(null);
        setComment('');
    };

    const handleSubmit = async () => {
        const trimmed = comment.trim();
        if (activeAction.requireComment && !trimmed) {
            pushMessage({
                title: 'Комментарий обязателен',
                description: `Пожалуйста введите комментарий для действия "${activeAction.label}"`,
                status: 'warning',
            });
            return;
        }

        const payload = {
            requestId,
            action: activeAction.actionName,
            comment: trimmed || '-',
            requestStatus,
        };

        try {
            await actOnRequest(payload).unwrap();
            pushMessage({
                title: 'Успешно',
                description: 'Статус заявки изменён',
                status: 'success',
            });
            onStatusChanged?.();
            closeDialog();
        } catch (err) {
            console.error(err);
            pushMessage({
                title: 'Ошибка',
                description: err?.data?.error || 'Ошибка изменения статуса',
                status: 'error',
            });
        }
    };

    return (
        <Stack direction="row" gap="m">
            {canEdit && (
                <Button
                    variant="contained"
                    color="primary"
                    size="s"
                    onClick={() => navigate(`/edit-request/${requestId}`)}
                >
                    Редактировать заявку
                </Button>
            )}

            {canUserAct &&
                actions.map((action) => {
                    const color = ACTION_COLORS[action.actionName] || ACTION_COLORS.default;
                    return (
                        <Button
                            key={action.actionName}
                            variant="contained"
                            color={color}
                            size="s"
                            onClick={() => openDialog(action)}
                            disabled={isActing}
                        >
                            {action.label}
                        </Button>
                    );
                })}

            {activeAction && (
                <Dialog
                    open
                    onClose={closeDialog}
                    size="l"
                    variant="medium"
                    backdropProps={{ style: DIALOG_BACKDROP_STYLE }}
                    windowProps={{ style: DIALOG_WINDOW_STYLE }}
                >
                    <DialogHeader>
                        <DialogTitle>{activeAction.label}</DialogTitle>
                    </DialogHeader>
                    <DialogBody>
                        <Input
                            label="Комментарий"
                            value={comment}
                            onChange={(e) => setComment(e.target.value)}
                            required={activeAction.requireComment}
                            placeholder={
                                activeAction.requireComment
                                    ? 'Введите комментарий (обязательно)'
                                    : 'Введите комментарий'
                            }
                            fullWidth
                        />
                    </DialogBody>
                    <DialogFooter>
                        <Button variant="text" onClick={closeDialog}>
                            Отмена
                        </Button>
                        <Button
                            variant="contained"
                            onClick={handleSubmit}
                            disabled={isActing}
                        >
                            {activeAction.label}
                        </Button>
                    </DialogFooter>
                </Dialog>
            )}
        </Stack>
    );
};

export default RequestActions;
