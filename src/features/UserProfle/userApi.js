import { apiSlice } from '../../app/api/apiSlice';

export const userApi = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        getCurrentUser: builder.query({
            query: () => ({
                url: 'api/user/me',
                method: 'GET',
            }),
            keepUnusedDataFor: 0,
        }),
        updateUser: builder.mutation({
            query: (data) => ({
                url: 'api/user/',
                method: 'PATCH',
                body: data,
            }),
            keepUnusedDataFor: 0,
        }),
        deleteUser: builder.mutation({
            query: (data) => ({
                url: 'api/user/',
                method: 'DELETE',
                body: data,
            }),
            keepUnusedDataFor: 0,
        }),
    }),
});

export const {
    useGetCurrentUserQuery,
    useUpdateUserMutation,
    useDeleteUserMutation,
} = userApi;

export const {
    endpoints: { getCurrentUser, updateUser, deleteUser },
} = userApi;
