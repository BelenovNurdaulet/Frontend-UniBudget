import { Button } from '@ozen-ui/kit/ButtonNext'
import { Stack } from '@ozen-ui/kit/Stack'
import { useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { selectUser } from '../../auth/authSlice'
import { useLazyGetPeriodExcelQuery } from '../periodApi'
import { saveAs } from 'file-saver'
import { DownloadFileIcon, EditIcon } from "@ozen-ui/icons"

const PeriodActions = ({ period }) => {
    const user = useSelector(selectUser)
    const navigate = useNavigate()
    const [fetchExcel] = useLazyGetPeriodExcelQuery()

    const roleClaim = 'http://schemas.microsoft.com/ws/2008/06/identity/claims/role'
    const role = user?.[roleClaim]
    const isAdmin = role === 'Administration'
    const canDownload = ['Administration', 'Finance'].includes(role)
    const handleEdit = () => navigate(`/periods/${period.id}/edit`)

    const handleDownload = async () => {
        try {
            const blob = await fetchExcel(period.id).unwrap()
            const filename = `Period_${period.name}_${new Date().toISOString()}.xlsx`
            saveAs(blob, filename)
        } catch (e) {
            console.error('Ошибка при скачивании Excel:', e)
        }
    }

    const isExecutionFinished = new Date(period.executionEndDate) < new Date()
    const showDownload = canDownload && isExecutionFinished


    return (
        <Stack direction="row" gap="s">
            {isAdmin && (
                <Button
                    color="primary"
                    size="s"
                    onClick={handleEdit}
                    iconLeft={EditIcon}
                >
                    Редактировать
                </Button>
            )}
            {showDownload && (
                <Button
                    color="primary"
                    size="s"
                    onClick={handleDownload}
                    iconLeft={DownloadFileIcon}
                >
                    Сформировать документ
                </Button>
            )}
            {canDownload && (
                <Button
                    color="primary"
                    size="s"
                    onClick={() => navigate(`/all-requests?periodId=${period.id}`)}
                    iconLeft={DownloadFileIcon}
                >
                    Просмотреть заявки
                </Button>
            )}
            <Button
                color="primary"
                size="s"
                onClick={() => navigate(`/my-requests?periodId=${period.id}`)}
                iconLeft={DownloadFileIcon}
            >
                Мои заявки
            </Button>
        </Stack>

    )
}

export default PeriodActions
