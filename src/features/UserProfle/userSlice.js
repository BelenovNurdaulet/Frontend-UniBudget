import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    user: null,
    isLoaded: false,
};

const userSlice = createSlice({
    name: 'user',
    initialState,
    reducers: {
        setUserData: (state, { payload }) => {
            state.user = payload;
            state.isLoaded = true;
        },
        clearUserData: (state) => {
            state.user = null;
            state.isLoaded = false;
        },
    },
});

export const { setUserData, clearUserData } = userSlice.actions;
export default userSlice.reducer;

export const selectUserData = (state) => state.user.user;
export const selectIsUserLoaded = (state) => state.user.isLoaded;
