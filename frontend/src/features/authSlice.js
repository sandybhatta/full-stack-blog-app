import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';



// Thunk to check authentication status
export const checkAuth = createAsyncThunk(
  'auth/checkAuth',
  async (_, { rejectWithValue }) => {
    const token = localStorage.getItem('token');
    if (!token) return rejectWithValue('No token found');

    try {
      // Make a request to your backend to check the token using the /profile route
      const response = await fetch('http://localhost:4000/api/auth/profile', {
        headers: {
          Authorization: `Bearer ${token}`, // Send token for authentication
        },
      });

      if (!response.ok) {
        throw new Error('Failed to authenticate');
      }

      const data = await response.json();
      return { user: data, token, blogs: data.blogs }; // Ensure that only user blogs are returned
    } catch (error) {
      return rejectWithValue(error.message); // Return error message if authentication fails
    }
  }
);


const authSlice = createSlice({
  name: 'auth',
  initialState: {
    user: null,
    token: null,
    blogs: [], // Add blogs to the initial state
    loading: false,
    error: null,
  },
  reducers: {
    setUser: (state, action) => {
      state.user = action.payload.user;
      state.token = action.payload.token; // Set the token in the Redux state
      state.loading = false;
      localStorage.setItem('token', action.payload.token); // Save token to localStorage
    },
    clearUser: (state) => {
      state.user = null;
      state.token = null; // Clear the token
      state.loading = false;
      localStorage.removeItem('token'); // Remove the token from localStorage
    },
    setLoading: (state) => {
      state.loading = true;
    },
    setError: (state, action) => {
      state.error = action.payload;
      state.loading = false;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(checkAuth.pending, (state) => {
        state.loading = true;
      })
      .addCase(checkAuth.fulfilled, (state, action) => {
        state.user = action.payload.user; // Store user data
        state.token = action.payload.token; // Store token
        state.blogs = action.payload.blogs; // Store only the user's blogs
        state.loading = false;
      })
      .addCase(checkAuth.rejected, (state, action) => {
        state.error = action.payload;
        state.loading = false;
      });
  },
});

export const { setUser, clearUser, setLoading, setError } = authSlice.actions;

export default authSlice.reducer;
