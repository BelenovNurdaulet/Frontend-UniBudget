import { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { Stack } from '@ozen-ui/kit/Stack';
import { Typography } from '@ozen-ui/kit/Typography';
import { Card } from '@ozen-ui/kit/Card';
import { Input } from '@ozen-ui/kit/Input';
import { Textarea } from '@ozen-ui/kit/Textarea';
import { InputNumber } from '@ozen-ui/kit/InputNumber';
import { Select, Option } from '@ozen-ui/kit/Select';
import { FilePicker } from '@ozen-ui/kit/FilePicker';
import { Button } from '@ozen-ui/kit/ButtonNext';
import { Loader } from '@ozen-ui/kit/Loader';
import { Grid, GridItem } from '@ozen-ui/kit/Grid';
import { TengeIcon, DeleteIcon } from '@ozen-ui/icons';

import { useSnackbar } from '@ozen-ui/kit/Snackbar';
import { selectUserData } from '../UserProfle/userSlice';
import { useGetReferenceQuery } from '../reference/referenceApi';
import { useCreateRequestMutation } from './requestApi';

const CreateRequest = () => {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const { pushMessage } = useSnackbar();
    const user = useSelector(selectUserData);

    const initialPeriodId = searchParams.get('periodId') || '';
    const [periodId] = useState(initialPeriodId);
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [amount, setAmount] = useState(0);
    const [categoryId, setCategoryId] = useState('');
    const [subCategoryId, setSubCategoryId] = useState('');
    const [files, setFiles] = useState([]);

    const { data: referenceData, isLoading: isRefLoading } = useGetReferenceQuery();
    const [createRequest, { isLoading: isCreating }] = useCreateRequestMutation();
    const categories = referenceData?.valueOrDefault?.categories || [];

    const handleAmountChange = (e) => {
        const numericValue = Number(e?.target?.value);
        setAmount(!isNaN(numericValue) ? numericValue : 0);
    };

    const handleSubmit = async () => {
        if (!title || !amount || !categoryId) {
            pushMessage({ title: 'Пожалуйста, заполните обязательные поля', status: 'error' });
            return;
        }

        try {
            const formData = new FormData();
            formData.append('PeriodId', periodId);
            formData.append('BranchId', user.branchId);
            formData.append('Title', title);
            formData.append('Description', description);
            formData.append('Amount', String(amount));
            formData.append('RequestCategoryId', categoryId);
            if (subCategoryId) formData.append('RequestSubCategoryId', subCategoryId);
            files.forEach(file => formData.append('Files', file));

            const response = await createRequest(formData).unwrap();
            pushMessage({ title: 'Заявка успешно создана', status: 'success' });

            navigate(`/request/${response.value.id}`);
        } catch (e) {
            const message = e?.data?.[0]?.message || 'Произошла ошибка';
            pushMessage({ title: 'Ошибка', description: message, status: 'error' });
        }
    };

    if (isRefLoading) {
        return (
            <Stack align="center" justify="center" style={{ padding: '2rem' }}>
                <Loader size="l" />
            </Stack>
        );
    }

    const selectedCategory = categories.find(cat => cat.id === categoryId);
    const subCategories = selectedCategory?.subCategories || [];

    return (
        <Stack direction="column" gap="l" fullWidth>
            <Typography variant="heading-xl">Создание заявки</Typography>

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


                        <Select value={categoryId} onChange={setCategoryId} fullWidth label="Категория">
                            {categories.map(cat => (
                                <Option key={cat.id} value={cat.id}>{cat.name}</Option>
                            ))}
                        </Select>

                        {subCategories.length > 0 && (
                            <>
                                <Select value={subCategoryId} onChange={setSubCategoryId}  label="Подкатегория" fullWidth>
                                    {subCategories.map(sub => (
                                        <Option key={sub.id} value={sub.id}>{sub.name}</Option>
                                    ))}
                                </Select>
                            </>
                        )}
                    </GridItem>
                </Grid>
            </Card>

            <Card borderWidth="none">
                <Grid cols={3}>
                    <GridItem col={{ xs: 3, m: 1 }}>
                        <Typography variant="text-xl_1">Файлы</Typography>
                    </GridItem>
                    <GridItem col={{ xs: 3, m: 2 }} as={Stack} gap="l" direction="column">
                        <FilePicker
                            multiple
                            fileList={files}
                            onChange={e => setFiles(Array.from(e.target.files || []))}
                            onClear={() => setFiles([])}
                            required
                            fullWidth
                        />
                        {files.length > 0 && (
                            <Card
                                size="s"
                                borderWidth="m"
                                borderVariant="dashed"
                                backgroundColor="selected"
                                fullWidth
                            >
                                <Stack direction="column" gap="xs" fullWidth>
                                    {files.map((file, index) => (
                                        <Stack
                                            key={index}
                                            direction="row"
                                            align="center"
                                            justify="spaceBetween"
                                            fullWidth
                                        >
                                            <Typography variant="text-s" style={{ flex: 1 }}>{file.name}</Typography>
                                            <Button
                                                size="s"
                                                iconRight={DeleteIcon}
                                                color="error"
                                                variant="function"
                                                onClick={() => setFiles(prev => prev.filter((_, i) => i !== index))}
                                            />
                                        </Stack>
                                    ))}
                                    <Button size="s" color="error" onClick={() => setFiles([])}>
                                        Очистить все
                                    </Button>
                                </Stack>
                            </Card>
                        )}
                    </GridItem>
                </Grid>
            </Card>

            <Stack justify="end" gap="m">
                <Button variant="function" onClick={() => navigate(`/my-requests?periodId=${periodId}`)}>
                    Отмена
                </Button>
                <Button color="primary" onClick={handleSubmit} loading={isCreating}>
                    Создать заявку
                </Button>
            </Stack>
        </Stack>
    );
};

export default CreateRequest;
