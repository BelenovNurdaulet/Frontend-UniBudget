import { useForm, Controller } from 'react-hook-form'
import { useCreatePeriodMutation } from './periodApi'
import { Typography } from '@ozen-ui/kit/Typography'
import { Button } from '@ozen-ui/kit/ButtonNext'
import { Input } from '@ozen-ui/kit/Input'
import { DatePicker } from '@ozen-ui/kit/DatePicker'
import { useSnackbar } from '@ozen-ui/kit/Snackbar'
import { Card } from '@ozen-ui/kit/Card'
import { Stack } from '@ozen-ui/kit/Stack'
import { Grid, GridItem } from '@ozen-ui/kit/Grid'
import { spacing } from '@ozen-ui/kit/MixSpacing'
import { useNavigate } from 'react-router-dom'

const CreatePeriod = () => {
    const { control, handleSubmit } = useForm({
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

    const { pushMessage } = useSnackbar()
    const [createPeriod, { isLoading }] = useCreatePeriodMutation()
    const navigate = useNavigate()

    const onSubmit = async (values) => {
        const composeDateTime = (date, time) =>
            new Date(`${new Date(date).toISOString().split('T')[0]}T${time}:00`).toISOString()

        try {
            const payload = {
                name: values.name,
                submissionStartDate: composeDateTime(values.submissionDate, values.submissionTime),
                submissionEndDate: composeDateTime(values.submissionEndDate, values.submissionEndTime),
                approvalStartDate: composeDateTime(values.approvalDate, values.approvalTime),
                approvalEndDate: composeDateTime(values.approvalEndDate, values.approvalEndTime),
                executionStartDate: composeDateTime(values.executionDate, values.executionTime),
                executionEndDate: composeDateTime(values.executionEndDate, values.executionEndTime),
            }

            await createPeriod(payload).unwrap()
            pushMessage({ title: 'Успех', description: 'Период успешно создан', status: 'success' })
            navigate('/periods')
        } catch (err) {
            pushMessage({
                title: 'Ошибка',
                description: err?.data?.error || 'Не удалось создать период',
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
                Cоздать бюджетный период
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
                                <Button variant="function" onClick={() => navigate('/periods')}>
                                    Отмена
                                </Button>
                                <Button type="submit" variant="contained" loading={isLoading}>
                                    Создать период
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

export default CreatePeriod
