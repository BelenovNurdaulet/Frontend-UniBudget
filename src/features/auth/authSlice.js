import { createSlice } from '@reduxjs/toolkit'

import { jwtDecode } from 'jwt-decode'

const token = localStorage.getItem('access_token')
let user = token ? jwtDecode(token) : null

const initialState = {
    user: user || null,
    token: token || null,
    isAuthenticated: !!token,
}

const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        setCredentials: (state, { payload: { token } }) => {
            state.token = token
            state.user = {
                ...jwtDecode(token),
                userRole: jwtDecode(token)['http://schemas.microsoft.com/ws/2008/06/identity/claims/role']
            }
            state.isAuthenticated = true
            localStorage.setItem('access_token', token)
        },
        logout: (state) => {
            state.token = null
            state.user = null
            state.isAuthenticated = false
            localStorage.removeItem('access_token')
        },
    },

})

export const { logout, setCredentials } = authSlice.actions
export default authSlice.reducer

export const selectIsAuthenticated = (state) => state.auth.isAuthenticated
export const selectUser = (state) => state.auth.user
export const selectCurrentToken = (state) => state.auth.token
