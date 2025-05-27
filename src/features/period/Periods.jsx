import { useEffect, useState } from 'react';
import { useGetPeriodsQuery } from './periodApi';
import { Card } from '@ozen-ui/kit/Card';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableRow,
    TableContainer,
} from '@ozen-ui/kit/Table';
import { Loader } from '@ozen-ui/kit/Loader';
import { Stack } from '@ozen-ui/kit/Stack';
import { Typography } from '@ozen-ui/kit/Typography';
import { Pagination } from '@ozen-ui/kit/Pagination';
import { Select, Option } from '@ozen-ui/kit/Select';
import { Input } from '@ozen-ui/kit/Input';
import { DatePicker } from '@ozen-ui/kit/DatePicker';
import {
    CheckCircleColoredIcon,
    ErrorCircleColoredIcon,
    PlasticCardAddIcon,
    SortDownIcon,
    SortUpIcon
} from '@ozen-ui/icons';
import styles from './Periods.module.css';
import { Link as RouterLink } from 'react-router-dom';
import getFormattedDate from '../../utils/getFormattedDate';
import {spacing} from "@ozen-ui/kit/MixSpacing";
import {Grid, GridItem} from "@ozen-ui/kit/Grid";
import {Button} from "@ozen-ui/kit/ButtonNext";
import {useNavigate} from "react-router";


const Periods = () => {
    const navigate = useNavigate();
    const [page, setPage] = useState(0);
    const [pageSize, setPageSize] = useState(10);
    const [sortField, setSortField] = useState(null);
    const [sortOrder, setSortOrder] = useState('asc');

    const [searchName, setSearchName] = useState('');
    const [startDate, setStartDate] = useState(null);
    const [endDate, setEndDate] = useState(null);

    const { data, isLoading, isError, refetch } = useGetPeriodsQuery({
        PageNumber: page + 1,
        PageSize: pageSize,
        IsActive: true
    });

    useEffect(() => {
        refetch();
    }, [page, pageSize, refetch]);

    const handleSort = (field) => {
        if (sortField === field) {
            setSortOrder((prev) => (prev === 'asc' ? 'desc' : 'asc'));
        } else {
            setSortField(field);
            setSortOrder('asc');
        }
    };

    const SortableHeader = ({ field, label }) => (
        <TableCell
            align="left"
            onClick={() => handleSort(field)}
            className={styles.clickableHeader}
            style={{ cursor: 'pointer' }}
        >
      <span style={{ display: 'inline-flex', alignItems: 'start', gap: 4 }}>
        {label}
          {sortField === field &&
              (sortOrder === 'asc' ? (
                  <SortDownIcon size="s" color="action" />
              ) : (
                  <SortUpIcon size="s" color="action" />
              ))}
      </span>
        </TableCell>
    );

    if (isLoading) {
        return (
            <div className={styles.loaderWrapper}>
                <Loader size="l" />
            </div>
        );
    }

    if (isError) {
        return (
            <div className={styles.loaderWrapper}>
                <Typography variant="text-xl" color="error">
                    Ошибка загрузки данных
                </Typography>
            </div>
        );
    }

    const { items = [], totalCount = 0 } = data || {};

    const sortedItems = [...items].sort((a, b) => {
        if (!sortField) return 0;
        let aVal = a[sortField];
        let bVal = b[sortField];
        if (aVal === null || aVal === undefined) aVal = '';
        if (bVal === null || bVal === undefined) bVal = '';
        if (typeof aVal === 'string' && typeof bVal === 'string') {
            return sortOrder === 'asc'
                ? aVal.localeCompare(bVal)
                : bVal.localeCompare(aVal);
        }
        return sortOrder === 'asc' ? aVal - bVal : bVal - aVal;
    });

    return (
        <div >
            <Grid cols={2} align="start" className={spacing({ mb: 'l' })}>
            <Grid cols={1}>
                    <GridItem>
                        <Typography variant="heading-xl" className={spacing({ mb: 'm' })}>
                            Бюджетные периоды
                        </Typography>

                    </GridItem>
                </Grid>
                <Grid cols={1} justify="end">
                    <GridItem row={1}>
                        <Button
                            variant="contained"
                            size="s"
                            color="primary"
                            onClick={() => navigate('/create-period')}
                            iconLeft={PlasticCardAddIcon}
                        >
                            Создать бюджетный период
                        </Button>
                    </GridItem>
                </Grid>
            </Grid>



            <Card size="m" shadow="m">

                <Stack
                    direction="row"
                    gap="m"
                    align="end"
                    justify="spaceBetween"
                    fullWidth
                    style={{ marginBottom: 16, flexWrap: 'wrap' }}
                >
                    <Input
                        label="Поиск по названию"
                        value={searchName}
                        onChange={(e) => setSearchName(e.target.value)}
                        style={{ flex: '1 1 60%' }}
                    />
                    <Stack direction="row" gap="m" align="end" style={{ flex: '1 1 35%', minWidth: 280 }}>
                        <DatePicker
                            label="Дата начала"
                            value={startDate}
                            onChange={setStartDate}
                            fullWidth
                        />
                        <DatePicker
                            label="Дата окончания"
                            value={endDate}
                            onChange={setEndDate}
                            fullWidth
                        />
                    </Stack>
                </Stack>

                <TableContainer height="500px">
                    <Table size="m" divider="row" stickyHeader striped fullWidth>
                        <TableHead>
                            <TableRow>
                                <SortableHeader field="id" label="ID" />
                                <SortableHeader field="periodType" label="Название" />
                                <SortableHeader field="isActive" label="Автор" />
                                <SortableHeader field="createdAt" label="Создан" />
                                <SortableHeader field="updatedAt" label="Обновлён" />
                                <SortableHeader field="createdBy" label="Активен" />
                                <TableCell align="center"></TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {sortedItems.map((period) => (
                                <TableRow key={period.id}>
                                    <TableCell>{period.id}</TableCell>
                                    <TableCell>{period.name}</TableCell>
                                    <TableCell>{period.createdBy}</TableCell>
                                    <TableCell>{getFormattedDate(period.createdAt)}</TableCell>
                                    <TableCell>{getFormattedDate(period.updatedAt)}</TableCell>
                                    <TableCell>
                                        {period.isActive ? (
                                            <CheckCircleColoredIcon size="s" color="success" />
                                        ) : (
                                            <ErrorCircleColoredIcon size="s" color="error" />
                                        )}
                                    </TableCell>

                                    <TableCell align="center">
                                        <RouterLink to={`/periods/${period.id}`}>Подробнее</RouterLink>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>


            </Card>
            <Stack direction="row" justify="end" align="center" gap="m"   style={{ marginTop: 16, width: '100%' }}>
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
    );
};

export default Periods;
