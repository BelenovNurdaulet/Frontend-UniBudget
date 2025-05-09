import { Button } from '@ozen-ui/kit/ButtonNext'
import { Stack } from '@ozen-ui/kit/Stack'
import { Typography } from '@ozen-ui/kit/Typography'

export const ErrorFallback = ({ error, resetErrorBoundary }) => {
    const handleClick = () => {
        resetErrorBoundary()
    }

    return (
        <Stack
            gap="l"
            align="center"
            justify="center"
            direction="column"
            style={{ height: '50vh' }}
            fullWidth
        >
            <Typography variant="text-l" color="error">
                Что-то пошло не так
            </Typography>
            <Typography variant="text-s" color="error">
                {error.message}
            </Typography>
            <Button onClick={handleClick} color="primary" variant="contained">
                Попробовать снова
            </Button>
        </Stack>
    )
}
