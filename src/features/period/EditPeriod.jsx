import { useForm, Controller } from 'react-hook-form'
import { useParams, useNavigate } from 'react-router-dom'
import { useEffect } from 'react'
import { useSnackbar } from '@ozen-ui/kit/Snackbar'
import { Typography } from '@ozen-ui/kit/Typography'
import { Button } from '@ozen-ui/kit/ButtonNext'
import { Input } from '@ozen-ui/kit/Input'
import { DatePicker } from '@ozen-ui/kit/DatePicker'
import { Card } from '@ozen-ui/kit/Card'
import { Stack } from '@ozen-ui/kit/Stack'
import { Grid, GridItem } from '@ozen-ui/kit/Grid'
import { spacing } from '@ozen-ui/kit/MixSpacing'
import { useGetPeriodByIdQuery, useUpdatePeriodMutation } from './periodApi'

const EditPeriod = () => {
    const { id } = useParams()
    const navigate = useNavigate()
    const { pushMessage } = useSnackbar()
    const { data: periodData } = useGetPeriodByIdQuery(id)
    const [updatePeriod, { isLoading }] = useUpdatePeriodMutation()

    const { control, handleSubmit, reset } = useForm({
        defaultValues: {
            name: '',
            submissionDate: '',
            submissionTime: '00:00',
            submissionEndDate: '',
            submissionEndTime: '00:00',
            approvalDate: '',
            approvalTime: '00:00',
            approvalEndDate: '',
            approvalEndTime: '00:00',
            executionDate: '',
            executionTime: '00:00',
            executionEndDate: '',
            executionEndTime: '00:00',
        },
    })

    useEffect(() => {
        if (periodData) {
            const toDate = (dt) => dt ? new Date(dt) : ''
            const toTime = (dt) => {
                const d = new Date(dt)
                return `${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}`
            }

            reset({
                name: periodData.name || '',
                submissionDate: toDate(periodData.submissionStartDate),
                submissionTime: toTime(periodData.submissionStartDate),
                submissionEndDate: toDate(periodData.submissionEndDate),
                submissionEndTime: toTime(periodData.submissionEndDate),
                approvalDate: toDate(periodData.approvalStartDate),
                approvalTime: toTime(periodData.approvalStartDate),
                approvalEndDate: toDate(periodData.approvalEndDate),
                approvalEndTime: toTime(periodData.approvalEndDate),
                executionDate: toDate(periodData.executionStartDate),
                executionTime: toTime(periodData.executionStartDate),
                executionEndDate: toDate(periodData.executionEndDate),
                executionEndTime: toTime(periodData.executionEndDate),
            })
        }
    }, [periodData, reset])

    const composeDateTime = (date, time) =>
        new Date(`${new Date(date).toISOString().split('T')[0]}T${time}:00`).toISOString()

    const onSubmit = async (values) => {
        try {
            const payload = {
                periodId: Number(id),
                name: values.name,
                submissionStartDate: composeDateTime(values.submissionDate, values.submissionTime),
                submissionEndDate: composeDateTime(values.submissionEndDate, values.submissionEndTime),
                approvalStartDate: composeDateTime(values.approvalDate, values.approvalTime),
                approvalEndDate: composeDateTime(values.approvalEndDate, values.approvalEndTime),
                executionStartDate: composeDateTime(values.executionDate, values.executionTime),
                executionEndDate: composeDateTime(values.executionEndDate, values.executionEndTime),
            }

            await updatePeriod(payload).unwrap()
            pushMessage({ title: 'Успех', description: 'Период обновлен', status: 'success' })
            navigate(`/periods/${id}`)
        } catch (err) {
            pushMessage({
                title: 'Ошибка',
                description: err?.message || err?.data?.error || 'Не удалось обновить период',
                status: 'error',
            })
        }
    }

    const renderDateTimeGroup = (label, dateName, timeName) => (
        <Grid cols={{ xs: 1, m: 12 }} gap="s" align="center">
            <GridItem col={{ xs: 1, m: 3 }}>
                <Typography variant="text-m">{label}</Typography>
            </GridItem>
            <GridItem col={{ xs: 1, m: 4 }}>
                <Controller
                    name={dateName}
                    control={control}
                    rules={{ required: true }}
                    render={({ field }) => <DatePicker size="s" fullWidth required {...field} />}
                />
            </GridItem>
            <GridItem col={{ xs: 1, m: 5 }}>
                <Controller
                    name={timeName}
                    control={control}
                    render={({ field }) => (
                        <Input type="time" fullWidth required {...field} size="s" />
                    )}
                />
            </GridItem>
        </Grid>
    )

    return (
        <div>
            <Typography variant="heading-xl" className={spacing({ mb: 'm' })}>
                Редактировать бюджетный период
            </Typography>

            <Grid cols={{ xs: 1, m: 12 }} gap="xl">
                <GridItem col={{ xs: 1, m: 12 }}>
                    <Card size="m" shadow="m">
                        <form onSubmit={handleSubmit(onSubmit)}>
                            <Stack direction="column" gap="xl" fullWidth>

                                <Controller
                                    name="name"
                                    control={control}
                                    rules={{ required: true }}
                                    render={({ field }) => (
                                        <Input size="s" label="Название периода" fullWidth required {...field} />
                                    )}
                                />

                                {renderDateTimeGroup('Начало подачи', 'submissionDate', 'submissionTime')}
                                {renderDateTimeGroup('Окончание подачи', 'submissionEndDate', 'submissionEndTime')}
                                {renderDateTimeGroup('Начало согласования', 'approvalDate', 'approvalTime')}
                                {renderDateTimeGroup('Окончание согласования', 'approvalEndDate', 'approvalEndTime')}
                                {renderDateTimeGroup('Начало исполнения', 'executionDate', 'executionTime')}
                                {renderDateTimeGroup('Окончание исполнения', 'executionEndDate', 'executionEndTime')}

                                <Stack justify="end" gap="m" fullWidth>
                                    <Button variant="function" onClick={() => navigate(`/periods/${id}`)}>
                                        Отмена
                                    </Button>
                                    <Button type="submit" variant="contained" loading={isLoading}>
                                        Сохранить изменения
                                    </Button>
                                </Stack>
                            </Stack>
                        </form>
                    </Card>
                </GridItem>
            </Grid>
        </div>
    )
}

export default EditPeriod
