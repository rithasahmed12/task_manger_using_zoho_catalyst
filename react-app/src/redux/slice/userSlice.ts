import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { UserState } from '../../types/authTypes';

const initialState: UserState = {
    userInfoTh: localStorage.getItem('userInfoTh'),
};

const userSlice = createSlice({
    name: 'user',
    initialState,
    reducers: {
        setUser: (state, action: PayloadAction<string>) => {
            state.userInfoTh = action.payload;
            localStorage.setItem('userInfoTh', action.payload);
        },
        clearUser: (state) => {
            state.userInfoTh = null;
            localStorage.removeItem('userInfoTh');
        },
    },
});

export const { setUser, clearUser } = userSlice.actions;
export default userSlice.reducer;

