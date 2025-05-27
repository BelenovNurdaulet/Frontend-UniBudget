import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Stack } from '@ozen-ui/kit/Stack';
import { Typography } from '@ozen-ui/kit/Typography';
import { Card } from '@ozen-ui/kit/Card';
import { Input } from '@ozen-ui/kit/Input';
import { Textarea } from '@ozen-ui/kit/Textarea';
import { InputNumber } from '@ozen-ui/kit/InputNumber';
import { Button } from '@ozen-ui/kit/ButtonNext';
import { Loader } from '@ozen-ui/kit/Loader';
import { Grid, GridItem } from '@ozen-ui/kit/Grid';
import { TengeIcon } from '@ozen-ui/icons';

import { useSnackbar } from '@ozen-ui/kit/Snackbar';
import { useCreatorRequestMutation } from './requestApi';
import { useGetRequestByIdQuery } from './requestApi';

const EditRequest = () => {
    const { id: requestId } = useParams();

    const navigate = useNavigate();
    const { pushMessage } = useSnackbar();

    const { data: requestData, isLoading: isRequestLoading } = useGetRequestByIdQuery(requestId);
    const [editRequest, { isLoading: isSaving }] = useCreatorRequestMutation();

    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [amount, setAmount] = useState(0);
    const [comment, setComment] = useState('');

    useEffect(() => {
        if (requestData) {
            setTitle(requestData.title || '');
            setDescription(requestData.description || '');
            setAmount(requestData.amount || 0);
        }
    }, [requestData]);

    const handleAmountChange = (e) => {
        const numericValue = Number(e?.target?.value);
        setAmount(!isNaN(numericValue) ? numericValue : 0);
    };
    console.log('requestId из useParams:', requestId);

    const handleSubmit = async () => {
        if (!title || !description || !amount) {
            pushMessage({ title: 'Заполните обязательные поля', status: 'error' });
            return;
        }

        try {
            await editRequest({
                requestId,
                action: 'approve',
                title,
                description,
                comment: comment.trim() || '-',
                amount
            }).unwrap();

            pushMessage({ title: 'Заявка обновлена', status: 'success' });
            navigate(`/request/${requestId}`);
        } catch (e) {
            const message = e?.data?.error || 'Ошибка при обновлении';
            pushMessage({ title: 'Ошибка', description: message, status: 'error' });
        }
    };

    if (isRequestLoading) {
        return (
            <Stack align="center" justify="center" style={{ padding: '2rem' }}>
                <Loader size="l" />
            </Stack>
        );
    }

    return (
        <Stack direction="column" gap="l" fullWidth>
            <Typography variant="heading-xl">Редактирование заявки</Typography>

            <Card borderWidth="none">
                <Grid cols={3}>
                    <GridItem col={{ xs: 3, m: 1 }}>
                        <Typography variant="text-xl_1">Основная информация</Typography>
                    </GridItem>
                    <GridItem col={{ xs: 3, m: 2 }} as={Stack} gap="l" direction="column">
                        <Input value={title} label="Заголовок" onChange={e => setTitle(e.target.value)} fullWidth />
                        <Textarea
                            label="Описание"
                            value={description}
                            onChange={e => setDescription(e.target.value)}
                            fullWidth
                            required
                            expand="verticalResize"
                            maxLength={1000}
                        />
                        <InputNumber
                            label="Сумма"
                            value={amount}
                            onChange={handleAmountChange}
                            renderLeft={TengeIcon}
                            fullWidth
                        />
                        <Input
                            label="Комментарий к изменению"
                            value={comment}
                            onChange={(e) => setComment(e.target.value)}
                            fullWidth
                        />
                    </GridItem>
                </Grid>
            </Card>

            <Stack justify="end" gap="m">
                <Button variant="function" onClick={() => navigate(-1)}>
                    Отмена
                </Button>
                <Button color="primary" onClick={handleSubmit} loading={isSaving}>
                    Сохранить изменения
                </Button>
            </Stack>
        </Stack>
    );
};

export default EditRequest;
