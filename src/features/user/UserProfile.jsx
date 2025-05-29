

import {useMemo, useState} from 'react';
import {useBoolean} from "@ozen-ui/kit/useBoolean";
import {useSnackbar} from "@ozen-ui/kit/Snackbar";
import {Stack} from "@ozen-ui/kit/Stack";
import {Avatar} from "@ozen-ui/kit/Avatar";
import {Typography} from "@ozen-ui/kit/Typography";
import {Button} from "@ozen-ui/kit/ButtonNext";
import {Drawer, DrawerBody, DrawerHeader} from "@ozen-ui/kit/Drawer";
import {Input} from "@ozen-ui/kit/Input";
import {useGetCurrentUserQuery, useUpdateUserMutation} from "../UserProfle/userApi.js";
import {useSelector} from "react-redux";
import {selectBranches} from "../reference/referenceSlice.js";
import {Card} from "@ozen-ui/kit/Card";
import {Grid, GridItem} from "@ozen-ui/kit/Grid";



const UserProfile = () => {
    const { data: user } = useGetCurrentUserQuery();
    const [updateUser] = useUpdateUserMutation();
    const [drawerOpen, { on: openDrawer, off: closeDrawer }] = useBoolean();
    const { pushMessage } = useSnackbar();

    const branches = useSelector(selectBranches);
    const branchesMap = useMemo(() => {
        return branches.reduce((acc, branch) => {
            acc[branch.id] = branch.name;
            return acc;
        }, {});
    }, [branches]);

    const [formData, setFormData] = useState({ userName: '', email: '' });

    const handleEdit = () => {
        setFormData({
            userName: user?.userName || '',
            email: user?.email || '',
        });
        openDrawer();
    };

    const handleChange = (field) => (event) => {
        setFormData({ ...formData, [field]: event.target.value });
    };

    const handleSave = async () => {
        try {
            await updateUser({
                userId: user.id,
                userName: formData.userName,
                email: formData.email,
                userRole: user.role,
                branchId: user.branchId,
            }).unwrap();
            pushMessage({ title: 'Профиль обновлен', status: 'success' });
            closeDrawer();
        } catch {
            pushMessage({ title: 'Ошибка при обновлении', status: 'error' });
        }
    };

    if (!user) return null;

    return (
        <>


                    <Stack direction="column" align="center" fullWidth >
                        <Stack
                            align="center"
                            justify="center"
                            direction="column"
                            gap="xl"
                            fullWidth

                        >
                            <Avatar
                                size="xl"
                                name={user.userName}
                                src={user.avatar?.url}
                            />
                            <Stack direction="column" gap="xs" style={{padding:'10px'}}>
                                <Typography variant="text-xl_1" align="center">
                                    {user.userName}
                                </Typography>

                            </Stack>
                        </Stack>

                        <Stack align="center" justify="center" >
                            <Button onClick={handleEdit} fullWidth>
                                Редактировать
                            </Button>
                        </Stack>
                    </Stack>
            <Card size="m" shadow="m" borderWidth="none">
                    {/* Правая колонка */}
                    <Stack direction="column" gap="xl" fullWidth>
                        <Typography variant="text-xl_1">Основная информация</Typography>
                        <Grid cols={{ xs: 1, m: 2 }} gap="l">
                            <GridItem as={Card} borderWidth="s">
                                <Typography variant="text-s" color="tertiary" м>
                                    ФИО
                                </Typography>
                                <Typography variant="text-m_1">{user.userName}</Typography>
                            </GridItem>

                            <GridItem as={Card} borderWidth="s">
                                <Typography variant="text-s" color="tertiary" м>
                                    Почта
                                </Typography>
                                <Typography variant="text-m_1">{formData.email || '—'}</Typography>
                            </GridItem>

                            <GridItem as={Card} borderWidth="s">
                                <Typography variant="text-s" color="tertiary" м>
                                    Филиал
                                </Typography>
                                <Typography variant="text-m_1">
                                    {branchesMap[user.branchId] || 'Неизвестно'}
                                </Typography>
                            </GridItem>

                            <GridItem as={Card} borderWidth="s">
                                <Typography variant="text-s" color="tertiary" м>
                                    Роль
                                </Typography>
                                <Typography variant="text-m_1">{user.role}</Typography>
                            </GridItem>
                        </Grid>
                    </Stack>

            </Card>

            <Drawer open={drawerOpen} onClose={closeDrawer} size="m">
                <DrawerHeader title="Редактировать профиль" />
                <DrawerBody>
                    <Stack direction="column" gap="l" fullWidth>
                        <Input
                            label="Имя пользователя"
                            value={formData.userName}
                            onChange={handleChange('userName')}
                        />
                        <Input
                            label="Email"
                            value={formData.email}
                            onChange={handleChange('email')}
                        />
                        <Button variant="contained" onClick={handleSave}>
                            Сохранить
                        </Button>
                    </Stack>
                </DrawerBody>
            </Drawer>
        </>
    );
};

export default UserProfile;
