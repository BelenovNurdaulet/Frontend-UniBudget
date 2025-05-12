import { useGetRequestsQuery } from './requestApi'
import { useGetPeriodsQuery } from '../period/periodApi'
import { Typography } from '@ozen-ui/kit/Typography'
import {
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
} from '@ozen-ui/kit/Table'
import {  useState } from 'react'
import { Card } from '@ozen-ui/kit/Card'
import { Pagination } from '@ozen-ui/kit/Pagination'

import { Stack } from '@ozen-ui/kit/Stack'
import { spacing } from '@ozen-ui/kit/MixSpacing'
import styles from './AllRequestsTable.module.css'
import { Link as RouterLink } from 'react-router-dom'
import { Select, Option } from '@ozen-ui/kit/Select'
import getFormattedDate from "../../utils/getFormattedDate.js";

const AllRequestsTable = () => {
    const [page, setPage] = useState(0)
    const [pageSize, setPageSize] = useState(10)

    const [selectedPeriodId, setSelectedPeriodId] = useState('')

    const { data: periodsData, isLoading: isPeriodsLoading } = useGetPeriodsQuery({ PageNumber: 1, PageSize: 100})
    const { data } = useGetRequestsQuery({
        PageNumber: page + 1,
        PageSize: pageSize,
        PeriodId: selectedPeriodId ? Number(selectedPeriodId) : undefined,
    })

    const periods = Array.isArray(periodsData?.items)
        ? periodsData.items
        : []
    const { requests = [], totalCount = 0 } = data || {}


    return (
        <div className={styles.container}>
            <Typography className={spacing({ mb: 's' })} variant="heading-xl">
                Все заявки
            </Typography>

            <Stack direction="row" gap="s" align="center" style={{ maxWidth: 300 }}>
                <Select
                    label="Бюджетный период"
                    placeholder={isPeriodsLoading ? 'Загрузка периодов...' : 'Выберите период'}
                    value={selectedPeriodId}
                    onChange={(val) => setSelectedPeriodId(val)}
                    fullWidth
                    renderValue={() => {
                        const selected = periods.find((p) => String(p.id) === selectedPeriodId)
                        return selected
                            ? `Период №${selected.id} — ${selected.createdAt.slice(0,10).split('-').reverse().join('.')}`
                            : ''
                    }}
                >
                    {periods.length > 0 ? (
                        periods.map((period) => (
                            <Option key={period.id} value={String(period.id)}>
                                Период №{period.id} — {period.createdAt.slice(0,10).split('-').reverse().join('.')}
                            </Option>
                        ))
                    ) : (
                        <Option disabled value="">
                            {isPeriodsLoading ? 'Загрузка...' : 'Нет доступных периодов'}
                        </Option>
                    )}
                </Select>

            </Stack>

            <Card className={styles.cardWrapper}>
                <TableContainer>
                    <Table size="s" striped fullWidth divider="row">
                        <TableHead>
                            <TableRow>
                                <TableCell>ID</TableCell>
                                <TableCell>Заголовок</TableCell>
                                <TableCell>Описание</TableCell>
                                <TableCell>Сумма</TableCell>
                                <TableCell>Дата создания</TableCell>
                                <TableCell></TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {requests.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={6} align="center">
                                        Нет заявок
                                    </TableCell>
                                </TableRow>
                            ) : (
                                requests.map((item) => (
                                    <TableRow key={item.id}>
                                        <TableCell className={styles.tableCell}>{item.id}</TableCell>
                                        <TableCell className={styles.tableCell}>{item.title}</TableCell>
                                        <TableCell className={styles.tableCell}>{item.description}</TableCell>
                                        <TableCell className={styles.tableCell}>{item.amount}</TableCell>
                                        <TableCell className={styles.tableCell}>{getFormattedDate(item.createdAt)}</TableCell>
                                        <TableCell className={styles.tableCell}>
                                            <RouterLink to={`/request/${item.id}`} className={styles.detailsLink}>
                                                Подробнее
                                            </RouterLink>
                                        </TableCell>
                                    </TableRow>
                                ))
                            )}
                        </TableBody>
                    </Table>
                </TableContainer>
            </Card>

            <Stack direction="row" gap="m" justify="end" align="center" className={styles.paginationWrapper}>
                <Select
                    size="s"
                    label="Кол-во записей"
                    value={pageSize}
                    onChange={(value) => {
                        setPageSize(Number(value))
                        setPage(0) // сбрасываем страницу при смене размера
                    }}
                >
                    <Option value={10}>10</Option>
                    <Option value={20}>20</Option>
                    <Option value={50}>50</Option>
                    <Option value={100}>100</Option>
                </Select>

                <Pagination
                    page={page}
                    pageSize={pageSize}
                    totalCount={totalCount}
                    onPageChange={(newPage) => setPage(newPage)}
                    size="s"
                />
            </Stack>

        </div>
    )
}

export default AllRequestsTable
