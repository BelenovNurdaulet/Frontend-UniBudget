import { useState, useEffect } from 'react';
import { useGetRequestsQuery } from './requestApi';
import { useGetPeriodsQuery } from '../period/periodApi';

import { Loader } from '@ozen-ui/kit/Loader';
import styles from './AllRequestsTable.module.css';
import { Link as RouterLink } from 'react-router-dom';
import getFormattedDate from '../../utils/getFormattedDate';
import {DatePicker} from "@ozen-ui/kit/DatePicker";
import {Stack} from "@ozen-ui/kit/Stack";
import {Input} from "@ozen-ui/kit/Input";
import { Option , Select} from '@ozen-ui/kit/Select';
import {Table, TableBody, TableCell, TableContainer, TableHead, TableRow} from "@ozen-ui/kit/Table";
import {Typography} from "@ozen-ui/kit/Typography";
import {Card} from "@ozen-ui/kit/Card";
import {Pagination} from "@ozen-ui/kit/Pagination";

import {spacing} from "@ozen-ui/kit/MixSpacing";
import { REQUEST_STATUSES_CONFIG} from "../../utils/status/statusConfig.js";
import {Tag} from "@ozen-ui/kit/TagNext";
import {BRANCHES} from "../../utils/branches.js";
import PeriodSelect from "../../components/PeriodSelect/PeriodSelect.jsx";
import { useSearchParams } from 'react-router-dom';

const AllRequestsTable = () => {

    const getStatusColor = (status) => {
        switch (status) {
            case 'Created':
            case 'ReturnToCreator':
            case 'ReturnToReviewer':
                return 'warning'
            case 'InReview':
            case 'Approved':
                return 'info'
            case 'Submitted':
                return 'success'
            case 'Cancelled':
                return 'error'
            default:
                return 'default'
        }
    }
    const [isInitialLoadComplete, setIsInitialLoadComplete] = useState(false);
    const [page, setPage] = useState(0);
    const [pageSize, setPageSize] = useState(10);
    const [searchParams] = useSearchParams();
    const initialPeriodIdFromUrl = searchParams.get('periodId') || '';
    const [selectedPeriodId, setSelectedPeriodId] = useState(initialPeriodIdFromUrl);

    const [searchName, setSearchName] = useState('');
    const [startDate, setStartDate] = useState(null);
    const [endDate, setEndDate] = useState(null);

    const { data: periodsData } = useGetPeriodsQuery({ PageNumber: 1, PageSize: 100 });
    const { data, isLoading, isError, refetch } = useGetRequestsQuery({
        PageNumber: page + 1,
        PageSize: pageSize,
        PeriodId: selectedPeriodId ? Number(selectedPeriodId) : undefined,
    });


    const periods = Array.isArray(periodsData?.items) ? periodsData.items : [];
    const { requests = [], totalCount = 0 } = data || {};
    useEffect(() => {
        if (periods.length > 0 && !initialPeriodIdFromUrl && !selectedPeriodId) {
            setSelectedPeriodId(String(periods[0].id));
            setIsInitialLoadComplete(true);
        } else if (initialPeriodIdFromUrl && !isInitialLoadComplete) {
            setIsInitialLoadComplete(true);
        }
    }, [periods, selectedPeriodId, initialPeriodIdFromUrl, isInitialLoadComplete]);

    useEffect(() => {
        if (isInitialLoadComplete) {
            refetch();
        }
    }, [page, pageSize, selectedPeriodId, refetch, isInitialLoadComplete]);
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
            <Card size="m" shadow="m">

                <PeriodSelect
                    selectedPeriodId={selectedPeriodId}
                    setSelectedPeriodId={(id) => {
                        setSelectedPeriodId(id);
                        setPage(0);
                    }}
                />


            </Card>

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



                <TableContainer height="400px">
                    <Table size="m" divider="row" stickyHeader striped fullWidth>
                        <TableHead>
                            <TableRow>
                                <TableCell>Заголовок</TableCell>
                                <TableCell>Сумма</TableCell>
                                <TableCell>Подразделение</TableCell>
                                <TableCell>Статус</TableCell>
                                <TableCell>Дата создания</TableCell>
                                <TableCell align="center">Действия</TableCell>
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
                                    <TableRow >
                                        <TableCell>{item.title}</TableCell>
                                        <TableCell>{item.amount} ₸</TableCell>
                                        <TableCell>
                                            {BRANCHES[item.branchId] || '—'}
                                            </TableCell>

                                        <TableCell>
                                            <Tag
                                            color={getStatusColor(item.requestStatus)}
                                            size="s"
                                            label={REQUEST_STATUSES_CONFIG[item.requestStatus]?.name || item.requestStatus}
                                        /></TableCell>
                                        <TableCell>{getFormattedDate(item.createdAt)}</TableCell>
                                        <TableCell align="center">
                                            <RouterLink to={`/request/${item.id}`}>Подробнее</RouterLink>
                                        </TableCell>
                                    </TableRow>
                                ))
                            )}
                        </TableBody>
                    </Table>
                </TableContainer>

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
            </Card>
            </Stack>
        </div>
    );
};

export default AllRequestsTable;
