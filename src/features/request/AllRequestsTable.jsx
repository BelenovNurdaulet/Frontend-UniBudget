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
import {Button} from "@ozen-ui/kit/ButtonNext";
import {CalendarIcon, DocumentSuccessIcon} from "@ozen-ui/icons";
import {spacing} from "@ozen-ui/kit/MixSpacing";

const AllRequestsTable = () => {
    const [page, setPage] = useState(0);
    const [pageSize, setPageSize] = useState(10);
    const [selectedPeriodId, setSelectedPeriodId] = useState('');
    const [searchName, setSearchName] = useState('');
    const [startDate, setStartDate] = useState(null);
    const [endDate, setEndDate] = useState(null);

    const { data: periodsData, isLoading: isPeriodsLoading } = useGetPeriodsQuery({ PageNumber: 1, PageSize: 100 });
    const { data, isLoading, isError, refetch } = useGetRequestsQuery({
        PageNumber: page + 1,
        PageSize: pageSize,
        PeriodId: selectedPeriodId ? Number(selectedPeriodId) : undefined,
    });

    useEffect(() => {
        refetch();
    }, [page, pageSize, selectedPeriodId, refetch]);

    const periods = Array.isArray(periodsData?.items) ? periodsData.items : [];
    const { requests = [], totalCount = 0 } = data || {};

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
                <Stack gap="l" align="center" justify="spaceBetween"  fullWidth>
                    <Select
                        label="Бюджетный период"
                        placeholder={isPeriodsLoading ? 'Загрузка периодов...' : 'Выберите период'}
                        value={selectedPeriodId}
                        onChange={setSelectedPeriodId}
                        fullWidth
                        renderValue={() => {
                            const selected = periods.find((p) => String(p.id) === selectedPeriodId);
                            return selected
                                ? `Период №${selected.id} — ${getFormattedDate(selected.createdAt)}`
                                : '';
                        }}
                    >
                        {periods.length > 0 ? (
                            periods.map((period) => (
                                <Option key={period.id} value={String(period.id)}>
                                    Период №{period.id} — {getFormattedDate(period.createdAt)}
                                </Option>
                            ))
                        ) : (
                            <Option disabled value="">
                                {isPeriodsLoading ? 'Загрузка...' : 'Нет доступных периодов'}
                            </Option>
                        )}
                    </Select>
                    <Stack gap="xl">
                        <Button  iconLeft={DocumentSuccessIcon }>
                            Cформировать документ
                        </Button>
                    </Stack>


                </Stack>
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
                    <Table size="m" divider="row" stickyHeader fullWidth>
                        <TableHead>
                            <TableRow>
                                <TableCell>ID</TableCell>
                                <TableCell>Заголовок</TableCell>
                                <TableCell>Описание</TableCell>
                                <TableCell>Сумма</TableCell>
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
                                    <TableRow key={item.id}>
                                        <TableCell>{item.id}</TableCell>
                                        <TableCell>{item.title}</TableCell>
                                        <TableCell>{item.description}</TableCell>
                                        <TableCell>{item.amount}</TableCell>
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
