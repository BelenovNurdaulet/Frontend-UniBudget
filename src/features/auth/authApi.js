import { apiSlice } from '../../app/api/apiSlice'

export const authApi = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        login: builder.mutation({
            query: (credentials) => ({
                url: 'api/auth/login',
                method: 'POST',
                body: credentials,
            }),
            refetchOnMountOrArgChange: true,
            keepUnusedDataFor: 0,
        }),
        register: builder.mutation({
            query: (data) => ({
                url: 'api/auth/register',
                method: 'POST',
                body: data,
            }),
            refetchOnMountOrArgChange: true,
            keepUnusedDataFor: 0,
        }),
    }),
})


export const {
    useLoginMutation,
    useRegisterMutation,
} = authApi
export const {
    endpoints: { login, register },
} = authApi
