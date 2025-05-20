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
import RequestFiles from './RequestFiles' // убедись, что путь указан верно

const RequestInfo = () => {
    const { id } = useParams()
    const { data, isLoading, error, refetch } = useGetRequestByIdQuery(id)

    const getStatusColor = (status) => {
        switch (status) {
            case 'Created':
            case 'ReturnToCreator':
            case 'ReturnToReviewer':
                return 'warning'
            case 'InReview':
            case 'Approved':
                return 'info'
            case 'Submitted':
                return 'success'
            case 'Cancelled':
                return 'error'
            default:
                return 'default'
        }
    }

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

    const {
        requestId,
        title,
        requestStatus,
        requestHistories,
        files = [],
    } = data

    const statusName = REQUEST_STATUSES_CONFIG[requestStatus]?.name || 'Неизвестно'

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <Grid cols={2} align="start">
                <Grid cols={1}>
                    <GridItem>
                        <Typography variant="heading-xl" className={spacing({ mb: 'm' })}>
                            Заявка "{title}"
                        </Typography>
                        <RequestActions request={data} onStatusChanged={refetch} />
                    </GridItem>
                </Grid>
                <Grid cols={1} justify="end">
                    <GridItem row={1}>
                        <Tag
                            as="div"
                            size="m"
                            color={getStatusColor(requestStatus)}
                            label={statusName}
                            style={{ width: 'fit-content' }}
                        />
                    </GridItem>
                </Grid>
            </Grid>

            <MainInfoRequest request={data} />

            <RequestFiles
                files={files}
                requestId={requestId}
                onFilesChanged={refetch}
                canManageFiles={true} // логика прав доступа по необходимости
                canDeleteFiles={true}
            />

            <RequestHistory historyList={requestHistories} />
        </div>
    )
}

export default RequestInfo
