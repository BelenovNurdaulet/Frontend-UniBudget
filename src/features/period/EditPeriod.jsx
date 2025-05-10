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
import styles from './CreatePeriod.module.css'
import { useGetPeriodByIdQuery, useUpdatePeriodMutation } from './periodApi'

const EditPeriod = () => {
    const { id } = useParams()
    const navigate = useNavigate()
    const { pushMessage } = useSnackbar()
    const { data: periodData } = useGetPeriodByIdQuery(id)
    const [updatePeriod, { isLoading: isUpdating }] = useUpdatePeriodMutation()

    const { control, handleSubmit, reset } = useForm({
        defaultValues: {
            submissionDate: null,
            submissionTime: '00:00',
            submissionEndDate: null,
            submissionEndTime: '00:00',
            approvalDate: null,
            approvalTime: '00:00',
            approvalEndDate: null,
            approvalEndTime: '00:00',
            executionDate: null,
            executionTime: '00:00',
            executionEndDate: null,
            executionEndTime: '00:00',
        },
    })

    useEffect(() => {
        if (periodData) {
            const toDate = (dt) => {
                try {
                    return new Date(dt)
                } catch {
                    return null
                }
            }
            const toTime = (dt) => {
                try {
                    const d = new Date(dt)
                    return `${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}`
                } catch {
                    return '00:00'
                }
            }

            reset({
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

    const combineDateAndTime = (date, time) => {
        if (!date || !time) throw new Error('Неверные дата или время')
        const [hours, minutes] = time.split(':').map(Number)
        const year = date.getFullYear()
        const month = date.getMonth()
        const day = date.getDate()
        return new Date(Date.UTC(year, month, day, hours, minutes, 0)).toISOString()
    }


    const onSubmit = async (values) => {
        try {
            const payload = {
                periodId: Number(id),
                submissionStartDate: combineDateAndTime(values.submissionDate, values.submissionTime),
                submissionEndDate: combineDateAndTime(values.submissionEndDate, values.submissionEndTime),
                approvalStartDate: combineDateAndTime(values.approvalDate, values.approvalTime),
                approvalEndDate: combineDateAndTime(values.approvalEndDate, values.approvalEndTime),
                executionStartDate: combineDateAndTime(values.executionDate, values.executionTime),
                executionEndDate: combineDateAndTime(values.executionEndDate, values.executionEndTime),
            }

            await updatePeriod(payload).unwrap()
            pushMessage({ title: 'Успех', description: 'Период обновлен', status: 'success' })
            navigate(`/period/${id}`)
        } catch (err) {
            pushMessage({
                title: 'Ошибка',
                description: err?.message || err?.data?.error || 'Не удалось обновить период',
                status: 'error',
            })
        }
    }

    return (
        <Card className={styles.container} size="m" shadow="m">
            <Typography variant="heading-xl">Редактировать период</Typography>
            <form onSubmit={handleSubmit(onSubmit)} className={styles.form}>
                <Stack direction="column" gap="m">
                    {[
                        ['submissionDate', 'submissionTime', 'Подача с'],
                        ['submissionEndDate', 'submissionEndTime', 'Подача по'],
                        ['approvalDate', 'approvalTime', 'Согласование с'],
                        ['approvalEndDate', 'approvalEndTime', 'Согласование по'],
                        ['executionDate', 'executionTime', 'Исполнение с'],
                        ['executionEndDate', 'executionEndTime', 'Исполнение по'],
                    ].map(([dateField, timeField, label], idx) => (
                        <Grid key={idx} cols={2} gap="m">
                            <GridItem col={1}>
                                <Controller
                                    name={dateField}
                                    control={control}
                                    rules={{ required: true }}
                                    render={({ field }) => (
                                        <DatePicker label={label} {...field} fullWidth required />
                                    )}
                                />
                            </GridItem>
                            <GridItem col={1}>
                                <Controller
                                    name={timeField}
                                    control={control}
                                    render={({ field }) => (
                                        <Input label="Время" type="time" {...field} fullWidth />
                                    )}
                                />
                            </GridItem>
                        </Grid>
                    ))}

                    <Button type="submit" variant="contained" color="primary" loading={isUpdating}>
                        Сохранить изменения
                    </Button>
                </Stack>
            </form>
        </Card>
    )
}

export default EditPeriod