// Create a Redux Store

import { configureStore } from '@reduxjs/toolkit';  // Import the configureStore API from Redux Toolkit.
import auth from './authSlice';
import activate from './activateSlice';

export const store = configureStore({
    reducer: {
        auth,
        activate,
    },
});