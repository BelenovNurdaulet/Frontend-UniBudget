import {Typography} from "@ozen-ui/kit/Typography";
import {Divider} from "@ozen-ui/kit/Divider";
import {Card} from "@ozen-ui/kit/Card";
import {Stack} from "@ozen-ui/kit/Stack";

const UserProfile = () => {
    return (
        <Stack gap="2xl">
            <Card>

                <Stack gap="xl" direction="column">
                    <Typography variant="heading-2xl">
                        Система управления бюджетными заявками
                    </Typography>
                    <Typography variant="text-l">
                        Это специализированное ПО для автоматизации процессов подачи, согласования и утверждения финансовых заявок. Система помогает эффективно взаимодействовать сотрудникам, руководителям и финансовым отделам, способствуя рациональному распределению бюджета.
                    </Typography>
                    <Divider />
                    <Typography variant="heading-xl">Ключевые функции:</Typography>
                    <ul>
                        <li><Typography>Создание и подача заявок с обоснованиями и целями.</Typography></li>
                        <li><Typography>Согласование заявок руководителями подразделений.</Typography></li>
                        <li><Typography>Утверждение заявок финансовым отделом с расчетом сумм.</Typography></li>
                        <li><Typography>Мониторинг статусов и уведомления для участников.</Typography></li>
                        <li><Typography>Управление бюджетными периодами с четкими временными рамками.</Typography></li>
                    </ul>
                    <Typography variant="heading-xl">Преимущества:</Typography>
                    <ul>
                        <li><Typography>Прозрачность и контроль всех этапов обработки заявок.</Typography></li>
                        <li><Typography>Повышение эффективности за счет автоматизации.</Typography></li>
                        <li><Typography>Инструменты для анализа и контроля бюджета.</Typography></li>
                        <li><Typography>Своевременное информирование всех участников процесса.</Typography></li>
                    </ul>
                    <Typography>
                        Система способствует оптимизации внутренних процессов и финансовой дисциплины, формируя упорядоченный механизм управления ресурсами.
                    </Typography>
                </Stack>

            </Card>


        </Stack>
    );
}

export default UserProfile