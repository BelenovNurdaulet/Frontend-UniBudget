import { useBoolean } from '@ozen-ui/kit/useBoolean';

import {useCallback, useEffect, useState} from 'react';
import {Input} from "@ozen-ui/kit/Input";
import {Dialog, DialogBody, DialogHeader, DialogTitle} from "@ozen-ui/kit/DialogNext";
import {Loader} from "@ozen-ui/kit/Loader";
import {
    useGetPeriodByIdQuery,
    useGetPeriodsQuery,
    useLazyGetPeriodExcelQuery
} from "../../features/period/periodApi.js";
import {Card} from "@ozen-ui/kit/Card";
import {Table, TableBody, TableCell, TableContainer, TableHead, TableRow} from "@ozen-ui/kit/Table";
import {Stack} from "@ozen-ui/kit/Stack";
import {DatePicker} from "@ozen-ui/kit/DatePicker";
import {Pagination} from "@ozen-ui/kit/Pagination";
import {Select} from "@ozen-ui/kit/Select";
import {Option} from "@ozen-ui/kit/Select";
import { useNavigate } from "react-router-dom";
import {useSelector} from "react-redux";
import {selectUser} from "../../features/auth/authSlice.js";
import {Button} from "@ozen-ui/kit/ButtonNext";
import {DownloadFileIcon, EditIcon} from "@ozen-ui/icons";
import { saveAs } from 'file-saver';
import getFormattedDate from "../../utils/getFormattedDate.js";
import {Link as RouterLink} from "react-router-dom";

const PeriodSelect = ({ selectedPeriodId, setSelectedPeriodId }) => {
    const user = useSelector(selectUser);
    const navigate = useNavigate();
    const [fetchExcel] = useLazyGetPeriodExcelQuery();

    const roleClaim = 'http://schemas.microsoft.com/ws/2008/06/identity/claims/role';
    const role = user?.[roleClaim];

    const [open, { on: openModal, off: closeModal }] = useBoolean(false);
    const [selectedName, setSelectedName] = useState('');

    const [page, setPage] = useState(0);
    const [pageSize, setPageSize] = useState(10);
    const [startDate, setStartDate] = useState(null);
    const [endDate, setEndDate] = useState(null);

    const formatDateForQuery = useCallback((date) => {
        return date ? new Date(date).toISOString().slice(0, 16) : undefined;
    }, []);

    const { data, isLoading, refetch } = useGetPeriodsQuery({
        PageNumber: page + 1,
        PageSize: pageSize,
        IsActive: true,
        StartDate: formatDateForQuery(startDate),
        EndDate: formatDateForQuery(endDate),
    }, {
        skip: !open,
    });

    const { data: selectedPeriod } = useGetPeriodByIdQuery(selectedPeriodId, {
        skip: !selectedPeriodId,
    });

    useEffect(() => {
        if (open) {
            refetch();
        }
    }, [open, refetch]);

    useEffect(() => {
        if (selectedPeriod?.name) {
            setSelectedName(selectedPeriod.name);
            closeModal();
        }
    }, [selectedPeriod, closeModal]);

    const handleRowClick = (id) => {
        setSelectedPeriodId(id);
    };

    const handleDownload = async (id, name) => {
        try {
            const blob = await fetchExcel(id).unwrap();
            const filename = `Period_${name}_${new Date().toISOString()}.xlsx`;
            saveAs(blob, filename);
        } catch (e) {
            console.error('Ошибка при скачивании Excel:', e);
        }
    };

    const canShowCreateApplication = (period) => {
        const now = new Date();
        const start = new Date(period.submissionStartDate);
        const end = new Date(period.submissionEndDate);
        return now >= start && now <= end;
    };

    const canShowReport = (period, role) => {
        const isFinished = new Date(period.executionEndDate) < new Date();
        return ['Administration', 'Finance'].includes(role) && isFinished;
    };

    const { items = [], totalCount = 0 } = data || {};

    return (
        <>
            <Stack direction="row" gap="m" align="end" fullWidth wrap>
                <div style={{ flex: '4 1 0', minWidth: 180 }}>
                    <Input
                        label="Выберите период"
                        value={selectedName}
                        onClick={openModal}
                        readOnly
                        fullWidth
                    />
                </div>

                {selectedPeriod && canShowCreateApplication(selectedPeriod) && (
                    <Button
                        color="primary"
                        style={{ flex: '1 1 0', minWidth: 180 }}
                        onClick={() => navigate(`/create-request?periodId=${selectedPeriod.id}`)}
                        iconLeft={EditIcon}
                        fullWidth
                    >
                        Создать заявку
                    </Button>
                )}

                {selectedPeriod && canShowReport(selectedPeriod, role) && (
                    <Button
                        color="primary"
                        style={{ flex: '1 1 0', minWidth: 180 }}
                        onClick={() => handleDownload(selectedPeriod.id, selectedPeriod.name)}
                        iconLeft={DownloadFileIcon}
                        fullWidth
                    >
                        Сформировать отчет
                    </Button>
                )}
            </Stack>

            <Dialog open={open} onClose={closeModal} size="xl" deviceType="desktop">
                <DialogHeader>
                    <DialogTitle>Выбор бюджетного периода</DialogTitle>
                </DialogHeader>
                <DialogBody>
                    <Stack direction="column" gap="m" fullWidth>
                        <Stack direction="row" gap="m" wrap fullWidth>
                            <DatePicker
                                label="Дата начала"
                                value={startDate}
                                onChange={setStartDate}
                                style={{ width: '49%' }}
                            />
                            <DatePicker
                                label="Дата окончания"
                                value={endDate}
                                onChange={setEndDate}
                                style={{ width: '49%' }}
                            />
                        </Stack>

                        {isLoading ? (
                            <Loader size="m" />
                        ) : (
                            <>
                                <Card>
                                    <TableContainer height="400px">
                                        <Table size="s" fullWidth striped stickyHeader>
                                            <TableHead>
                                                <TableRow>
                                                    <TableCell>ID</TableCell>
                                                    <TableCell>Название</TableCell>
                                                    <TableCell>Создан</TableCell>
                                                    <TableCell align="center">Действия</TableCell>
                                                </TableRow>
                                            </TableHead>
                                            <TableBody>
                                                {items.map((period) => (
                                                    <TableRow
                                                        key={period.id}
                                                        onClick={() => handleRowClick(period.id)}
                                                        hover
                                                        style={{ cursor: 'pointer' }}
                                                    >
                                                        <TableCell align="center">{period.id}</TableCell>
                                                        <TableCell align="center">{period.name}</TableCell>
                                                        <TableCell align="center">{getFormattedDate(period.createdAt)}</TableCell>
                                                        <TableCell align="center">
                                                            <RouterLink to={`/periods/${period.id}`}>Подробнее</RouterLink>
                                                        </TableCell>
                                                    </TableRow>
                                                ))}
                                            </TableBody>
                                        </Table>
                                    </TableContainer>

                                    <Stack direction="row" justify="end" align="center" gap="m" style={{ marginTop: 16, width: '100%' }}>
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
                                </Card>
                            </>
                        )}
                    </Stack>
                </DialogBody>
            </Dialog>
        </>
    );
};

export default PeriodSelect;
