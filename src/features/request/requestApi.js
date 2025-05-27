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

        updateRequest: builder.mutation({
            query: (body) => ({
                url: '/api/request',
                method: 'PUT',
                body,
            }),
        }),

        getRequests: builder.query({
            query: ({ PeriodId, PageNumber, PageSize, Status, BranchId, StartDate, EndDate }) => {
                const params = new URLSearchParams()
                if (PeriodId != null)  params.set('PeriodId', String(PeriodId))
                if (PageNumber != null) params.set('PageNumber', String(PageNumber))
                if (PageSize != null)   params.set('PageSize', String(PageSize))
                if (Status) params.set('Status', Status)
                if (BranchId != null) params.set('BranchId', String(BranchId))
                if (StartDate) params.set('StartDate', StartDate)

                const defaultEndDate = new Date()
                defaultEndDate.setDate(defaultEndDate.getDate() + 1)

                params.set('EndDate', EndDate || defaultEndDate.toISOString())

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

        // новый endpoint для Creator
        creatorRequest: builder.mutation({
            query: ({ requestId, action, title, description, comment, amount }) => ({
                url: '/api/request/Creator',
                method: 'PATCH',
                body: { requestId, action, title, description, comment, amount },
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
        actOnRequest: builder.mutation({
            query: ({ requestId, action, comment, requestStatus }) => {
                const endpointMap = {
                    InReview: 'HeadOfDepartment',
                    Approved: 'Finance',
                };

                const target = endpointMap[requestStatus] || 'HeadOfDepartment';

                return {
                    url: `/api/request/${target}`,
                    method: 'PATCH',
                    body: { requestId, action, comment },
                };
            },
        }),


    }),
})

export const {
    useGetRequestByIdQuery,
    useCreateRequestMutation,
    useUpdateRequestMutation,
    useGetRequestsQuery,
    useGetMyRequestsByPeriodIdQuery,
    useManageRequestMutation,
    useApproveRequestMutation,
    useCreatorRequestMutation,
    useDownloadRequestFileMutation,
    useUploadRequestFilesMutation,
    useDeleteRequestFileMutation,
    useActOnRequestMutation,
} = requestApi