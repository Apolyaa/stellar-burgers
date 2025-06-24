import { orderBurgerApi } from '@api';
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { TOrder } from '@utils-types';

export const orderBurgerApiThunk = createAsyncThunk(
  'orders',
  async (data: string[]) => await orderBurgerApi(data)
);

type TNewOrderState = {
  order: TOrder | null;
  errorMessage: string | null;
  orderRequest: boolean;
};

const initialState: TNewOrderState = {
  order: null,
  errorMessage: null,
  orderRequest: false
};

const ordersSlice = createSlice({
  name: 'newOrder',
  initialState,
  reducers: {
    clear: (state) => {
      state.order = null;
      state.orderRequest = false;
    }
  },
  selectors: {
    getOrdersSelector: (state) => state
  },
  extraReducers: (builder) => {
    builder
      .addCase(orderBurgerApiThunk.pending, (state) => {
        state.errorMessage = null;
        state.orderRequest = true;
      })
      .addCase(orderBurgerApiThunk.rejected, (state, action) => {
        state.errorMessage = action.error.message ? action.error.message : null;
        state.orderRequest = false;
      })
      .addCase(orderBurgerApiThunk.fulfilled, (state, action) => {
        state.order = action.payload.order;
        state.orderRequest = false;
      });
  }
});

export const { clear } = ordersSlice.actions;
export const orderReducer = ordersSlice.reducer;
export const { getOrdersSelector } = ordersSlice.selectors;
