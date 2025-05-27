
import { useState, useMemo } from 'react';
import { Input } from '@ozen-ui/kit/Input';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from '@ozen-ui/kit/Table';
import { Typography } from '@ozen-ui/kit/Typography';
import { Card } from '@ozen-ui/kit/Card';
import { Stack } from '@ozen-ui/kit/Stack';
import { spacing } from '@ozen-ui/kit/MixSpacing';
import { Pagination } from '@ozen-ui/kit/Pagination';
import { Select, Option } from '@ozen-ui/kit/Select';
import {SearchIcon, SortDownIcon, SortUpIcon} from '@ozen-ui/icons';
import { Loader } from '@ozen-ui/kit/Loader';
import { Avatar } from '@ozen-ui/kit/Avatar';
import getFormattedDate from '../../utils/getFormattedDate';
import { useGetUsersQuery } from '../UserProfle/userApi.js';
import styles from '../period/Periods.module.css';
import {Link} from "react-router-dom";

const UsersList = () => {
    const [search, setSearch] = useState('');
    const [page, setPage] = useState(0);
    const [pageSize, setPageSize] = useState(10);
    const [sortField, setSortField] = useState(null);
    const [sortOrder, setSortOrder] = useState('asc');

    const { data, isLoading, isError } = useGetUsersQuery({
        pageNumber: page + 1,
        pageSize
    });

    const users = data?.users || [];
    const totalCount = data?.totalCount || 0;

    const filteredUsers = useMemo(() => {
        if (!search) return users;
        return users.filter(user =>
            user.userName?.toLowerCase().includes(search.toLowerCase())
        );
    }, [users, search]);

    const sortedUsers = useMemo(() => {
        const sorted = [...filteredUsers];
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
    }, [filteredUsers, sortField, sortOrder]);

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

    if (isError) {
        return (
            <div className={styles.loaderWrapper}>
                <Typography variant="text-xl" color="error">
                    Ошибка загрузки данных
                </Typography>
            </div>
        );
    }

    return (
        <div>
            <Typography variant="heading-xl" className={spacing({ mb: 'm' })}>
                Список пользователей
            </Typography>

            <Stack direction="column" gap="xs" fullWidth>
                <Card size="m" shadow="m" borderWidth="none">
                    <Stack direction="row" gap="m" align="end" fullWidth wrap>
                        <Input
                            label="Поиск по имени"
                            value={search}
                            renderLeft={SearchIcon}
                            onChange={(e) => setSearch(e.target.value)}
                            style={{ flex: '1 1 0', minWidth: 180 }}
                        />
                    </Stack>
                    {isLoading ? (
                        <Loader size="m" />
                    ) : (
                        <TableContainer height="500px" style={{ marginTop: 16 }}>
                            <Table size="m" divider="row" stickyHeader fullWidth>
                                <TableHead>
                                    <TableRow>
                                        <TableCell>Аватар</TableCell>
                                        <SortableHeader field="userName" label="Имя пользователя" />
                                        <SortableHeader field="email" label="Email" />
                                        <SortableHeader field="role" label="Роль" />
                                        <SortableHeader field="createdAt" label="Дата создания" />
                                        <TableCell align="center"></TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {sortedUsers.length === 0 ? (
                                        <TableRow>
                                            <TableCell colSpan={6} align="center">
                                                Нет пользователей
                                            </TableCell>
                                        </TableRow>
                                    ) : (
                                        sortedUsers.map((user) => (
                                            <TableRow key={user.id}>
                                                <TableCell>
                                                    <Avatar size="xs" name={user.userName} />
                                                </TableCell>
                                                <TableCell>{user.userName}</TableCell>
                                                <TableCell>{user.email}</TableCell>
                                                <TableCell>{user.role}</TableCell>
                                                <TableCell align="center">{getFormattedDate(user.createdAt)}</TableCell>
                                                <TableCell align="center">
                                                    <Link  onClick={() => {}}>
                                                        Редактировать
                                                    </Link>
                                                </TableCell>
                                            </TableRow>
                                        ))
                                    )}
                                </TableBody>
                            </Table>
                        </TableContainer>
                    )}
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

export default UsersList;
