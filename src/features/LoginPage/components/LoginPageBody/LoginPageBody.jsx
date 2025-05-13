import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router';
import { useDispatch } from 'react-redux';

import { EyeCrossIcon, EyeIcon } from '@ozen-ui/icons';
import { Button } from '@ozen-ui/kit/ButtonNext';
import { IconButton } from '@ozen-ui/kit/IconButtonNext';
import { Link } from '@ozen-ui/kit/Link';
import { Stack } from '@ozen-ui/kit/Stack';
import { Typography } from '@ozen-ui/kit/Typography';
import { useSnackbar } from '@ozen-ui/kit/Snackbar';

import { Input } from '@ozen-ui/kit/Input';


import {setCredentials} from "../../../auth/authSlice.js";
import {Paths} from "../../../../path.js";
import {useLoginMutation} from "../../../auth/authApi.js";

export const LoginPageBody = () => {
    const [showPassword, setShowPassword] = useState(false);
    const [login, { isLoading }] = useLoginMutation();
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { pushMessage } = useSnackbar();

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm({
        defaultValues: {
            email: '',
            password: '',
        },
    });

    const onSubmit = async (data) => {
        try {
            const response = await login(data).unwrap();
            const { token, email, userName } = response;

            dispatch(setCredentials({
                token,
                user: { email, userName },
            }));

            pushMessage({
                title: 'Успешный вход',
                description: 'Вы успешно вошли в систему!',
                status: 'success',
            });

            navigate('/');
        } catch (err) {
            pushMessage({
                title: 'Ошибка входа',
                description: err?.data?.error || 'Произошла ошибка при входе.',
                status: 'error',
            });
        }
    };

    return (
        <Stack
            as="form"
            gap="xl"
            direction="column"
            onSubmit={handleSubmit(onSubmit)}
            fullWidth

        >
            <Input
                {...register('email', {
                    required: 'Email обязателен',
                    pattern: {
                        value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                        message: 'Введите корректный email',
                    },
                })}
                name="email"
                id="email"
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
                {...register('password', {
                    required: 'Пароль обязателен',
                })}
                name="password"
                id="password"
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

            <Button
                type="submit"
                fullWidth
                loading={isLoading}
                disabled={isLoading}
            >
                Вперёд
            </Button>
            <Link align="center" href={Paths.signup}>
                У меня нет логина и пароля
            </Link>

        </Stack>
    );
};
