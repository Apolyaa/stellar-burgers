import { createSlice } from '@reduxjs/toolkit';
import { TOrder } from '@utils-types';
import { createAsyncThunk } from '@reduxjs/toolkit';
import { getOrdersApi, getOrderByNumberApi } from '@api';

export const getUserOrders = createAsyncThunk(
  'orders',
  async () => await getOrdersApi()
);

export const getOrderByNumber = createAsyncThunk(
  'orders/number',
  async (number: number) => await getOrderByNumberApi(number)
);

type TUserOrdersState = {
  orders: TOrder[];
  currentOrder: TOrder | null;
  isLoading: boolean;
  errorMessage: string | null;
};

const initialState: TUserOrdersState = {
  orders: [],
  currentOrder: null,
  isLoading: false,
  errorMessage: null
};

const userOrdersSlice = createSlice({
  name: 'userOrders',
  initialState,
  reducers: {},
  selectors: {
    getOrders: (state) => state.orders,
    getCurrentOrder: (state) => state.currentOrder
  },
  extraReducers: (builder) => {
    builder
      .addCase(getUserOrders.pending, (state) => {
        state.isLoading = true;
        state.errorMessage = null;
      })
      .addCase(getUserOrders.rejected, (state, action) => {
        state.isLoading = false;
        state.errorMessage = action.error.message ? action.error.message : null;
      })
      .addCase(getUserOrders.fulfilled, (state, action) => {
        state.isLoading = false;
        state.orders = action.payload;
      })
      .addCase(getOrderByNumber.pending, (state) => {
        state.isLoading = true;
        state.errorMessage = null;
      })
      .addCase(getOrderByNumber.rejected, (state, action) => {
        state.isLoading = false;
        state.errorMessage = action.error.message ? action.error.message : null;
      })
      .addCase(getOrderByNumber.fulfilled, (state, action) => {
        state.isLoading = false;
        state.currentOrder = action.payload.orders[0];
      });
  }
});

export const userOrdersReducer = userOrdersSlice.reducer;
export const { getOrders, getCurrentOrder } = userOrdersSlice.selectors;
