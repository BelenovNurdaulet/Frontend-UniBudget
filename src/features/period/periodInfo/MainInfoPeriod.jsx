import { Card } from '@ozen-ui/kit/Card'
import { Typography } from '@ozen-ui/kit/Typography'
import { spacing } from '@ozen-ui/kit/MixSpacing'
import { Table, TableBody, TableCell, TableContainer, TableRow } from '@ozen-ui/kit/Table'
import getFormattedDate from "../../../utils/getFormattedDate.js";

const MainInfoPeriod = ({ period }) => {
    const {
        name,
        periodType,
        submissionStartDate,
        submissionEndDate,
        approvalStartDate,
        approvalEndDate,
        executionStartDate,
        executionEndDate,
        createdAt,
        updatedAt,
        createdBy
    } = period

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
                                <TableCell align="left" width="50%">Название:</TableCell>
                                <TableCell align="right">{name}</TableCell>
                            </TableRow>

                            <TableRow>
                                <TableCell align="left">Срок подачи:</TableCell>
                                <TableCell align="right">{getFormattedDate(submissionStartDate)} — {getFormattedDate(submissionEndDate)}</TableCell>
                            </TableRow>
                            <TableRow>
                                <TableCell align="left">Срок одобрения:</TableCell>
                                <TableCell align="right">{getFormattedDate(approvalStartDate)} — {getFormattedDate(approvalEndDate)}</TableCell>
                            </TableRow>
                            <TableRow>
                                <TableCell align="left">Срок исполнения:</TableCell>
                                <TableCell align="right">{getFormattedDate(executionStartDate)} — {getFormattedDate(executionEndDate)}</TableCell>
                            </TableRow>
                            <TableRow>
                                <TableCell align="left">Создан:</TableCell>
                                <TableCell align="right">{getFormattedDate(createdAt)}</TableCell>
                            </TableRow>
                            <TableRow>
                                <TableCell align="left">Обновлён:</TableCell>
                                <TableCell align="right">{getFormattedDate(updatedAt)}</TableCell>
                            </TableRow>
                            <TableRow>
                                <TableCell align="left">Создатель:</TableCell>
                                <TableCell align="right">{createdBy}</TableCell>
                            </TableRow>
                        </TableBody>
                    </Table>
                </TableContainer>
            </Card>
        </>
    )
}

export default MainInfoPeriod
