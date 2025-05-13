import { SectionMessage } from '@ozen-ui/kit/SectionMessage';
import { Typography } from '@ozen-ui/kit/Typography';

export const RegistrationPageFooter = () => {
    return (
        <SectionMessage>
            Пример данных для регистрации:{' '}
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
