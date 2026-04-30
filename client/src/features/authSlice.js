import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import * as authApi from '../api/authApi';

export const loginUser = createAsyncThunk('auth/login', async (credentials, thunkAPI) => {
    try {
        const response = await authApi.loginApi(credentials);
        localStorage.setItem('token', response.data.token);
        return response.data;
    } catch (error) {
        return thunkAPI.rejectWithValue(error.response.data.message || 'Login failed');
    }
});

export const registerUser = createAsyncThunk('auth/register', async (userData, thunkAPI) => {
    try {
        const response = await authApi.registerApi(userData);
        localStorage.setItem('token', response.data.token);
        return response.data;
    } catch (error) {
        return thunkAPI.rejectWithValue(error.response.data.message || 'Register failed');
    }
});

export const getMe = createAsyncThunk('auth/getMe', async (_, thunkAPI) => {
    try {
        const response = await authApi.getMeApi();
        return response.data;
    } catch (error) {
        return thunkAPI.rejectWithValue(error.response.data.message || 'Failed to get user info');
    }
});

const authSlice = createSlice({
    name: 'auth',
    initialState: {
        user: null,
        token: localStorage.getItem('token') || null,
        loading: false,
        error: null,
    },
    reducers: {
        logout: (state) => {
            state.user = null;
            state.token = null;
            localStorage.removeItem('token');
        },
        clearError: (state) => {
            state.error = null;
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(loginUser.pending, (state) => { state.loading = true; state.error = null; })
            .addCase(loginUser.fulfilled, (state, action) => {
                state.loading = false;
                state.user = action.payload.user;
                state.token = action.payload.token;
            })
            .addCase(loginUser.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            .addCase(registerUser.pending, (state) => { state.loading = true; state.error = null; })
            .addCase(registerUser.fulfilled, (state, action) => {
                state.loading = false;
                state.user = action.payload.user;
                state.token = action.payload.token;
            })
            .addCase(registerUser.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            .addCase(getMe.pending, (state) => { state.loading = true; })
            .addCase(getMe.fulfilled, (state, action) => {
                state.loading = false;
                state.user = action.payload;
            })
            .addCase(getMe.rejected, (state, action) => {
                state.loading = false;
                state.token = null;
                localStorage.removeItem('token');
            });
    }
});

export const { logout, clearError } = authSlice.actions;
export default authSlice.reducer;
