// /redux/store.js
import { configureStore } from '@reduxjs/toolkit';
import authReducer from '../features/authSlice';
import blogReducer from '../features/blogSlice';
import userReducer from '../features/userSlice'; // Import the userReducer

const store = configureStore({
  reducer: {
    auth: authReducer,
    blogs: blogReducer,
    user: userReducer, // Add userReducer to the store
  },
  devTools: process.env.NODE_ENV !== 'production'
});

export default store;


