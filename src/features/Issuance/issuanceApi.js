import {apiSlice} from '../../app/api/apiSlice'

export const issuanceApi = apiSlice.injectEndpoints({
    endpoints: (builder) => ({

        getCompanyByIIN: builder.query({
            query: (iin) => `/api/iin?IIN=${encodeURIComponent(iin)}`,
            refetchOnMountOrArgChange: true,
            keepUnusedDataFor: 0,
        }),
        createIssuance: builder.mutation({
            query: (formData) => ({
                url: '/api/issuances',
                method: 'POST',
                body: formData,
                refetchOnMountOrArgChange: true,
                keepUnusedDataFor: 0,
            }),
        }),
        getIssuanceById: builder.query({
            query: (id) => `/api/issuances/${id}`,
            refetchOnMountOrArgChange: true,
            keepUnusedDataFor: 0,
        }),

        getIsExpiredById: builder.query({
            query: (id) => `/api/issuances/${id}/expired`,
            refetchOnMountOrArgChange: true,
            keepUnusedDataFor: 0,
        }),

        getIssuances: builder.query({
            refetchOnMountOrArgChange: true,
            keepUnusedDataFor: 0,
            query: (params) => {
                const searchParams = new URLSearchParams()

                if (params?.query) searchParams.set('query', params.query)
                if (params?.page) searchParams.set('page', params.page)
                if (params?.pageSize) searchParams.set('pageSize', params.pageSize)
                if (params?.filialId) searchParams.set('filialId', params.filialId)
                if (params?.createDateMin) searchParams.set('createDateMin', params.createDateMin)
                if (params?.createDateMax) searchParams.set('createDateMax', params.createDateMax)
                if (params?.statusId) searchParams.set('statusId', params.statusId)
                if (params?.productTypeId) searchParams.set('productTypeId', params.productTypeId)
                if (params?.issuanceTypeId) searchParams.set('issuanceTypeId', params.issuanceTypeId)

                const url = `/api/issuances?${searchParams.toString()}`
                return url
            },
        }),
        getMyIssuances: builder.query({
            refetchOnMountOrArgChange: true,
            keepUnusedDataFor: 0,
            query: (params) => {
                const searchParams = new URLSearchParams()

                if (params?.query) searchParams.set('query', params.query)
                if (params?.page) searchParams.set('page', params.page)
                if (params?.pageSize) searchParams.set('pageSize', params.pageSize)
                if (params?.filialId) searchParams.set('filialId', params.filialId)
                if (params?.createDateMin) searchParams.set('createDateMin', params.createDateMin)
                if (params?.createDateMax) searchParams.set('createDateMax', params.createDateMax)
                if (params?.statusId) searchParams.set('statusId', params.statusId)
                if (params?.productTypeId) searchParams.set('productTypeId', params.productTypeId)
                if (params?.issuanceTypeId) searchParams.set('issuanceTypeId', params.issuanceTypeId)

                const url = `/api/issuances/me?${searchParams.toString()}`
                return url
            },
        }),
        changeIssuanceStatus: builder.mutation({
            query: ({issuanceId, action, comment}) => ({
                url: `/api/issuances/${issuanceId}/status`,
                method: 'PUT',
                body: {issuanceId, action, comment},
                refetchOnMountOrArgChange: true,
                keepUnusedDataFor: 0,
            }),
        }),
        changeIssuanceStatusById: builder.mutation({
            query: ({issuanceId, statusId}) => ({
                url: `/api/issuances/${issuanceId}/change`,
                method: 'PUT',
                body: {issuanceId, statusId},
            }),
        }),
        saveDocumentsCount: builder.mutation({
            query: ({issuanceId, payload}) => ({
                url: `/api/issuances/${issuanceId}/documents`,
                method: 'PUT',
                body: payload,
                refetchOnMountOrArgChange: true,
                keepUnusedDataFor: 0,
            }),
        }),
        reassignIssuance: builder.mutation({
            query: ({issuanceId, userId, comment}) => ({
                url: `/api/issuances/${issuanceId}/assignee`,
                method: 'PUT',
                refetchOnMountOrArgChange: true,
                keepUnusedDataFor: 0,
                body: {issuanceId, userId, comment},
            }),
        }),


        manageIssuanceFiles: builder.mutation({
            query: ({issuanceId, formData}) => ({
                url: `/api/issuances/${issuanceId}/files`,
                method: 'POST',
                body: formData,
                refetchOnMountOrArgChange: true,
                keepUnusedDataFor: 0,
            }),
        }),
    }),
})

export const {
    useLazyGetCompanyByIINQuery,
    useCreateIssuanceMutation,
    useGetIssuanceByIdQuery,
    useGetIsExpiredByIdQuery,
    useGetIssuancesQuery,
    useGetMyIssuancesQuery,
    useChangeIssuanceStatusMutation,
    useChangeIssuanceStatusByIdMutation,
    useSaveDocumentsCountMutation,
    useReassignIssuanceMutation,
    useManageIssuanceFilesMutation,
} = issuanceApi
