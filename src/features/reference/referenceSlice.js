import { createSlice } from '@reduxjs/toolkit'
import { referenceApi } from './referenceApi'

// Жестко вшитые роли из enum UserRole
const staticRoles = [
    { id: 0, name: 'Administration' },
    { id: 1, name: 'RequestCreator' },
    { id: 2, name: 'Executor' },
    { id: 3, name: 'Finance' },
]

const initialState = {
    branches:   [],
    categories: [],
    roles:      staticRoles,
    isLoaded:   false,
}

const referenceSlice = createSlice({
    name: 'reference',
    initialState,
    extraReducers: (builder) => {
        builder.addMatcher(
            referenceApi.endpoints.getReference.matchFulfilled,
            (state, { payload }) => {
                // payload.valueOrDefault содержит branches и categories
                const { branches, categories } = payload.valueOrDefault || {}
                state.branches   = branches   || []
                state.categories = categories || []
                state.isLoaded   = true
            }
        )
    },
})

// Селекторы
export const selectBranches   = (state) => state.reference.branches
export const selectCategories = (state) => state.reference.categories
export const selectRoles      = (state) => state.reference.roles
export const selectRefLoaded  = (state) => state.reference.isLoaded

export default referenceSlice.reducer
