import { SectionMessage } from '@ozen-ui/kit/SectionMessage'
import { Typography } from '@ozen-ui/kit/Typography'

export const NetworkErrorMessage = () => {
    return (
        <SectionMessage size="s" status="error">
            <Typography variant="text-s">
                Ваш запрос не может быть обработан из-за проблем в сети.
            </Typography>
        </SectionMessage>
    )
}
