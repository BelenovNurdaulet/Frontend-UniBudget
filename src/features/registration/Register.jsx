import React from 'react'
import { useForm, Controller } from 'react-hook-form'
import { useRegisterMutation } from '../auth/authApi'
import { useSelector } from 'react-redux'
import { useSnackbar } from '@ozen-ui/kit/Snackbar'
import { Card } from '@ozen-ui/kit/Card'
import { Button } from '@ozen-ui/kit/ButtonNext'
import { Input } from '@ozen-ui/kit/Input'
import { Typography } from '@ozen-ui/kit/Typography'
import { Stack } from '@ozen-ui/kit/Stack'
import { Link } from '@ozen-ui/kit/Link'
import { Select, Option } from '@ozen-ui/kit/Select'
import { useGetReferenceQuery } from '../reference/referenceApi'
import { selectBranches, selectRoles } from '../reference/referenceSlice'
import { useNavigate } from 'react-router'
import { Paths } from '../../path'
import { PageLoader } from '../../components/PageLoader/PageLoader'
import { NetworkErrorMessage } from '../../components/NetworkErrorMessage/NetworkErrorMessage'
import { ErrorFallback } from '../../components/ErrorFallback/ErrorFallback'
import styles from './Register.module.css'

const Register = () => {
  const navigate = useNavigate()
  const { pushMessage } = useSnackbar()

  // запрос списка справочных данных
  const { isLoading, error, refetch } = useGetReferenceQuery()
  const branches = useSelector(selectBranches)
  const roles    = useSelector(selectRoles)

  const [registerUser, { isLoading: isRegistering }] = useRegisterMutation()

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: {
      userName: '',
      email: '',
      password: '',
      userRole: '',    // здесь будет храниться выбранная роль
      branchId: '',
    },
  })

  const onSubmit = async (formData) => {
    try {
      await registerUser({
        userName: formData.userName,
        email:    formData.email,
        password: formData.password,
        userRole: parseInt(formData.userRole, 10),
        branchId: parseInt(formData.branchId, 10),
      }).unwrap()

      pushMessage({ title: 'Успех', description: 'Регистрация прошла успешно', status: 'success' })
      navigate(Paths.login)
    } catch (err) {
      pushMessage({
        title: 'Ошибка',
        description: err?.data?.error || 'Не удалось зарегистрироваться',
        status: 'error',
      })
    }
  }

  if (isLoading) return <PageLoader size="l" />
  if (error) {
    if (!navigator.onLine || error.name === 'FetchError') {
      return <NetworkErrorMessage />
    }
    return <ErrorFallback error={error} resetErrorBoundary={() => refetch()} />
  }

  return (
      <div className={styles.container}>
        <Card className={styles.card}>
          <Stack direction="column" gap="m" className={styles.stack}>
            <Typography className={styles.Typography} variant="text-2xl">
              Регистрация{' '}
            </Typography>
            <form onSubmit={handleSubmit(onSubmit)} className={styles.form}>
              <Controller
                  name="userName"
                  control={control}
                  rules={{ required: 'Имя пользователя обязательно' }}
                  render={({ field }) => (
                      <Input
                          {...field}
                          label="Имя пользователя"
                          placeholder="Введите имя"
                          fullWidth
                          error={!!errors.userName}
                      />
                  )}
              />
              {errors.userName && (
                  <Typography variant="caption" color="error">
                    {errors.userName.message}
                  </Typography>
              )}

              <Controller
                  name="email"
                  control={control}
                  rules={{
                    required: 'Email обязателен',
                    pattern: {
                      value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                      message: 'Некорректный email',
                    },
                  }}
                  render={({ field }) => (
                      <Input
                          {...field}
                          label="Email"
                          placeholder="Введите email"
                          fullWidth
                          error={!!errors.email}
                      />
                  )}
              />
              {errors.email && (
                  <Typography variant="caption" color="error">
                    {errors.email.message}
                  </Typography>
              )}

              <Controller
                  name="password"
                  control={control}
                  rules={{ required: 'Пароль обязателен' }}
                  render={({ field }) => (
                      <Input
                          {...field}
                          type="password"
                          label="Пароль"
                          placeholder="Введите пароль"
                          fullWidth
                          error={!!errors.password}
                      />
                  )}
              />
              {errors.password && (
                  <Typography variant="caption" color="error">
                    {errors.password.message}
                  </Typography>
              )}
              {/* поля userName, email, password… */}

              {/* Роль */}
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
                              {r.name}
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

              {/* Филиал */}
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

              <Button type="submit" fullWidth style={{ marginTop: '1rem' }} loading={isRegistering}>
                Зарегистрироваться
              </Button>
              <Link align="center" href={Paths.login}>
                Уже есть аккаунт?
              </Link>
            </form>
          </Stack>
        </Card>
      </div>
  )
}

export default Register
