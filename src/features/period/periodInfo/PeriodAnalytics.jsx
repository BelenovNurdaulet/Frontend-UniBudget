import React from 'react';

import { Card } from '@ozen-ui/kit/Card';
import { Typography } from '@ozen-ui/kit/Typography';
import { spacing } from '@ozen-ui/kit/MixSpacing';
import { Table, TableBody, TableCell, TableContainer, TableRow } from '@ozen-ui/kit/Table';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import {useGetPeriodStatisticsQuery} from "../periodApi.js";

const PeriodAnalytics = ({ periodId, targetPeriodId }) => {
    const { data, isLoading, isError } = useGetPeriodStatisticsQuery({ PeriodId: periodId, TargetPeriodId: targetPeriodId });

    if (isLoading) return <Typography>Загрузка данных...</Typography>;
    if (isError) return <Typography>Ошибка при загрузке данных.</Typography>;

    const chartData = [
        { name: 'Одобрено', value: data.approvedAmount },
        { name: 'Отклонено', value: data.rejectedAmount },
        { name: 'В ожидании', value: data.pendingAmount },
    ];

    return (
        <div>
            <Typography variant="heading-l" className={spacing({ mb: 's' })}>
                Аналитика периода
            </Typography>

            <Card size="s" shadow="m" style={{ padding: '1rem' }} className={spacing({ mb: 's' })}>
                <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={chartData}>
                        <XAxis dataKey="name" />
                        <YAxis />
                        <Tooltip />
                        <Bar dataKey="value" fill="#8884d8" />
                    </BarChart>
                </ResponsiveContainer>
            </Card>

            <Typography variant="heading-m" className={spacing({ mb: 's' })}>
                Детали
            </Typography>

            <Card size="s" shadow="m" style={{ padding: '1rem' }}>
                <TableContainer>
                    <Table size="s" striped divider="row" fullWidth>
                        <TableBody>
                            <TableRow>
                                <TableCell align="left">Название периода:</TableCell>
                                <TableCell align="right">{data.periodName}</TableCell>
                            </TableRow>
                            <TableRow>
                                <TableCell align="left">Тип периода:</TableCell>
                                <TableCell align="right">{data.periodType}</TableCell>
                            </TableRow>
                            <TableRow>
                                <TableCell align="left">Общая сумма запросов:</TableCell>
                                <TableCell align="right">{data.totalRequestedAmount}</TableCell>
                            </TableRow>
                            <TableRow>
                                <TableCell align="left">Средняя сумма запроса:</TableCell>
                                <TableCell align="right">{data.averageRequestAmount}</TableCell>
                            </TableRow>
                            <TableRow>
                                <TableCell align="left">Количество запросов:</TableCell>
                                <TableCell align="right">{data.totalRequestsCount}</TableCell>
                            </TableRow>
                        </TableBody>
                    </Table>
                </TableContainer>
            </Card>
        </div>
    );
};

export default PeriodAnalytics;
