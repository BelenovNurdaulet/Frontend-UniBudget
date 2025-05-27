import { useState, useEffect, useMemo } from 'react';
import { useGetRequestsQuery } from './requestApi';
import { useGetPeriodsQuery } from '../period/periodApi';
import { useGetReferenceQuery } from '../reference/referenceApi';
import { useSelector } from 'react-redux';
import { selectBranches } from '../reference/referenceSlice';
import { Loader } from '@ozen-ui/kit/Loader';
import styles from './AllRequestsTable.module.css';
import { Link as RouterLink, useSearchParams } from 'react-router-dom';
import getFormattedDate from '../../utils/getFormattedDate';
import { DatePicker } from '@ozen-ui/kit/DatePicker';
import { Stack } from '@ozen-ui/kit/Stack';
import { Select, Option } from '@ozen-ui/kit/Select';
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
import { Button } from '@ozen-ui/kit/ButtonNext';
import { FilterClearIcon, SortDownIcon, SortUpIcon } from '@ozen-ui/icons';
import {useSnackbar} from "@ozen-ui/kit/Snackbar";

const AllRequestsTable = () => {
    const [searchParams] = useSearchParams();
    const initialPeriodIdFromUrl = searchParams.get('periodId') || '';
    const { pushMessage } = useSnackbar();

    const clearFilters = () => {
        setSelectedBranchId('');
        setSelectedStatus('');
        setStartDate(null);
        setEndDate(null);
        localStorage.removeItem('allRequestsFilters');
    };

    const [selectedPeriodId, setSelectedPeriodId] = useState(initialPeriodIdFromUrl);
    const [isInitialLoadComplete, setIsInitialLoadComplete] = useState(false);
    const [page, setPage] = useState(0);
    const [pageSize, setPageSize] = useState(10);
    const [selectedBranchId, setSelectedBranchId] = useState('');
    const [selectedStatus, setSelectedStatus] = useState('');
    const [startDate, setStartDate] = useState(null);
    const [endDate, setEndDate] = useState(null);
    const [sortField, setSortField] = useState(null);
    const [sortOrder, setSortOrder] = useState('asc');

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
              (sortOrder === 'asc' ? (
                  <SortDownIcon size="s" />
              ) : (
                  <SortUpIcon size="s" />
              ))}
      </span>
        </TableCell>
    );

    useEffect(() => {
        if (isInitialLoadComplete && !selectedPeriodId) {
            pushMessage({
                title: 'Выберите период чтобы увидеть заявки',
                status: 'warning',
            });
        }
    }, [isInitialLoadComplete, selectedPeriodId, pushMessage]);



    useEffect(() => {
        const cached = JSON.parse(localStorage.getItem('allRequestsFilters'));
        if (cached) {
            if (!initialPeriodIdFromUrl && cached.selectedPeriodId) {
                setSelectedPeriodId(cached.selectedPeriodId);
            }
            setSelectedBranchId(cached.selectedBranchId || '');
            setSelectedStatus(cached.selectedStatus || '');
            setStartDate(cached.startDate ? new Date(cached.startDate) : null);
            setEndDate(cached.endDate ? new Date(cached.endDate) : null);
        }
    }, [initialPeriodIdFromUrl]);

    useEffect(() => {
        localStorage.setItem(
            'allRequestsFilters',
            JSON.stringify({
                selectedPeriodId,
                selectedBranchId,
                selectedStatus,
                startDate,
                endDate,
            })
        );
    }, [selectedPeriodId, selectedBranchId, selectedStatus, startDate, endDate]);





    const { data: periodsData } = useGetPeriodsQuery({ PageNumber: 1, PageSize: 100 });
    useGetReferenceQuery();
    const branches = useSelector(selectBranches);


    const { data, isLoading, isError } = useGetRequestsQuery(
        {
            PageNumber: page + 1,
            PageSize: pageSize,
            PeriodId: selectedPeriodId ? Number(selectedPeriodId) : undefined,
            Status: selectedStatus || undefined,
            BranchId: selectedBranchId ? Number(selectedBranchId) : undefined,
            StartDate: startDate ? startDate.toISOString() : undefined,
            EndDate: endDate ? endDate.toISOString() : undefined,
        },
        {
            skip: !selectedPeriodId,
        }
    );

    const periods = useMemo(() => (Array.isArray(periodsData?.items) ? periodsData.items : []), [periodsData]);

    const { requests = [], totalCount = 0 } = data || {};

    const branchesMap = useMemo(() => {
        return branches.reduce((acc, branch) => {
            acc[branch.id] = branch.name;
            return acc;
        }, {});
    }, [branches]);

    useEffect(() => {
        if (periods.length > 0 && !initialPeriodIdFromUrl && !selectedPeriodId) {
            setSelectedPeriodId(String(periods[0].id));
            setIsInitialLoadComplete(true);
        } else if (!selectedPeriodId && !isInitialLoadComplete) {
            setIsInitialLoadComplete(true);
        }
    }, [periods, selectedPeriodId, initialPeriodIdFromUrl, isInitialLoadComplete]);


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

    const sortedRequests = useMemo(() => {
        const sorted = [...requests];
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
    }, [requests, sortField, sortOrder]);

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
                    Ошибка загрузки заявок
                </Typography>
            </div>
        );
    }



    return (
        <div>
            <Typography variant="heading-xl" className={spacing({ mb: 'm' })}>
                Все заявки
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
                    <Stack direction="row" gap="m" align="end" fullWidth style={{ marginBottom: 16 }}>
                        <Select
                            label="Филиал"
                            value={selectedBranchId}
                            onChange={setSelectedBranchId}
                            style={{ flex: '1 1 0', minWidth: 180 }}
                        >
                            {branches.map((branch) => (
                                <Option key={branch.id} value={branch.id}>
                                    {branch.name}
                                </Option>
                            ))}
                        </Select>

                        <Select
                            label="Статус"
                            value={selectedStatus}
                            onChange={setSelectedStatus}
                            style={{ flex: '1 1 0', minWidth: 180 }}
                        >
                            {Object.entries(REQUEST_STATUSES_CONFIG).map(([statusKey, config]) => (
                                <Option key={statusKey} value={statusKey}>
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
                                    <SortableHeader field="branchId" label="Подразделение" />
                                    <SortableHeader field="requestStatus" label="Статус" />
                                    <SortableHeader field="createdAt" label="Дата создания" />
                                    <TableCell align="center"></TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {sortedRequests.length === 0 ? (
                                    <TableRow>
                                        <TableCell colSpan={6} align="center">
                                            Нет заявок
                                        </TableCell>
                                    </TableRow>
                                ) : (
                                    sortedRequests.map((item) => (
                                        <TableRow key={item.id}>
                                            <TableCell align="left" className={styles.singleLineCell}>
                                                {item.title}
                                            </TableCell>
                                            <TableCell align="center" className={styles.singleLineCell}>
                                                {item.amount} ₸
                                            </TableCell>
                                            <TableCell align="center" className={styles.singleLineCell}>
                                                {branchesMap[item.branchId] || '—'}
                                            </TableCell>
                                            <TableCell align="left" className={styles.singleLineCell}>
                                                <Tag
                                                    color={getStatusColor(item.requestStatus)}
                                                    size="s"
                                                    label={REQUEST_STATUSES_CONFIG[item.requestStatus]?.name || item.requestStatus}
                                                />
                                            </TableCell>
                                            <TableCell align="center" className={styles.singleLineCell}>
                                                {getFormattedDate(item.createdAt)}
                                            </TableCell>
                                            <TableCell align="center" className={styles.singleLineCell}>
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
                    totalCount={totalCount}
                    onPageChange={setPage}
                    size="s"
                />
            </Stack>
        </div>
    );
};

export default AllRequestsTable;
