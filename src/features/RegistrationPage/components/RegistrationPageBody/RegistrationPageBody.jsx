import { useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { useNavigate } from 'react-router';
import { useSelector } from 'react-redux';

import { useSnackbar } from '@ozen-ui/kit/Snackbar';
import { Button } from '@ozen-ui/kit/ButtonNext';
import { IconButton } from '@ozen-ui/kit/IconButtonNext';
import { Input } from '@ozen-ui/kit/Input';
import { Select, Option } from '@ozen-ui/kit/Select';
import { Typography } from '@ozen-ui/kit/Typography';
import { Link } from '@ozen-ui/kit/Link';
import { Stack } from '@ozen-ui/kit/Stack';

import { EyeIcon, EyeCrossIcon } from '@ozen-ui/icons';

import { useGetReferenceQuery } from '../../../reference/referenceApi';
import { selectBranches, selectRoles } from '../../../reference/referenceSlice';
import { useRegisterMutation } from '../../../auth/authApi';
import { Paths } from '../../../../path';
import { ROLE_LABELS } from '../../../../utils/roles';

export const RegistrationPageBody = () => {
    const navigate = useNavigate();
    const { pushMessage } = useSnackbar();
    const [showPassword, setShowPassword] = useState(false);

    const { isLoading, error } = useGetReferenceQuery();
    const roles = useSelector(selectRoles);
    const branches = useSelector(selectBranches);

    const [registerUser, { isLoading: isRegistering }] = useRegisterMutation();

    const {
        register,
        control,
        handleSubmit,
        formState: { errors },
    } = useForm({
        defaultValues: {
            userName: '',
            email: '',
            password: '',
            userRole: '',
            branchId: '',
        },
    });

    const onSubmit = async (formData) => {
        try {
            await registerUser({
                userName: formData.userName,
                email: formData.email,
                password: formData.password,
                userRole: parseInt(formData.userRole, 10),
                branchId: parseInt(formData.branchId, 10),
            }).unwrap();

            pushMessage({
                title: 'Успех',
                description: 'Регистрация прошла успешно',
                status: 'success',
            });

            navigate(Paths.login);
        } catch (err) {
            pushMessage({
                title: 'Ошибка',
                description: err?.data?.error || 'Не удалось зарегистрироваться',
                status: 'error',
            });
        }
    };

    if (isLoading || error) return null;

    return (
        <Stack as="form" gap="xl" direction="column" onSubmit={handleSubmit(onSubmit)} fullWidth>
            <Input
                {...register('userName', { required: 'Имя пользователя обязательно' })}
                label="Имя пользователя"
                fullWidth
                required
                error={!!errors.userName}
            />
            {errors.userName && (
                <Typography variant="caption" color="error">
                    {errors.userName.message}
                </Typography>
            )}

            <Input
                {...register('email', {
                    required: 'Email обязателен',
                    pattern: {
                        value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                        message: 'Некорректный email',
                    },
                })}
                label="Email"
                fullWidth
                required
                error={!!errors.email}
            />
            {errors.email && (
                <Typography variant="caption" color="error">
                    {errors.email.message}
                </Typography>
            )}

            <Input
                {...register('password', { required: 'Пароль обязателен' })}
                label="Пароль"
                type={showPassword ? 'text' : 'password'}
                fullWidth
                required
                error={!!errors.password}
                renderRight={({ size }) => (
                    <IconButton
                        size={size}
                        type="button"
                        variant="function"
                        onClick={() => setShowPassword(!showPassword)}
                        icon={showPassword ? EyeCrossIcon : EyeIcon}
                    />
                )}
            />
            {errors.password && (
                <Typography variant="caption" color="error">
                    {errors.password.message}
                </Typography>
            )}

            <Controller
                name="userRole"
                control={control}
                rules={{ required: 'Роль обязательна' }}
                render={({ field }) => (
                    <Select
                        {...field}
                        label="Роль"
                        placeholder="Выберите роль"
                        fullWidth
                        required
                        error={!!errors.userRole}
                    >
                        {roles.map((r) => (
                            <Option key={r.id} value={r.id.toString()}>
                                {ROLE_LABELS[r.id] || `Роль ${r.id}`}
                            </Option>
                        ))}
                    </Select>
                )}
            />
            {errors.userRole && (
                <Typography variant="caption" color="error">
                    {errors.userRole.message}
                </Typography>
            )}

            <Controller
                name="branchId"
                control={control}
                rules={{ required: 'Филиал обязателен' }}
                render={({ field }) => (
                    <Select
                        {...field}
                        label="Филиал"
                        placeholder="Выберите филиал"
                        fullWidth
                        required
                        error={!!errors.branchId}
                    >
                        {branches.map((b) => (
                            <Option key={b.id} value={b.id.toString()}>
                                {b.name}
                            </Option>
                        ))}
                    </Select>
                )}
            />
            {errors.branchId && (
                <Typography variant="caption" color="error">
                    {errors.branchId.message}
                </Typography>
            )}

            <Button type="submit" fullWidth loading={isRegistering} disabled={isRegistering}>
                Зарегистрироваться
            </Button>
            <Link align="center" href={Paths.login}>
                Уже есть аккаунт?
            </Link>
        </Stack>
    );
};
