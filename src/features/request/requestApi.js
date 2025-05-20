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
                url: '/api/request/HeadOfDepartment',
                method: 'PATCH',
                body: { requestId, action, comment },
            }),
        }),

        approveRequest: builder.mutation({
            query: ({ requestId, action, comment }) => ({
                url: '/api/request/Finance',
                method: 'PATCH',
                body: { requestId, action, comment },
            }),
        }),

        downloadRequestFile: builder.mutation({
            query: ({ RequestId, FileName }) => {
                const params = new URLSearchParams()
                if (RequestId) params.set('RequestId', RequestId)
                if (FileName) params.set('FileName', FileName)
                return {
                    url: `/api/request?${params.toString()}`,
                    method: 'GET',
                    responseHandler: (response) => response.blob(),
                }
            }
        }),

        uploadRequestFiles: builder.mutation({
            query: ({ RequestId, Files }) => {
                const formData = new FormData()
                formData.append('RequestId', RequestId)
                Files.forEach(file => formData.append('Files', file))
                return {
                    url: '/api/request/files',
                    method: 'POST',
                    body: formData,
                }
            }
        }),

        deleteRequestFile: builder.mutation({
            query: (id) => ({
                url: `/api/request/files/${id}`,
                method: 'DELETE',
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
    useDownloadRequestFileMutation,

    useUploadRequestFilesMutation,
    useDeleteRequestFileMutation,
} = requestApi
