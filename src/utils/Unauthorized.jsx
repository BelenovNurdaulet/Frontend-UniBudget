import { Button } from '@ozen-ui/kit/ButtonNext'
import { Stack } from '@ozen-ui/kit/Stack'
import { Typography } from '@ozen-ui/kit/Typography'
import { Link } from 'react-router-dom'

const Unauthorized = () => {
    return (
        <Stack direction="column" align="center" gap="m" fullWidth style={{ marginTop: '2rem' }}>
            <Typography variant="heading-xl">Нет доступа</Typography>
            <Typography variant="text-l">
                У вас недостаточно прав для просмотра данной страницы
            </Typography>
            <Button as={Link} to="/">
                На главную
            </Button>
        </Stack>
    )
}

export default Unauthorized
