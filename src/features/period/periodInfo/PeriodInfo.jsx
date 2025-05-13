import { useParams } from 'react-router-dom'

import { Typography } from '@ozen-ui/kit/Typography'
import { Tag } from '@ozen-ui/kit/TagNext'
import { Stack } from '@ozen-ui/kit/Stack'
import { spacing } from '@ozen-ui/kit/MixSpacing'
import { Grid, GridItem } from '@ozen-ui/kit/Grid'
import MainInfoPeriod from './MainInfoPeriod'
import PeriodHistory from './PeriodHistory'
import {PageLoader} from "../../../components/PageLoader/PageLoader.jsx";
import {ErrorFallback} from "../../../components/ErrorFallback/ErrorFallback.jsx";
import {NetworkErrorMessage} from "../../../components/NetworkErrorMessage/NetworkErrorMessage.jsx";
import {useGetPeriodByIdQuery} from "../periodApi.js";
import PeriodActions from './PeriodActions'

const PeriodInfo = () => {
    const { id } = useParams()
    const { data, isLoading, error, refetch } = useGetPeriodByIdQuery(id)

    if (isLoading) return <PageLoader size="l" fullHeight />
    if (error) {
        if (!navigator.onLine || error.name === 'FetchError') return <NetworkErrorMessage />
        return <ErrorFallback error={error} resetErrorBoundary={() => refetch()} />
    }

    if (!data) {
        return (
            <Stack justify="center" align="center" style={{ marginTop: '4rem' }}>
                <Typography>Нет данных</Typography>
            </Stack>
        )
    }

    const { id: periodId, name , periodHistories } = data

    return (
        <div

        >
            <Grid cols={2} align="start">
                <Grid cols={1}>
                    <GridItem>
                        <Typography variant="heading-xl" className={spacing({ mb: 'm' })}>
                            Бюджетный период "{name}"
                        </Typography>

                    </GridItem>
                </Grid>
                <Grid cols={1} justify="end">
                    <GridItem row={1}>
                        <PeriodActions period={data} />
                    </GridItem>
                </Grid>
            </Grid>

            <MainInfoPeriod period={data} />
            <PeriodHistory periodHistories={periodHistories} showTotalDuration={false} />
        </div>
    )
}

export default PeriodInfo
