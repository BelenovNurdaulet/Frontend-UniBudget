import { createSlice } from '@reduxjs/toolkit'
import { referenceApi } from './referenceApi'

const staticRoles = [
    { id: 0, name: 'Administration' },
    { id: 1, name: 'RequestCreator' },
    { id: 2, name: 'HeadOfDepartment' },
    { id: 3, name: 'Finance' },
]

const initialState = {
    branches:   [],
    categories: [],
    roles:      staticRoles,
    statuses:   [],
    isLoaded:   false,
}

const referenceSlice = createSlice({
    name: 'reference',
    initialState,
    extraReducers: (builder) => {
        builder.addMatcher(
            referenceApi.endpoints.getReference.matchFulfilled,
            (state, { payload }) => {
                const { branches, categories, requestStatues } = payload.valueOrDefault || {}
                state.branches   = branches   || []
                state.categories = categories || []
                state.statuses   = requestStatues || []
                state.isLoaded   = true
            }
        )
    },
})

// Селекторы
export const selectBranches   = (state) => state.reference.branches
export const selectCategories = (state) => state.reference.categories
export const selectRoles      = (state) => state.reference.roles
export const selectStatuses   = (state) => state.reference.statuses
export const selectRefLoaded  = (state) => state.reference.isLoaded

export default referenceSlice.reducer
