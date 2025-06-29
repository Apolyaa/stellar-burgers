import { createSlice } from '@reduxjs/toolkit';
import { createAsyncThunk } from '@reduxjs/toolkit';
import {
  registerUserApi,
  loginUserApi,
  TRegisterData,
  TLoginData,
  logoutApi
} from '@api';
import { deleteCookie, setCookie } from '../../utils/cookie';
import { clearProfile, getUser } from '../profile/profileSlice';

export const registerUser = createAsyncThunk<
  void,
  TRegisterData,
  { rejectValue: string }
>('auth/register', async (data, thunkAPI) => {
  try {
    const res = await registerUserApi(data);
    setCookie('accessToken', res.accessToken);
    localStorage.setItem('refreshToken', res.refreshToken);
    thunkAPI.dispatch(getUser());
  } catch (err: any) {
    return thunkAPI.rejectWithValue(err.message || 'Ошибка регистрации');
  }
});

export const loginUser = createAsyncThunk<
  void,
  TLoginData,
  { rejectValue: string }
>('auth/login', async (data, thunkAPI) => {
  try {
    const res = await loginUserApi(data);
    setCookie('accessToken', res.accessToken);
    localStorage.setItem('refreshToken', res.refreshToken);
    thunkAPI.dispatch(getUser());
  } catch (err: any) {
    return thunkAPI.rejectWithValue(err.message || 'Ошибка входа');
  }
});

export const logout = createAsyncThunk<void, void, { rejectValue: string }>(
  'auth/logout',
  async (_, thunkAPI) => {
    try {
      await logoutApi();
      deleteCookie('accessToken');
      localStorage.removeItem('refreshToken');
      thunkAPI.dispatch(clearProfile());
    } catch (err: any) {
      return thunkAPI.rejectWithValue(err.message || 'Ошибка выхода');
    }
  }
);

type TAuthState = {
  isLoading: boolean;
  errorMessage: string | null;
  logoutLoading: boolean;
  logoutError: string | null;
};

const initialState: TAuthState = {
  isLoading: false,
  errorMessage: null,
  logoutLoading: false,
  logoutError: null
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {},
  selectors: {
    getAuth: (state) => state
  },
  extraReducers: (builder) => {
    builder
      .addCase(registerUser.pending, (state) => {
        state.isLoading = true;
        state.errorMessage = null;
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.isLoading = false;
        state.errorMessage = action.error.message ? action.error.message : null;
      })
      .addCase(registerUser.fulfilled, (state) => {
        state.isLoading = false;
      })
      .addCase(loginUser.pending, (state) => {
        state.isLoading = true;
        state.errorMessage = null;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.isLoading = false;
        state.errorMessage = action.error.message ? action.error.message : null;
      })
      .addCase(loginUser.fulfilled, (state) => {
        state.isLoading = false;
      })
      .addCase(logout.pending, (state) => {
        state.logoutLoading = true;
        state.logoutError = null;
      })
      .addCase(logout.rejected, (state, action) => {
        state.logoutLoading = false;
        state.logoutError = action.error.message ? action.error.message : null;
      })
      .addCase(logout.fulfilled, (state, action) => {
        state.logoutLoading = false;
      });
  }
});

export const authReducer = authSlice.reducer;
export const { getAuth } = authSlice.selectors;
