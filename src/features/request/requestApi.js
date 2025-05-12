import { apiSlice } from '../../app/api/apiSlice'

export const requestApi = apiSlice.injectEndpoints({
    endpoints: (builder) => ({

        getRequestById: builder.query({
            query: (id) => `/api/request/${id}`,
            refetchOnMountOrArgChange: true,
            keepUnusedDataFor: 0,
        }),

        createRequest: builder.mutation({
            query: (body) => ({
                url: '/api/request',
                method: 'POST',
                body,
            }),
        }),

        getRequests: builder.query({
            // Деструктурируем точно те же поля, что и передаем из компонента:
            query: ({ PeriodId, PageNumber, PageSize }) => {
                const params = new URLSearchParams()
                if (PeriodId != null)  params.set('PeriodId', String(PeriodId))
                if (PageNumber != null) params.set('PageNumber', String(PageNumber))
                if (PageSize != null)   params.set('PageSize', String(PageSize))
                return `/api/request?${params.toString()}`
            },
            refetchOnMountOrArgChange: true,
            keepUnusedDataFor: 0,
        }),

        getMyRequestsByPeriodId: builder.query({
            query: (periodId) => `/api/request/${periodId}/my`,
            refetchOnMountOrArgChange: true,
            keepUnusedDataFor: 0,
        }),

        manageRequest: builder.mutation({
            query: ({ requestId, action, comment }) => ({
                url: '/api/request/manage',
                method: 'PATCH',
                body: { requestId, action, comment },
            }),
        }),

        approveRequest: builder.mutation({
            query: ({ requestId, action, comment }) => ({
                url: '/api/request/approve',
                method: 'PATCH',
                body: { requestId, action, comment },
            }),
        }),
    }),
})

export const {
    useGetRequestByIdQuery,
    useCreateRequestMutation,
    useGetRequestsQuery,
    useGetMyRequestsByPeriodIdQuery,
    useManageRequestMutation,
    useApproveRequestMutation,
} = requestApi
