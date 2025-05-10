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
import styles from './CreatePeriod.module.css'

const CreatePeriod = () => {
    const { control, handleSubmit, reset } = useForm({
        defaultValues: {
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

    const onSubmit = async (values) => {
        try {
            const composeDateTime = (date, time) =>
                new Date(`${new Date(date).toISOString().split('T')[0]}T${time}:00`).toISOString()

            const payload = {
                submissionStartDate: composeDateTime(values.submissionDate, values.submissionTime),
                submissionEndDate: composeDateTime(values.submissionEndDate, values.submissionEndTime),
                approvalStartDate: composeDateTime(values.approvalDate, values.approvalTime),
                approvalEndDate: composeDateTime(values.approvalEndDate, values.approvalEndTime),
                executionStartDate: composeDateTime(values.executionDate, values.executionTime),
                executionEndDate: composeDateTime(values.executionEndDate, values.executionEndTime),
            }

            await createPeriod(payload).unwrap()
            pushMessage({
                title: 'Успех',
                description: 'Период успешно создан',
                status: 'success',
            })
            reset()
        } catch (err) {
            console.error('Ошибка при создании периода:', err)
            pushMessage({
                title: 'Ошибка',
                description: err?.data?.error || 'Не удалось создать период',
                status: 'error',
            })
        }
    }

    return (
        <Card className={styles.container} size="m" shadow="m">
            <Typography variant="heading-xl">Создать период</Typography>
            <form onSubmit={handleSubmit(onSubmit)} className={styles.form}>
                <Stack direction="column" gap="m">
                    {/* Submission Start */}
                    <Grid cols={2} gap="m">
                        <GridItem>
                            <Controller
                                name="submissionDate"
                                control={control}
                                rules={{ required: 'Укажите дату начала подачи' }}
                                render={({ field }) => (
                                    <DatePicker label="Дата начала подачи" {...field} fullWidth required />
                                )}
                            />
                        </GridItem>
                        <GridItem>
                            <Controller
                                name="submissionTime"
                                control={control}
                                render={({ field }) => (
                                    <Input label="Время начала подачи" type="time" {...field} fullWidth />
                                )}
                            />
                        </GridItem>
                    </Grid>

                    {/* Submission End */}
                    <Grid cols={2} gap="m">
                        <GridItem>
                            <Controller
                                name="submissionEndDate"
                                control={control}
                                rules={{ required: 'Укажите дату окончания подачи' }}
                                render={({ field }) => (
                                    <DatePicker label="Дата окончания подачи" {...field} fullWidth required />
                                )}
                            />
                        </GridItem>
                        <GridItem>
                            <Controller
                                name="submissionEndTime"
                                control={control}
                                render={({ field }) => (
                                    <Input label="Время окончания подачи" type="time" {...field} fullWidth />
                                )}
                            />
                        </GridItem>
                    </Grid>

                    {/* Approval Start */}
                    <Grid cols={2} gap="m">
                        <GridItem>
                            <Controller
                                name="approvalDate"
                                control={control}
                                rules={{ required: 'Укажите дату начала согласования' }}
                                render={({ field }) => (
                                    <DatePicker label="Дата начала согласования" {...field} fullWidth required />
                                )}
                            />
                        </GridItem>
                        <GridItem>
                            <Controller
                                name="approvalTime"
                                control={control}
                                render={({ field }) => (
                                    <Input label="Время начала согласования" type="time" {...field} fullWidth />
                                )}
                            />
                        </GridItem>
                    </Grid>

                    {/* Approval End */}
                    <Grid cols={2} gap="m">
                        <GridItem>
                            <Controller
                                name="approvalEndDate"
                                control={control}
                                rules={{ required: 'Укажите дату окончания согласования' }}
                                render={({ field }) => (
                                    <DatePicker label="Дата окончания согласования" {...field} fullWidth required />
                                )}
                            />
                        </GridItem>
                        <GridItem>
                            <Controller
                                name="approvalEndTime"
                                control={control}
                                render={({ field }) => (
                                    <Input label="Время окончания согласования" type="time" {...field} fullWidth />
                                )}
                            />
                        </GridItem>
                    </Grid>

                    {/* Execution Start */}
                    <Grid cols={2} gap="m">
                        <GridItem>
                            <Controller
                                name="executionDate"
                                control={control}
                                rules={{ required: 'Укажите дату начала исполнения' }}
                                render={({ field }) => (
                                    <DatePicker label="Дата начала исполнения" {...field} fullWidth required />
                                )}
                            />
                        </GridItem>
                        <GridItem>
                            <Controller
                                name="executionTime"
                                control={control}
                                render={({ field }) => (
                                    <Input label="Время начала исполнения" type="time" {...field} fullWidth />
                                )}
                            />
                        </GridItem>
                    </Grid>

                    {/* Execution End */}
                    <Grid cols={2} gap="m">
                        <GridItem>
                            <Controller
                                name="executionEndDate"
                                control={control}
                                rules={{ required: 'Укажите дату окончания исполнения' }}
                                render={({ field }) => (
                                    <DatePicker label="Дата окончания исполнения" {...field} fullWidth required />
                                )}
                            />
                        </GridItem>
                        <GridItem>
                            <Controller
                                name="executionEndTime"
                                control={control}
                                render={({ field }) => (
                                    <Input label="Время окончания исполнения" type="time" {...field} fullWidth />
                                )}
                            />
                        </GridItem>
                    </Grid>

                    <Button type="submit" variant="contained" color="primary" loading={isLoading}>
                        Создать период
                    </Button>
                </Stack>
            </form>
        </Card>
    )
}

export default CreatePeriod