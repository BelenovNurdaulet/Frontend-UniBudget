import {useForm, Controller} from 'react-hook-form'
import {useCreatePeriodMutation} from './periodApi'
import {Typography} from '@ozen-ui/kit/Typography'
import {Button} from '@ozen-ui/kit/ButtonNext'
import {Input} from '@ozen-ui/kit/Input'
import {DatePicker} from '@ozen-ui/kit/DatePicker'
import {useSnackbar} from '@ozen-ui/kit/Snackbar'
import {Card} from '@ozen-ui/kit/Card'
import {Stack} from '@ozen-ui/kit/Stack'
import {Grid, GridItem} from '@ozen-ui/kit/Grid'
import {useNavigate} from 'react-router-dom'

const CreatePeriod = () => {
    const {control, handleSubmit} = useForm({
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

    const {pushMessage} = useSnackbar()
    const [createPeriod, {isLoading}] = useCreatePeriodMutation()
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
            pushMessage({title: 'Успех', description: 'Период успешно создан', status: 'success'})
            navigate('/periods')
        } catch (err) {
            pushMessage({
                title: 'Ошибка',
                description: err?.data?.error || 'Не удалось создать период',
                status: 'error',
            })
        }
    }

    const renderDateTimeGroup = (dateName, timeName) => (

        <Stack direction="row" gap="l">
            <Controller
                name={dateName}
                control={control}
                rules={{required: true}}
                render={({field}) =>
                    <DatePicker required {...field} fullWidth/>}
            />
            <Controller
                name={timeName}
                control={control}
                render={({field}) =>
                    <Input type="time" required {...field} fullWidth/>}
            />
        </Stack>

    )


    return (
        <Stack direction="column" gap="l" fullWidth>
            <Typography variant="heading-xl">Создание периода</Typography>

            <Card borderWidth="none">
                <Grid cols={3}>
                    <GridItem col={{xs: 3, m: 1}}>
                        <Typography variant="text-xl_1">Название</Typography>
                    </GridItem>
                    <GridItem col={{xs: 3, m: 2}}>
                        <Controller
                            name="name"
                            control={control}
                            rules={{required: true}}
                            render={({field}) => (
                                <Input label="Название периода" fullWidth required {...field} />
                            )}
                        />
                    </GridItem>
                </Grid>
            </Card>

            <Card borderWidth="none">
                <Stack direction="column" gap="l" fullWidth>
                    <Grid cols={3}>
                        <GridItem col={{xs: 3, m: 1}}>
                            <Typography variant="text-xl_1">Период подачи заявок</Typography>
                        </GridItem>
                        <GridItem col={{xs: 3, m: 2}} as={Stack} gap="l" direction="column">
                            {renderDateTimeGroup('submissionDate', 'submissionTime')}
                            {renderDateTimeGroup('submissionEndDate', 'submissionEndTime')}
                        </GridItem>
                    </Grid>
                </Stack>
            </Card>

            <Card borderWidth="none">
                <Stack direction="column" gap="l" fullWidth>
                    <Grid cols={3}>
                        <GridItem col={{xs: 3, m: 1}}>
                            <Typography variant="text-xl">Период согласования руководителей</Typography>
                        </GridItem>
                        <GridItem col={{xs: 3, m: 2}} as={Stack} gap="l" direction="column">
                            {renderDateTimeGroup('approvalDate', 'approvalTime')}
                            {renderDateTimeGroup('approvalEndDate', 'approvalEndTime')}
                        </GridItem>
                    </Grid>
                </Stack>
            </Card>

            <Card borderWidth="none">

                <Stack direction="column" gap="l" fullWidth>
                    <Grid cols={3}>
                        <GridItem col={{xs: 3, m: 1}}>
                            <Typography variant="text-xl_1">Период согласования финансистов</Typography>
                        </GridItem>
                        <GridItem col={{xs: 3, m: 2}} as={Stack} gap="l" direction="column">
                            {renderDateTimeGroup('executionDate', 'executionTime')}
                            {renderDateTimeGroup('executionEndDate', 'executionEndTime')}
                        </GridItem>
                    </Grid>
                </Stack>

            </Card>

            <Stack justify="end" gap="m">
                <Button variant="function" onClick={() => navigate('/periods')}>
                    Отмена
                </Button>
                <Button color="primary" onClick={handleSubmit(onSubmit)} loading={isLoading}>
                    Создать период
                </Button>
            </Stack>
        </Stack>
    );
};

export default CreatePeriod;