import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import * as authService from "../../services/authService";

// Async thunks
export const registerUser = createAsyncThunk(
  "auth/registerUser",
  async (userData, { rejectWithValue }) => {
    try {
      const response = await authService.registerUser(userData);
      return response.user;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Registration failed"
      );
    }
  }
);

export const loginUser = createAsyncThunk(
  "auth/loginUser",
  async (credentials, { rejectWithValue }) => {
    try {
      const response = await authService.loginUser(credentials);
      
      // MFA required - return partial auth info
      if (response.requiresMfa) {
        return { 
          requiresMfa: true, 
          userId: response.userId 
        };
      }
      
      return response.user;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "Login failed");
    }
  }
);

export const verifyMfaLogin = createAsyncThunk(
  "auth/verifyMfaLogin",
  async ({ username, password, mfaToken }, { rejectWithValue }) => {
    try {
      const response = await authService.loginUser({ username, password, mfaToken });
      return response.user;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "MFA verification failed");
    }
  }
);

export const logoutUser = createAsyncThunk(
  "auth/logoutUser",
  async (_, { rejectWithValue }) => {
    try {
      await authService.logoutUser();
      return null;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "Logout failed");
    }
  }
);

export const getCurrentUser = createAsyncThunk(
  "auth/getCurrentUser",
  async (_, { rejectWithValue }) => {
    try {
      const user = await authService.getCurrentUser();
      return user;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to get user info"
      );
    }
  }
);

// Auth slice
export const authSlice = createSlice({
  name: "auth",
  initialState: {
    user: null,
    isAuthenticated: false,
    loading: false,
    error: null,
    mfaRequired: false,
    pendingMfaUserId: null,
    rateLimitExceeded: false,
  },
  reducers: {
    clearError: (state) => {
      state.error = null;
      state.rateLimitExceeded = false;
    },
    // For OAuth callback to set user directly
    oauthLoginSuccess: (state, action) => {
      state.user = action.payload;
      state.isAuthenticated = true;
      state.loading = false;
      state.error = null;
      state.mfaRequired = false;
      state.pendingMfaUserId = null;
      state.rateLimitExceeded = false;
    },
    // For updating user profile directly
    updateUserProfile: (state, action) => {
      state.user = action.payload;
    },
    // For resetting the MFA state
    resetMfaState: (state) => {
      state.mfaRequired = false;
      state.pendingMfaUserId = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Register cases
      .addCase(registerUser.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.rateLimitExceeded = false;
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.loading = false;
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        
        // Check for rate limiting errors
        if (action.payload && action.payload.includes('Too many')) {
          state.rateLimitExceeded = true;
        }
      })

      // Login cases
      .addCase(loginUser.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.mfaRequired = false;
        state.pendingMfaUserId = null;
        state.rateLimitExceeded = false;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        // Check if MFA is required
        if (action.payload && action.payload.requiresMfa) {
          state.loading = false;
          state.mfaRequired = true;
          state.pendingMfaUserId = action.payload.userId;
          state.isAuthenticated = false;
          state.user = null;
        } else {
          state.user = action.payload;
          state.isAuthenticated = true;
          state.mfaRequired = false;
          state.pendingMfaUserId = null;
        }
        state.loading = false;
        state.error = null;
        state.rateLimitExceeded = false;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        
        // Check for rate limiting errors
        if (action.payload && action.payload.includes('Too many')) {
          state.rateLimitExceeded = true;
        }
      })
      
      // MFA Verification for login
      .addCase(verifyMfaLogin.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.rateLimitExceeded = false;
      })
      .addCase(verifyMfaLogin.fulfilled, (state, action) => {
        state.user = action.payload;
        state.isAuthenticated = true;
        state.loading = false;
        state.error = null;
        state.mfaRequired = false;
        state.pendingMfaUserId = null;
        state.rateLimitExceeded = false;
      })
      .addCase(verifyMfaLogin.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        
        // Keep MFA required state
        if (state.mfaRequired) {
          state.mfaRequired = true;
        }
        
        // Check for rate limiting errors
        if (action.payload && action.payload.includes('Too many')) {
          state.rateLimitExceeded = true;
        }
      })

      // Logout cases
      .addCase(logoutUser.pending, (state) => {
        state.loading = true;
      })
      .addCase(logoutUser.fulfilled, (state) => {
        state.user = null;
        state.isAuthenticated = false;
        state.loading = false;
        state.error = null;
        state.mfaRequired = false;
        state.pendingMfaUserId = null;
        state.rateLimitExceeded = false;
      })
      .addCase(logoutUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.user = null;
        state.isAuthenticated = false;
        state.mfaRequired = false;
        state.pendingMfaUserId = null;
      })

      // Get current user cases
      .addCase(getCurrentUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getCurrentUser.fulfilled, (state, action) => {
        state.user = action.payload;
        state.isAuthenticated = true;
        state.loading = false;
        state.error = null;
        state.mfaRequired = false;
        state.pendingMfaUserId = null;
      })
      .addCase(getCurrentUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.user = null;
        state.isAuthenticated = false;
        state.mfaRequired = false;
        state.pendingMfaUserId = null;
      });
  },
});

export const { 
  clearError, 
  oauthLoginSuccess, 
  updateUserProfile,
  resetMfaState
} = authSlice.actions;

export default authSlice.reducer;