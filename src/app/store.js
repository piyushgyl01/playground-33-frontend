import { configureStore } from '@reduxjs/toolkit';
import authReducer from '../features/auth/authSlice';
import jobReducer from '../features/job/jobSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    jobs: jobReducer
  },
  devTools: process.env.NODE_ENV !== 'production'
});

export default store;