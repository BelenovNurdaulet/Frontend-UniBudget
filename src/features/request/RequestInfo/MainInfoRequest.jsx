import { Card } from '@ozen-ui/kit/Card'
import { Typography } from '@ozen-ui/kit/Typography'
import { spacing } from '@ozen-ui/kit/MixSpacing'
import { Table, TableBody, TableCell, TableContainer, TableRow } from '@ozen-ui/kit/Table'

const MainInfoRequest = ({ request }) => {
    const {
        title,
        description,
        amount,
        branchId,
        creatorName,
        headOfDepartmentName,
        financeHandlerName,
        comment,
    } = request

    return (
        <>
            <Typography
                variant="heading-l"
                className={spacing({ mb: 's' })}
                style={{ marginLeft: '0.5rem' }}
            >
                Основная информация
            </Typography>

            <Card size="s" shadow="m" style={{ padding: '1rem' }} className={spacing({ mb: 's' })}>
                <TableContainer>
                    <Table size="s" striped divider="row" fullWidth>
                        <TableBody>
                            <TableRow>
                                <TableCell align="left" width="50%">
                                    Заголовок:
                                </TableCell>
                                <TableCell align="right">{title || '—'}</TableCell>
                            </TableRow>
                            <TableRow>
                                <TableCell align="left">Описание:</TableCell>
                                <TableCell align="right">{description || '—'}</TableCell>
                            </TableRow>
                            <TableRow>
                                <TableCell align="left">Сумма:</TableCell>
                                <TableCell align="right">{amount != null ? amount : '—'}</TableCell>
                            </TableRow>
                            <TableRow>
                                <TableCell align="left">Филиал (ID):</TableCell>
                                <TableCell align="right">{branchId || '—'}</TableCell>
                            </TableRow>
                            <TableRow>
                                <TableCell align="left">Создатель:</TableCell>
                                <TableCell align="right">{creatorName || '—'}</TableCell>
                            </TableRow>
                            <TableRow>
                                <TableCell align="left">Руководитель отдела:</TableCell>
                                <TableCell align="right">{headOfDepartmentName || '—'}</TableCell>
                            </TableRow>
                            <TableRow>
                                <TableCell align="left">Финансист:</TableCell>
                                <TableCell align="right">{financeHandlerName || '—'}</TableCell>
                            </TableRow>
                            {comment && (
                                <TableRow>
                                    <TableCell align="left">Комментарий:</TableCell>
                                    <TableCell align="right">{comment}</TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </TableContainer>
            </Card>
        </>
    )
}

export default MainInfoRequest