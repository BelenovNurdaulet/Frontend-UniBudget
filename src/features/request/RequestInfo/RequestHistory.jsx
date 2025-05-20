import { Card } from '@ozen-ui/kit/Card'
import {
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
} from '@ozen-ui/kit/Table'
import { Typography } from '@ozen-ui/kit/Typography'
import getFormattedDate from '../../../../../Frontend/src/utils/getFormattedDate'
import dayjs from 'dayjs'
import {REQUEST_STATUSES_CONFIG} from "../../../utils/status/statusConfig.js";

const RequestHistory = ({ historyList }) => {
    if (!Array.isArray(historyList) || historyList.length === 0) {
        return (
            <>
                <Typography variant="heading-l" style={{ marginBottom: '0.5rem' }}>
                    История
                </Typography>
                <Card size="s" style={{ marginBottom: '1rem', padding: '1rem' }} shadow="m">
                    <Typography variant="text-s">История пуста</Typography>
                </Card>
            </>
        )
    }

    const sortedAsc = [...historyList].sort((a, b) => dayjs(a.requestDate).diff(dayjs(b.requestDate)))
    const processedHistory = sortedAsc.map((current, i) => {
        return {
            ...current,
            stepNumber: i + 1,
            endDate: current.requestDate,
        }
    })

    return (
        <>
            <Typography variant="heading-l" style={{ marginBottom: '0.5rem' }}>
                История
            </Typography>
            <Card size="s" style={{ marginBottom: '1rem', padding: '1rem' }} shadow="m">
                <TableContainer>
                    <Table size="s" fullWidth striped compressed divider="row">
                        <TableHead>
                            <TableRow>
                                <TableCell align="left" width="5%">№</TableCell>
                                <TableCell align="left" width="50%">Дата изменения</TableCell>
                                <TableCell align="left" width="45%">Статус</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {processedHistory.map((item) => (
                                <TableRow key={item.id}>
                                    <TableCell>{item.stepNumber}</TableCell>
                                    <TableCell>{getFormattedDate(item.endDate)}</TableCell>
                                    <TableCell>
                                        {REQUEST_STATUSES_CONFIG[item.requestStatus]?.name || item.requestStatus}
                                    </TableCell>

                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
            </Card>
        </>
    )
}

export default RequestHistory