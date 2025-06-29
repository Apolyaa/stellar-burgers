import { createSlice } from '@reduxjs/toolkit';
import { TOrder, TUser } from '@utils-types';
import { createAsyncThunk } from '@reduxjs/toolkit';
import { getUserApi, updateUserApi, TRegisterData } from '@api';

export const getUser = createAsyncThunk(
  'auth/getUser',
  async () => await getUserApi()
);

export const updateUser = createAsyncThunk(
  'auth/user',
  async (user: Partial<TRegisterData>) => await updateUserApi(user)
);

type TProfileState = {
  user: TUser | null;
  status: 'idle' | 'loading' | 'succeed' | 'failed';
  errorMessage: string | null;
};

const initialState: TProfileState = {
  user: null,
  status: 'idle',
  errorMessage: null
};

const profileSlice = createSlice({
  name: 'profile',
  initialState,
  reducers: {
    clearProfile(state) {
      state.user = null;
      state.status = 'idle';
      state.errorMessage = null;
    }
  },
  selectors: {
    getUserSelector: (state) => state
  },
  extraReducers: (builder) => {
    builder
      .addCase(getUser.pending, (state) => {
        state.status = 'loading';
        state.errorMessage = null;
      })
      .addCase(getUser.rejected, (state, action) => {
        state.status = 'failed';
        state.errorMessage = action.error.message ? action.error.message : null;
      })
      .addCase(getUser.fulfilled, (state, action) => {
        state.status = 'succeed';
        state.user = action.payload.user;
      })
      .addCase(updateUser.pending, (state) => {
        state.status = 'loading';
        state.errorMessage = null;
      })
      .addCase(updateUser.rejected, (state, action) => {
        state.status = 'failed';
        state.errorMessage = action.error.message ? action.error.message : null;
      })
      .addCase(updateUser.fulfilled, (state, action) => {
        state.status = 'succeed';
        state.user = action.payload.user;
      });
  }
});

export const profileReducer = profileSlice.reducer;
export const { getUserSelector } = profileSlice.selectors;
export const { clearProfile } = profileSlice.actions;
