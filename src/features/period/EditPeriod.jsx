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

    const renderDateTimeGroup = (dateName, timeName) => (
        <Stack direction="row" gap="l">
            <Controller
                name={dateName}
                control={control}
                rules={{ required: true }}
                render={({ field }) => <DatePicker required {...field} fullWidth />}
            />
            <Controller
                name={timeName}
                control={control}
                render={({ field }) => <Input type="time" required {...field} fullWidth />}
            />
        </Stack>
    )

    return (
        <Stack direction="column" gap="l" fullWidth>
            <Typography variant="heading-xl">Редактировать период</Typography>

            <Card borderWidth="none">
                <Grid cols={3}>
                    <GridItem col={{ xs: 3, m: 1 }}>
                        <Typography variant="text-xl_1">Название</Typography>
                    </GridItem>
                    <GridItem col={{ xs: 3, m: 2 }}>
                        <Controller
                            name="name"
                            control={control}
                            rules={{ required: true }}
                            render={({ field }) => (
                                <Input label="Название периода" fullWidth required {...field} />
                            )}
                        />
                    </GridItem>
                </Grid>
            </Card>

            <Card borderWidth="none">
                <Stack direction="column" gap="l" fullWidth>
                    <Grid cols={3}>
                        <GridItem col={{ xs: 3, m: 1 }}>
                            <Typography variant="text-xl_1">Период подачи заявок</Typography>
                        </GridItem>
                        <GridItem col={{ xs: 3, m: 2 }} as={Stack} gap="l" direction="column">
                            {renderDateTimeGroup('submissionDate', 'submissionTime')}
                            {renderDateTimeGroup('submissionEndDate', 'submissionEndTime')}
                        </GridItem>
                    </Grid>
                </Stack>
            </Card>

            <Card borderWidth="none">
                <Stack direction="column" gap="l" fullWidth>
                    <Grid cols={3}>
                        <GridItem col={{ xs: 3, m: 1 }}>
                            <Typography variant="text-xl_1">Период согласования руководителей</Typography>
                        </GridItem>
                        <GridItem col={{ xs: 3, m: 2 }} as={Stack} gap="l" direction="column">
                            {renderDateTimeGroup('approvalDate', 'approvalTime')}
                            {renderDateTimeGroup('approvalEndDate', 'approvalEndTime')}
                        </GridItem>
                    </Grid>
                </Stack>
            </Card>

            <Card borderWidth="none">
                <Stack direction="column" gap="l" fullWidth>
                    <Grid cols={3}>
                        <GridItem col={{ xs: 3, m: 1 }}>
                            <Typography variant="text-xl_1">Период согласования финансистов</Typography>
                        </GridItem>
                        <GridItem col={{ xs: 3, m: 2 }} as={Stack} gap="l" direction="column">
                            {renderDateTimeGroup('executionDate', 'executionTime')}
                            {renderDateTimeGroup('executionEndDate', 'executionEndTime')}
                        </GridItem>
                    </Grid>
                </Stack>
            </Card>

            <Stack justify="end" gap="m">
                <Button variant="function" onClick={() => navigate(`/periods/${id}`)}>
                    Отмена
                </Button>
                <Button color="primary" onClick={handleSubmit(onSubmit)} loading={isLoading}>
                    Сохранить изменения
                </Button>
            </Stack>
        </Stack>
    )
}

export default EditPeriod
