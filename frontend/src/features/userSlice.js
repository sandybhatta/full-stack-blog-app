import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { signinUser, getProfile } from '../services/api'; // Import correct API functions

const initialState = {
  user: null,
  userBlogs: [],
  loading: false,
  error: null,
  token: localStorage.getItem("token") || null, // Persist token from localStorage
};

// Async action to login a user
export const loginUser = createAsyncThunk(
  "user/loginUser",
  async ({ email, password }, { rejectWithValue }) => {
    try {
      // Call the correct API function
      const response = await signinUser({ email, password });

      if (!response.token) {
        throw new Error("Invalid response from server");
      }

      // Save token in localStorage
      localStorage.setItem("token", response.token);

      return response; // Assuming response contains { user, token }
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Invalid credentials"
      );
    }
  }
);

// Async action to fetch user data (including their blogs)
export const fetchUserProfile = createAsyncThunk(
  "user/fetchUserProfile",
  async (_, { getState, rejectWithValue }) => {
    const token = getState().user.token; // Get token from Redux state

    if (!token) {
      return rejectWithValue("No token found. Please log in.");
    }

    try {
      const data = await getProfile(token);
      return data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "Failed to fetch profile.");
    }
  }
);

export const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setUser: (state, action) => {
      state.user = action.payload.user;
      state.token = action.payload.token;
      localStorage.setItem("token", action.payload.token); // Persist token
      state.error = null; // Clear errors on successful login
    },
    setUserBlogs: (state, action) => {
      state.userBlogs = action.payload;
    },
    updateUserProfile: (state, action) => {
      state.user = action.payload;
    },
    clearUser: (state) => {
      state.user = null;
      state.token = null;
      state.userBlogs = [];
      localStorage.removeItem("token"); // Clear token on logout
    },
    setError: (state, action) => {
      state.error = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loginUser.pending, (state) => {
        state.loading = true;
        state.error = null; // Clear previous errors when a new request starts
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.user;
        state.token = action.payload.token;
        state.error = null; // Clear errors on success
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload; // Store error message in Redux
      })
      .addCase(fetchUserProfile.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchUserProfile.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.user;
        state.userBlogs = action.payload.userBlogs || [];
      })
      .addCase(fetchUserProfile.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload; // Store error message if fetch fails
      });
  },
});

export const selectUser = (state) => state.auth.user;
export const { setUser, setUserBlogs, updateUserProfile, clearUser, setError } = userSlice.actions;

export default userSlice.reducer;
