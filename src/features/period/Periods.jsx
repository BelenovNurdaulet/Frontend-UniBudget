import {useEffect, useState} from 'react'
import {useGetPeriodsQuery} from './periodApi'
import {Card} from '@ozen-ui/kit/Card'
import {Table, TableBody, TableCell, TableHead, TableRow, TableContainer} from '@ozen-ui/kit/Table'
import {Loader} from '@ozen-ui/kit/Loader'
import {Stack} from '@ozen-ui/kit/Stack'
import {Typography} from '@ozen-ui/kit/Typography'
import {Pagination} from '@ozen-ui/kit/Pagination'
import {Select, Option} from '@ozen-ui/kit/Select'
import {SortDownIcon, SortUpIcon} from '@ozen-ui/icons'
import {Button} from '@ozen-ui/kit/ButtonNext'
import styles from './Periods.module.css'
import {Link as RouterLink} from "react-router-dom";
import getFormattedDate from "../../utils/getFormattedDate.js";

const Periods = () => {
    const [page, setPage] = useState(0)
    const [pageSize, setPageSize] = useState(10)
    const [sortField, setSortField] = useState(null)
    const [sortOrder, setSortOrder] = useState('asc')

    const {data, isLoading, isError, refetch} = useGetPeriodsQuery({PageNumber: page + 1, PageSize: pageSize})

    useEffect(() => {
        refetch()
    }, [page, pageSize, refetch])

    const handleSort = (field) => {
        if (sortField === field) {
            setSortOrder((prev) => (prev === 'asc' ? 'desc' : 'asc'))
        } else {
            setSortField(field)
            setSortOrder('asc')
        }
    }

    const SortableHeader = ({field, label}) => (
        <TableCell
            align="left"
            onClick={() => handleSort(field)}
            className={styles.clickableHeader}
            style={{cursor: 'pointer'}}
        >
      <span style={{display: 'inline-flex', alignItems: 'start', gap: 4}}>
        {label}
          {sortField === field && (sortOrder === 'asc' ? <SortDownIcon size="s" color="action"/> :
              <SortUpIcon size="s" color="action"/>)}
      </span>
        </TableCell>
    )

    if (isLoading) {
        return (
            <div className={styles.loaderWrapper}>
                <Loader size="l"/>
            </div>
        )
    }

    if (isError) {
        return (
            <div className={styles.loaderWrapper}>
                <Typography variant="text-xl" color="error">Ошибка загрузки данных</Typography>
            </div>
        )
    }

    const {items = [], totalCount = 0} = data || {}

    const sortedItems = [...items].sort((a, b) => {
        if (!sortField) return 0
        let aVal = a[sortField]
        let bVal = b[sortField]
        if (aVal === null || aVal === undefined) aVal = ''
        if (bVal === null || bVal === undefined) bVal = ''
        if (typeof aVal === 'string' && typeof bVal === 'string') {
            return sortOrder === 'asc'
                ? aVal.localeCompare(bVal)
                : bVal.localeCompare(aVal)
        }
        return sortOrder === 'asc' ? aVal - bVal : bVal - aVal
    })

    const handleEdit = (periodId) => {
        console.log('Редактировать период с ID:', periodId)
        // сюда можно вставить навигацию или модалку
    }

    return (
        <div className={styles.container}>
            <Typography variant="heading-xl">Периоды</Typography>
            <Card size="m" shadow="m" className={styles.cardWrapper}>
                <TableContainer>
                    <Table size="m" divider="row">
                        <TableHead>
                            <TableRow>
                                <SortableHeader field="id" label="ID"/>
                                <SortableHeader field="periodType" label="Тип"/>
                                <SortableHeader field="isActive" label="Активен"/>
                                <SortableHeader field="createdAt" label="Создан"/>
                                <SortableHeader field="updatedAt" label="Обновлён"/>
                                <SortableHeader field="createdBy" label="Автор"/>
                                <TableCell align="center">Действия</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {sortedItems.map((period) => (
                                <TableRow key={period.id}>
                                    <TableCell>{period.id}</TableCell>
                                    <TableCell>{period.periodType}</TableCell>
                                    <TableCell>{period.isActive ? 'Да' : 'Нет'}</TableCell>
                                    <TableCell>{getFormattedDate(period.createdAt)}</TableCell>
                                    <TableCell>{getFormattedDate(period.updatedAt)}</TableCell>
                                    <TableCell>{period.createdBy}</TableCell>
                                    <TableCell align="center">
                                        <RouterLink to={`/period/${period.id}`} className={styles.detailsLink}>
                                            Подробнее
                                        </RouterLink>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
            </Card>
            <Stack direction="row" gap="m" justify="end" align="center" className={styles.paginationWrapper}>
                <Select
                    size="s"
                    label="Кол-во записей"
                    value={pageSize}
                    onChange={(value) => setPageSize(Number(value))}
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

export default Periods
