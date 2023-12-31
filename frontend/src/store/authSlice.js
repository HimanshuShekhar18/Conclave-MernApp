// Create a Redux State Slice
import { createSlice } from '@reduxjs/toolkit'; // import the createSlice API from Redux Toolkit.
const initialState = {
    isAuth: false,
    user: null,
    otp: {
        phone: '',
        hash: '',
    },
};
/*
Creating a slice requires a string name to identify the slice, an initial state value, and one or more reducer functions to define how the state can be updated. Once a slice is created, we can export the generated Redux action creators and the reducer function for the whole slice.
*/
export const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        setAuth: (state, action) => {   // actions or methods
            const { user } = action.payload;
            state.user = user;
            if (user === null) {
                state.isAuth = false;
            } else {
                state.isAuth = true;
            }
        },
        setOtp: (state, action) => {   // actions or methods
            const { phone, hash } = action.payload;
            state.otp.phone = phone;
            state.otp.hash = hash;
        },
    /* Redux Toolkit allows us to write "mutating" logic in reducers. It doesn't actually mutate the state because it uses the Immer library,which detects changes to a "draft state" and produces a brand new immutable state based off those changes   */
    },
});
export const { setAuth, setOtp } = authSlice.actions;
export default authSlice.reducer;