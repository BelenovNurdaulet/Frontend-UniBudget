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
import { useSnackbar } from '@ozen-ui/kit/Snackbar';

import PeriodSelect from '../../components/PeriodSelect/PeriodSelect';
import { selectUserData } from '../UserProfle/userSlice';
import { useGetReferenceQuery } from '../reference/referenceApi';
import { useCreateRequestMutation } from './requestApi';
import {TengeIcon} from "@ozen-ui/icons";

const CreateRequest = () => {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const { pushMessage } = useSnackbar();

    const initialPeriodId = searchParams.get('periodId') || '';
    const user = useSelector(selectUserData);

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

    const handleAmountChange = (event) => {
        const newValue = event?.target?.value;
        const numericValue = Number(newValue);
        setAmount(!isNaN(numericValue) ? numericValue : 0);
    };

    const handleFileChange = (event) => {
        const newFiles = Array.from(event.target.files || []);
        setFiles(newFiles);
    };

    const handleSubmit = async () => {
        if (!title || !amount || !categoryId) {
            pushMessage({
                title: 'Пожалуйста, заполните обязательные поля',
                status: 'error',
            });
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

            pushMessage({
                title: 'Заявка успешно создана',
                status: 'success',
            });

            navigate(`/request/${response.id}`);
        } catch (e) {
            pushMessage({
                title: 'Ошибка при создании заявки',
                status: 'error',
            });
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
            <Card size="m" shadow="m">
                <Stack direction="column" gap="m" fullWidth>


                    <Input
                        label="Заголовок"
                        value={title}
                        onChange={e => setTitle(e.target.value)}
                        required
                        fullWidth
                    />

                    <Textarea
                        label="Описание"
                        value={description}
                        onChange={e => setDescription(e.target.value)}
                        fullWidth
                        expand="verticalResize"

                        maxLength={115}
                    />

                    <InputNumber
                        label="Сумма"
                        value={amount}
                        onChange={handleAmountChange}
                        renderLeft={TengeIcon}
                        required
                        fullWidth
                    />

                    <Select
                        label="Категория"
                        value={categoryId}
                        onChange={setCategoryId}
                        required
                        fullWidth
                    >
                        {categories.map(cat => (
                            <Option key={cat.id} value={cat.id}>
                                {cat.name}
                            </Option>
                        ))}
                    </Select>

                    {subCategories.length > 0 && (
                        <Select
                            label="Подкатегория"
                            value={subCategoryId}
                            onChange={setSubCategoryId}
                            fullWidth
                        >
                            {subCategories.map(sub => (
                                <Option key={sub.id} value={sub.id}>
                                    {sub.name}
                                </Option>
                            ))}
                        </Select>
                    )}

                    <FilePicker
                        label="Файлы"
                        multiple
                        onChange={handleFileChange}
                        fullWidth
                    />

                    {files.length > 0 && (
                        <Stack direction="column" gap="xs">
                            {files.map((file, index) => (
                                <Typography key={index} variant="text-s">{file.name}</Typography>
                            ))}
                        </Stack>
                    )}

                    <Button
                        color="primary"
                        onClick={handleSubmit}
                        loading={isCreating}
                    >
                        Создать заявку
                    </Button>
                </Stack>
            </Card>
        </Stack>
    );
};

export default CreateRequest;
