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

import dayjs from 'dayjs'
import getFormattedDate from "../../../utils/getFormattedDate.js";

const PeriodHistory = ({ periodHistories = true }) => {
    if (!Array.isArray(periodHistories) || periodHistories.length === 0) {
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

    const sortedAsc = [...periodHistories].sort((a, b) => dayjs(a.periodDateTime).diff(dayjs(b.periodDateTime)))

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
                                <TableCell align="left" verticalAlign="middle" width="5%">№</TableCell>
                                <TableCell align="left" verticalAlign="middle">Дата события</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {sortedAsc.map((item, index) => (
                                <TableRow key={item.id}>
                                    <TableCell verticalAlign="middle">
                                        <Typography variant="text-s">{index + 1}</Typography>
                                    </TableCell>
                                    <TableCell verticalAlign="middle">
                                        <Typography variant="text-s">{getFormattedDate(item.periodDateTime)}</Typography>
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

export default PeriodHistory
