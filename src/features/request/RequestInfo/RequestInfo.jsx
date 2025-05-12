import { useParams } from 'react-router-dom'
import { Typography } from '@ozen-ui/kit/Typography'
import { Stack } from '@ozen-ui/kit/Stack'
import { spacing } from '@ozen-ui/kit/MixSpacing'
import { Tag } from '@ozen-ui/kit/TagNext'
import { Grid, GridItem } from '@ozen-ui/kit/Grid'
import MainInfoRequest from './MainInfoRequest'
import RequestHistory from './RequestHistory'
import { NetworkErrorMessage } from '../../../components/NetworkErrorMessage/NetworkErrorMessage.jsx'
import { useGetRequestByIdQuery } from '../requestApi.js'
import { PageLoader } from '../../../components/PageLoader/PageLoader.jsx'
import { ErrorFallback } from '../../../components/ErrorFallback/ErrorFallback.jsx'
import RequestActions from './RequestActions.jsx'
import { REQUEST_STATUSES_CONFIG } from '../../../utils/status/statusConfig.js'

const RequestInfo = () => {
    const { id } = useParams()
    const { data, isLoading, error, refetch } = useGetRequestByIdQuery(id)

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

    const { requestId, requestStatus, requestHistories } = data
    const statusName = REQUEST_STATUSES_CONFIG[requestStatus]?.name || 'Неизвестно'

    return (
        <div
            style={{
                maxWidth: '900px',
                margin: '0 auto',
                padding: '2rem',
                display: 'flex',
                flexDirection: 'column',
                gap: '1rem',
            }}
        >
            <Grid cols={2} align="start">
                <Grid cols={1}>
                    <GridItem>
                        <Typography variant="heading-xl" className={spacing({ mb: 'm' })}>
                            Заявка №{requestId}
                        </Typography>
                        <RequestActions request={data} onStatusChanged={refetch} />
                    </GridItem>
                </Grid>
                <Grid cols={1} justify="end">
                    <GridItem row={1}>
                        <Tag
                            as="div"
                            size="m"
                            variant="secondary"
                            label={statusName}
                            style={{ width: 'fit-content' }}
                        />
                    </GridItem>
                </Grid>
            </Grid>

            <MainInfoRequest request={data} />
            <RequestHistory historyList={requestHistories} />
        </div>
    )
}

export default RequestInfo
