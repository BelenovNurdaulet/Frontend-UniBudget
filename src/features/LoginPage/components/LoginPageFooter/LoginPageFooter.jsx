import { SectionMessage } from '@ozen-ui/kit/SectionMessage';
import { Typography } from '@ozen-ui/kit/Typography';

export const LoginPageFooter = () => {
    return (
        <SectionMessage>
            Для входа в приложение используйте почту и пароль:{' '}
            <Typography variant="text-m_1" as="span">
                admin@gmail.com
            </Typography>{' '}
            /{' '}
            <Typography variant="text-m_1" as="span">
                123aa!!A
            </Typography>
        </SectionMessage>
    );
};
