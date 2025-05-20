import { apiSlice } from '../../app/api/apiSlice'

export const periodApi = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        getPeriods: builder.query({
            query: (params) => {
                const searchParams = new URLSearchParams()
                if (params?.PageNumber) searchParams.set('PageNumber', params.PageNumber)
                if (params?.PageSize) searchParams.set('PageSize', params.PageSize)
                if (params?.IsActive !== undefined) searchParams.set('IsActive', params.IsActive)
                if (params?.StartDate) searchParams.set('StartDate', params.StartDate);
                if (params?.EndDate) searchParams.set('EndDate', params.EndDate);

                return `/api/period?${searchParams.toString()}`
            },
            transformResponse: (response) => ({
                items: response.periods,
                totalCount: response.totalCount,
            }),
            refetchOnMountOrArgChange: true,
            keepUnusedDataFor: 0,
        }),




        createPeriod: builder.mutation({
            query: (payload) => ({
                url: '/api/period',
                method: 'POST',
                body: payload,
            }),
            refetchOnMountOrArgChange: true,
            keepUnusedDataFor: 0,
        }),

        updatePeriod: builder.mutation({
            query: (payload) => ({
                url: '/api/period',
                method: 'PATCH',
                body: payload,
            }),
            refetchOnMountOrArgChange: true,
            keepUnusedDataFor: 0,
        }),

        getPeriodById: builder.query({
            query: (id) => `/api/period/${id}`,
            refetchOnMountOrArgChange: true,
            keepUnusedDataFor: 0,
        }),
        getPeriodExcel: builder.query({
            query: (periodId) => ({
                url: `/api/period/excel?periodId=${periodId}`,
                method: 'GET',
                responseHandler: (response) => response.blob(),
            }),
            keepUnusedDataFor: 0,
        }),
        getPeriodStatistics: builder.query({
            query: ({ PeriodId, TargetPeriodId }) => {
                const searchParams = new URLSearchParams();
                if (PeriodId !== undefined) searchParams.set('PeriodId', PeriodId);
                if (TargetPeriodId !== undefined) searchParams.set('TargetPeriodId', TargetPeriodId);

                return `/api/period/statisitcs?${searchParams.toString()}`;
            },
            keepUnusedDataFor: 0,
        }),


    }),
})

export const {
    useGetPeriodsQuery,
    useCreatePeriodMutation,
    useUpdatePeriodMutation,
    useGetPeriodByIdQuery,
    useLazyGetPeriodExcelQuery,
    useGetPeriodStatisticsQuery,

} = periodApi
