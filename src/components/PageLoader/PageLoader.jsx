import { Loader } from '@ozen-ui/kit/Loader'
import { Stack } from '@ozen-ui/kit/Stack'
import { Typography } from '@ozen-ui/kit/Typography'

export const PageLoader = ({ size = 'l', text, fullHeight = false }) => {
    return (
        <Stack
            gap="l"
            align="center"
            justify="center"
            direction="column"
            style={{ height: fullHeight ? '100vh' : '50vh' }}
            fullWidth
        >
            <Loader size={size} />
            {text && (
                <Typography variant="text-2xs" color="accentDisabled">
                    {text}
                </Typography>
            )}
        </Stack>
    )
}
