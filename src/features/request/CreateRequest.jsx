import { useForm, Controller } from 'react-hook-form'

import { useSnackbar } from '@ozen-ui/kit/Snackbar'
import { useGetPeriodsQuery } from '../period/periodApi'
import { useCreateRequestMutation } from './requestApi'
import { Typography } from '@ozen-ui/kit/Typography'
import { Stack } from '@ozen-ui/kit/Stack'
import { Input } from '@ozen-ui/kit/Input'
import { InputNumber } from '@ozen-ui/kit/InputNumber'
import { Select, Option } from '@ozen-ui/kit/Select'
import { Button } from '@ozen-ui/kit/ButtonNext'
import { Card } from '@ozen-ui/kit/Card'
import { FilePicker } from '@ozen-ui/kit/FilePicker'
import styles from './CreateRequest.module.css'
import {spacing} from "@ozen-ui/kit/MixSpacing";

const CreateRequestPage = () => {
    const { pushMessage } = useSnackbar()
    const [createRequest, { isLoading }] = useCreateRequestMutation()
    const { data: periodsData, isLoading: isPeriodsLoading } = useGetPeriodsQuery({ PageNumber: 1, PageSize: 100 })

    const periods = Array.isArray(periodsData?.items) ? periodsData.items : []

    const {
        register,
        handleSubmit,
        control,
        setValue,
        formState: { errors },
        watch,
    } = useForm({ defaultValues: { files: [] } })

    const files = watch('files') || []

    const onSubmit = async (data) => {
        const formData = new FormData()
        formData.append('periodId', data.periodId)
        formData.append('branchId', data.branchId)
        formData.append('title', data.title)
        formData.append('description', data.description)
        formData.append('amount', data.amount)

        data.files.forEach((file) => {
            formData.append('files', file)
        })

        try {
            await createRequest(formData).unwrap()
            pushMessage({ title: 'Успешно', description: 'Заявка создана', status: 'success' })
        } catch (e) {
            pushMessage({ title: 'Ошибка', description: 'Не удалось создать заявку', status: 'error' })
        }
    }

    const handleFileChange = (e) => {
        const newFiles = e.target.files ? Array.from(e.target.files) : []
        setValue('files', [...files, ...newFiles])
    }

    return (

        <Card className={styles.container} size="m">
            <Typography variant="heading-xl">Создание заявки</Typography>
            <form onSubmit={handleSubmit(onSubmit)} className={styles.form}>
                <Stack direction="column" gap="m">
                    <Controller
                        name="periodId"
                        control={control}
                        rules={{ required: 'Выберите период' }}
                        render={({ field }) => (
                            <Select
                                label="Бюджетный период"
                                placeholder={isPeriodsLoading ? 'Загрузка...' : 'Выберите период'}
                                value={field.value || ''}
                                onChange={field.onChange}
                                error={!!errors.periodId}
                                hint={errors.periodId?.message}
                                required
                                fullWidth
                                renderValue={() => {
                                    const selected = periods.find((p) => String(p.id) === String(field.value))
                                    return selected
                                        ? `Период №${selected.id} — ${selected.createdAt.slice(0, 10).split('-').reverse().join('.')}`
                                        : ''
                                }}
                            >
                                {periods.map((period) => (
                                    <Option key={period.id} value={String(period.id)}>
                                        Период №{period.id} — {period.createdAt.slice(0, 10).split('-').reverse().join('.')}
                                    </Option>
                                ))}
                            </Select>
                        )}
                    />

                    <Input label="Филиал" type="number" {...register('branchId', { required: 'Введите ID филиала' })} error={!!errors.branchId} hint={errors.branchId?.message} fullWidth required />
                    <Input label="Заголовок" {...register('title', { required: 'Введите заголовок' })} error={!!errors.title} hint={errors.title?.message} fullWidth required />
                    <Input label="Описание" {...register('description', { required: 'Введите описание' })} error={!!errors.description} hint={errors.description?.message} fullWidth required />
                    <InputNumber label="Сумма" {...register('amount', { required: 'Введите сумму' })} error={!!errors.amount} hint={errors.amount?.message} fullWidth required />

                    <FilePicker
                        multiple
                        fileList={files}
                        label="Файлы"
                        onChange={handleFileChange}
                        onClear={() => setValue('files', [])}
                    />

                    <Button type="submit" variant="contained" color="primary" disabled={isLoading} loading={isLoading}>
                        Создать заявку
                    </Button>
                </Stack>
            </form>
        </Card>

            )
}

export default CreateRequestPage
