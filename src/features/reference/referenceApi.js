// src/features/reference/referenceApi.js
import { apiSlice } from '../../app/api/apiSlice'

export const referenceApi = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        getReference: builder.query({
            query: () => '/api/references',
        }),
    }),
    overrideExisting: false,
})

export const { useGetReferenceQuery } = referenceApi
