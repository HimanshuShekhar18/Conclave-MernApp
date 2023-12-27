// Create a Redux Store

import { configureStore } from '@reduxjs/toolkit';  // Import the configureStore API from Redux Toolkit.
import auth from './authSlice';

export const store = configureStore({
    reducer: {
        auth,
    },
});