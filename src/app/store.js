import {configureStore} from '@reduxjs/toolkit'
import {apiSlice} from './api/apiSlice'
import authReducer from '../features/auth/authSlice'
import referenceReducer from '../features/reference/referenceSlice'

export const store = configureStore({
    reducer: {
        [apiSlice.reducerPath]: apiSlice.reducer,
        auth: authReducer,
        reference: referenceReducer,
    },
    middleware: (getDefaultMiddleware) => {
        return getDefaultMiddleware().concat(apiSlice.middleware)
    },
    devTools: true,
})

export default store
