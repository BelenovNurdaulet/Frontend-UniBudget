import { useLoginMutation } from './authApi'
import { useDispatch } from 'react-redux'
import { setCredentials } from './authSlice'
import { Container } from '@ozen-ui/kit/Container'
import { Card } from '@ozen-ui/kit/Card'
import { Button } from '@ozen-ui/kit/ButtonNext'
import { Input } from '@ozen-ui/kit/Input'
import { Typography } from '@ozen-ui/kit/Typography'
import { Stack } from '@ozen-ui/kit/Stack'
import { Link } from '@ozen-ui/kit/Link'
import { useSnackbar } from '@ozen-ui/kit/Snackbar'
import styles from './Login.module.css'
import { SectionMessage } from '@ozen-ui/kit/SectionMessage'
import { useForm } from 'react-hook-form'
import { useNavigate } from 'react-router'
import { Paths } from '../../path'

const Login = () => {
    const dispatch = useDispatch()
    const navigate = useNavigate()
    const { pushMessage } = useSnackbar()

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm({
        defaultValues: {
            email: '',
            password: '',
        },
    })

    const [login, { isLoading }] = useLoginMutation()

    const onSubmit = async (data) => {
        try {
            const response = await login(data).unwrap()
            const { token, email, userName } = response
            dispatch(setCredentials({
                token,
                user: { email, userName },
            }))
            pushMessage({
                title: 'Успешный вход',
                description: 'Вы успешно вошли в систему!',
                status: 'success',
            })
            navigate('/')
        } catch (err) {
            console.error('Failed to login', err)
            pushMessage({
                title: 'Ошибка входа',
                description: err?.data?.error || 'Произошла ошибка при входе.',
                status: 'error',
            })
        }
    }


    return (
        <Container
            className={styles.container}
            position="center"
            gutters={{
                xs: 's',
            }}
            maxWidth={{
                xs: 's',
            }}
        >
            <Card className={styles.card} size="m" background="main" shadow="m">
                <Stack direction="column" gap="xl">
                    <Typography className={styles.Typography} variant="text-2xl">
                        Войдите в приложение{' '}
                    </Typography>
                    <form className={styles.form} onSubmit={handleSubmit(onSubmit)}>
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
                            type="password"
                            id="password"
                            label="Пароль"
                            fullWidth
                            required
                            error={!!errors.password}
                        />
                        {errors.password && (
                            <Typography variant="caption" color="error">
                                {errors.password.message}
                            </Typography>
                        )}
                        <Button
                            color="primary"
                            size="m"
                            variant="contained"
                            fullWidth
                            type="submit"
                            disabled={isLoading}
                            loading={isLoading}
                        >
                            Вперёд
                        </Button>
                        <Link align="center" href={Paths.signup}>
                            У меня нет логина и пароля
                        </Link>
                        <SectionMessage>Для входа в приложение воспользуйтесь своей ю-шкой:</SectionMessage>
                    </form>
                </Stack>
            </Card>
        </Container>
    )
}
export default Login
