import { apiSlice } from '../../app/api/apiSlice'

export const periodApi = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        getPeriods: builder.query({
            query: (params) => {
                const searchParams = new URLSearchParams()
                if (params?.PageNumber) searchParams.set('PageNumber', params.PageNumber)
                if (params?.PageSize) searchParams.set('PageSize', params.PageSize)
                if (params?.IsActive !== undefined) searchParams.set('IsActive', params.IsActive)

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

    }),
})

export const {
    useGetPeriodsQuery,
    useCreatePeriodMutation,
    useUpdatePeriodMutation,
    useGetPeriodByIdQuery,

} = periodApi
