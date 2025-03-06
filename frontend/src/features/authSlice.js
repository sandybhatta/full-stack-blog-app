import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';




export const checkAuth = createAsyncThunk(
  'auth/checkAuth',
  async (_, { rejectWithValue }) => {
    const token = localStorage.getItem('token');
    if (!token) return rejectWithValue('No token found');

    try {
      
      const response = await fetch('http://localhost:4000/api/auth/profile', {
        headers: {
          Authorization: `Bearer ${token}`, 
        },
      });

      if (!response.ok) {
        throw new Error('Failed to authenticate');
      }

      const data = await response.json();
      return { user: data, token, blogs: data.blogs }; 
    } catch (error) {
      return rejectWithValue(error.message); 
    }
  }
);


const authSlice = createSlice({
  name: 'auth',
  initialState: {
    user: null,
    token: null,
    blogs: [],
    loading: false,
    error: null,
  },
  reducers: {
    setUser: (state, action) => {
      state.user = action.payload.user;
      state.token = action.payload.token; 
      state.loading = false;
      localStorage.setItem('token', action.payload.token); 
    },
    clearUser: (state) => {
      state.user = null;
      state.token = null; 
      state.loading = false;
      localStorage.removeItem('token'); 
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
        state.user = action.payload.user; 
        state.token = action.payload.token; 
        state.blogs = action.payload.blogs; 
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
