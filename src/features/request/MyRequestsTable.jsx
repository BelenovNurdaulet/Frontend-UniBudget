
import { useState, useEffect, useMemo } from 'react';
import { useGetPeriodsQuery } from '../period/periodApi';
import { useGetMyRequestsByPeriodIdQuery } from './requestApi';
import { Loader } from '@ozen-ui/kit/Loader';
import { Link as RouterLink, useSearchParams } from 'react-router-dom';
import getFormattedDate from '../../utils/getFormattedDate';
import { DatePicker } from '@ozen-ui/kit/DatePicker';
import { Stack } from '@ozen-ui/kit/Stack';
import { Input } from '@ozen-ui/kit/Input';
import { Option, Select } from '@ozen-ui/kit/Select';
import {
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
} from '@ozen-ui/kit/Table';
import { Typography } from '@ozen-ui/kit/Typography';
import { Card } from '@ozen-ui/kit/Card';
import { Pagination } from '@ozen-ui/kit/Pagination';
import { spacing } from '@ozen-ui/kit/MixSpacing';
import { REQUEST_STATUSES_CONFIG } from '../../utils/status/statusConfig';
import { Tag } from '@ozen-ui/kit/TagNext';
import PeriodSelect from '../../components/PeriodSelect/PeriodSelect';
import styles from './AllRequestsTable.module.css';
import { Button } from '@ozen-ui/kit/ButtonNext';
import { FilterClearIcon, SortDownIcon, SortUpIcon } from '@ozen-ui/icons';
import { useSnackbar } from '@ozen-ui/kit/Snackbar';

const MyRequestsTable = () => {
    const [searchParams] = useSearchParams();
    const initialPeriodIdFromUrl = searchParams.get('periodId') || '';
    const { pushMessage } = useSnackbar();

    const [selectedPeriodId, setSelectedPeriodId] = useState(initialPeriodIdFromUrl);
    const [searchName, setSearchName] = useState('');
    const [selectedStatus, setSelectedStatus] = useState('');
    const [startDate, setStartDate] = useState(null);
    const [endDate, setEndDate] = useState(null);
    const [page, setPage] = useState(0);
    const [pageSize, setPageSize] = useState(10);
    const [sortField, setSortField] = useState(null);
    const [sortOrder, setSortOrder] = useState('asc');
    const [isInitialLoadComplete, setIsInitialLoadComplete] = useState(false);

    const clearFilters = () => {
        setSearchName('');
        setSelectedStatus('');
        setStartDate(null);
        setEndDate(null);

    };

    useEffect(() => {
        const cached = JSON.parse(localStorage.getItem('myRequestsFilters'));
        if (cached) {
            if (!initialPeriodIdFromUrl && cached.selectedPeriodId) {
                setSelectedPeriodId(cached.selectedPeriodId);
            }
            setSearchName(cached.searchName || '');
            setSelectedStatus(cached.selectedStatus || '');
            setStartDate(cached.startDate ? new Date(cached.startDate) : null);
            setEndDate(cached.endDate ? new Date(cached.endDate) : null);
        }
    }, [initialPeriodIdFromUrl]);

    useEffect(() => {
        localStorage.setItem('myRequestsFilters', JSON.stringify({
            selectedPeriodId,
            searchName,
            selectedStatus,
            startDate,
            endDate,
        }));
    }, [selectedPeriodId, searchName, selectedStatus, startDate, endDate]);

    const { data: periodsData } = useGetPeriodsQuery({ PageNumber: 1, PageSize: 100 });
    const { data, isLoading, isError, error } = useGetMyRequestsByPeriodIdQuery(
        selectedPeriodId ? Number(selectedPeriodId) : undefined,
        { skip: !selectedPeriodId }
    );

    const periods = Array.isArray(periodsData?.items) ? periodsData.items : [];
    const { requests = [] } = data || {};

    useEffect(() => {
        if (periods.length > 0 && !initialPeriodIdFromUrl && !selectedPeriodId) {
            setSelectedPeriodId(String(periods[0].id));
            setIsInitialLoadComplete(true);
        } else if (!selectedPeriodId && !isInitialLoadComplete) {
            setIsInitialLoadComplete(true);
        }
    }, [periods, selectedPeriodId, initialPeriodIdFromUrl, isInitialLoadComplete]);

    useEffect(() => {
        if (isInitialLoadComplete && !selectedPeriodId) {
            pushMessage({
                title: 'Выберите период чтобы увидеть заявки',
                status: 'warning',
            });
        }
    }, [isInitialLoadComplete, selectedPeriodId, pushMessage]);

    const filteredRequests = useMemo(() => {
        return requests.filter((item) => {
            const matchesName = searchName
                ? item.title.toLowerCase().includes(searchName.toLowerCase())
                : true;
            const matchesStatus = selectedStatus
                ? item.requestStatus === selectedStatus
                : true;
            const createdAt = new Date(item.createdAt);
            const matchesStartDate = startDate ? createdAt >= startDate : true;
            const matchesEndDate = endDate ? createdAt <= endDate : true;
            return matchesName && matchesStatus && matchesStartDate && matchesEndDate;
        });
    }, [requests, searchName, selectedStatus, startDate, endDate]);

    const sortedRequests = useMemo(() => {
        const sorted = [...filteredRequests];
        if (!sortField) return sorted;
        return sorted.sort((a, b) => {
            let aVal = a[sortField];
            let bVal = b[sortField];
            if (aVal == null) aVal = '';
            if (bVal == null) bVal = '';
            if (typeof aVal === 'string' && typeof bVal === 'string') {
                return sortOrder === 'asc' ? aVal.localeCompare(bVal) : bVal.localeCompare(aVal);
            }
            return sortOrder === 'asc' ? aVal - bVal : bVal - aVal;
        });
    }, [filteredRequests, sortField, sortOrder]);

    const paginatedRequests = sortedRequests.slice(page * pageSize, (page + 1) * pageSize);

    const handleSort = (field) => {
        if (sortField === field) {
            setSortOrder((prev) => (prev === 'asc' ? 'desc' : 'asc'));
        } else {
            setSortField(field);
            setSortOrder('asc');
        }
    };

    const SortableHeader = ({ field, label }) => (
        <TableCell onClick={() => handleSort(field)} style={{ cursor: 'pointer' }}>
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4 }}>
                {label}
                {sortField === field &&
                    (sortOrder === 'asc' ? <SortDownIcon size="s" /> : <SortUpIcon size="s" />)}
            </span>
        </TableCell>
    );

    const getStatusColor = (status) => {
        switch (status) {
            case 'Created':
            case 'ReturnToCreator':
            case 'ReturnToReviewer':
                return 'warning';
            case 'InReview':
            case 'Approved':
                return 'info';
            case 'Submitted':
                return 'success';
            case 'Cancelled':
                return 'error';
            default:
                return 'default';
        }
    };

    if (isLoading) {
        return (
            <div className={styles.loaderWrapper}>
                <Loader size="l" />
            </div>
        );
    }

    if (isError && error?.status !== 404) {
        return (
            <div className={styles.loaderWrapper}>
                <Typography variant="text-xl" color="error">
                    Ошибка загрузки заявок
                </Typography>
            </div>
        );
    }

    return (
        <div>
            <Typography variant="heading-xl" className={spacing({ mb: 'm' })}>
                Мои заявки
            </Typography>
            <Stack direction="column" gap="xs" fullWidth>
                <Card size="m" shadow="m" borderWidth="none">
                    <PeriodSelect
                        selectedPeriodId={selectedPeriodId}
                        setSelectedPeriodId={(id) => {
                            setSelectedPeriodId(id);
                            setPage(0);
                        }}
                    />
                </Card>

                <Card size="m" shadow="m" borderWidth="none">
                    <Stack direction="row" gap="m" align="end" fullWidth wrap>
                        <Input
                            label="Поиск по названию"
                            value={searchName}
                            onChange={(e) => setSearchName(e.target.value)}
                            style={{ flex: '1 1 0', minWidth: 180 }}
                        />
                        <Select
                            label="Статус"
                            value={selectedStatus}
                            onChange={setSelectedStatus}
                            style={{ flex: '1 1 0', minWidth: 180 }}
                        >
                            {Object.entries(REQUEST_STATUSES_CONFIG).map(([key, config]) => (
                                <Option key={key} value={key}>
                                    {config.name}
                                </Option>
                            ))}
                        </Select>
                        <DatePicker
                            label="Дата начала"
                            value={startDate}
                            onChange={setStartDate}
                            maxDate={endDate || undefined}
                            style={{ flex: '1 1 0', minWidth: 180 }}
                        />
                        <DatePicker
                            label="Дата окончания"
                            value={endDate}
                            onChange={setEndDate}
                            minDate={startDate || undefined}
                            style={{ flex: '1 1 0', minWidth: 180 }}
                        />
                        <Button
                            color="error"
                            iconLeft={FilterClearIcon}
                            onClick={clearFilters}
                            style={{ flex: '1 1 0', minWidth: 180 }}
                        >
                            Очистить фильтры
                        </Button>
                    </Stack>

                    <TableContainer height="500px">
                        <Table size="m" divider="row" stickyHeader fullWidth>
                            <TableHead>
                                <TableRow>
                                    <SortableHeader field="title" label="Заголовок" />
                                    <SortableHeader field="amount" label="Сумма" />
                                    <SortableHeader field="requestStatus" label="Статус" />
                                    <SortableHeader field="createdAt" label="Дата создания" />
                                    <TableCell align="center"></TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {paginatedRequests.length === 0 ? (
                                    <TableRow>
                                        <TableCell colSpan={5} align="center">
                                            Нет заявок
                                        </TableCell>
                                    </TableRow>
                                ) : (
                                    paginatedRequests.map((item) => (
                                        <TableRow key={item.id}>
                                            <TableCell  align="left">{item.title}</TableCell>
                                            <TableCell  align="center">{item.amount} ₸</TableCell>
                                            <TableCell  align="left">
                                                <Tag
                                                    color={getStatusColor(item.requestStatus)}
                                                    size="s"
                                                    label={REQUEST_STATUSES_CONFIG[item.requestStatus]?.name || item.requestStatus}
                                                />
                                            </TableCell  >
                                            <TableCell  align="center">{getFormattedDate(item.createdAt)}</TableCell>
                                            <TableCell align="center">
                                                <RouterLink to={`/request/${item.id}`}>Подробнее</RouterLink>
                                            </TableCell>
                                        </TableRow>
                                    ))
                                )}
                            </TableBody>
                        </Table>
                    </TableContainer>
                </Card>
            </Stack>

            <Stack direction="row" justify="end" align="center" gap="m" style={{ marginTop: 16, width: '100%' }}>
                <Select
                    size="s"
                    label="Кол-во записей"
                    value={pageSize}
                    onChange={(value) => {
                        setPageSize(Number(value));
                        setPage(0);
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
                    totalCount={sortedRequests.length}
                    onPageChange={setPage}
                    size="s"
                />
            </Stack>
        </div>
    );
};

export default MyRequestsTable;
