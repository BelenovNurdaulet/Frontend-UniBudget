// src/features/common/ErrorPage.jsx
import { Button } from '@ozen-ui/kit/ButtonNext';
import { Stack } from '@ozen-ui/kit/Stack';
import { Typography } from '@ozen-ui/kit/Typography';
import { Link } from 'react-router-dom';

const CONFIG = {
    403: {
        title: 'Нет доступа',
        message: 'У вас недостаточно прав для просмотра данной страницы.',
        buttonText: 'На главную',
        buttonLink: '/'
    },
    404: {
        title: 'Страница не найдена',
        message: 'К сожалению, такой страницы не существует.',
        buttonText: 'Вернуться домой',
        buttonLink: '/'
    }
};

export default function ErrorPage({ code = 404 }) {
    const { title, message, buttonText, buttonLink } = CONFIG[code] || CONFIG[404];

    return (
        <Stack
            direction="column"
            align="center"
            gap="m"
            fullWidth
            style={{ marginTop: '2rem' }}
        >
            <Typography variant="heading-xl">{title}</Typography>
            <Typography variant="text-l">{message}</Typography>
            <Button as={Link} to={buttonLink}>
                {buttonText}
            </Button>
        </Stack>
    );
}
