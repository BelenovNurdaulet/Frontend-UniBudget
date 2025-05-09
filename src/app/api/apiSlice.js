import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'
import { selectCurrentToken, logout } from '../../features/auth/authSlice'

export const apiUrl = import.meta.env.VITE_API_URL

const baseQuery = fetchBaseQuery({
    baseUrl: apiUrl,
    credentials: 'include',
    prepareHeaders: (headers, { getState }) => {
        const token = selectCurrentToken(getState())
        if (token) {
            headers.set('Authorization', `Bearer ${token}`)
        }
        return headers
    },
})

const baseQueryWithAuth = async (args, api, extraOptions) => {
    const result = await baseQuery(args, api, extraOptions)
    if (result.error?.status === 401) {
        api.dispatch(logout())
    }
    return result
}

export const apiSlice = createApi({
    reducerPath: 'splitApi',
    baseQuery: baseQueryWithAuth,
    endpoints: () => ({}),
})

