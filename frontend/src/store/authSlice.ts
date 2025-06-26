import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { authService } from '../services/authService';
import {
  LoginRequestData,
  RegisterRequestData,
} from '../types/request';
import {
  AuthResponseData,
  ApiErrorResponse,
} from '../types/response';

export const loginUser = createAsyncThunk<
  AuthResponseData,
  LoginRequestData,
  { rejectValue: ApiErrorResponse }
>(
  'auth/loginUser',
  async (credentials, { rejectWithValue }) => {
    try {
      const response = await authService.login(credentials);
      
      authService.setUserData(response.responseData);
      
      return response.responseData;
    } catch (error: any) {
      return rejectWithValue(error as ApiErrorResponse);
    }
  }
);

export const registerUser = createAsyncThunk<
  AuthResponseData,
  RegisterRequestData,
  { rejectValue: ApiErrorResponse }
>(
  'auth/registerUser',
  async (userData, { rejectWithValue }) => {
    try {
      const response = await authService.register(userData);
      
      authService.setUserData(response.responseData);
      
      return response.responseData;
    } catch (error: any) {
      return rejectWithValue(error as ApiErrorResponse);
    }
  }
);

interface AuthState {
  user: AuthResponseData | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
}

const initialState: AuthState = {
  user: authService.getUserData(),
  token: authService.getAuthToken(),
  isAuthenticated: authService.isAuthenticated(),
  isLoading: false,
  error: null,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    logout: (state) => {
      authService.logout();
      state.user = null;
      state.token = null;
      state.isAuthenticated = false;
      state.error = null;
    },
    clearError: (state) => {
      state.error = null;
    },
    setAuthFromStorage: (state) => {
      state.user = authService.getUserData();
      state.token = authService.getAuthToken();
      state.isAuthenticated = authService.isAuthenticated();
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loginUser.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })      .addCase(loginUser.fulfilled, (state, action: PayloadAction<AuthResponseData>) => {
        state.isLoading = false;
        state.user = action.payload;
        state.token = action.payload.token;
        state.isAuthenticated = true;
        state.error = null;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload?.statusLabel || 'Login failed';
        state.isAuthenticated = false;
      });

    builder
      .addCase(registerUser.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(registerUser.fulfilled, (state, action: PayloadAction<AuthResponseData>) => {
        state.isLoading = false;
        state.user = action.payload;
        state.token = action.payload.token;
        state.isAuthenticated = true;
        state.error = null;
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload?.statusLabel || 'Registration failed';
        state.isAuthenticated = false;
      });
  },
});

export const { logout, clearError, setAuthFromStorage } = authSlice.actions;
export default authSlice.reducer;
