import { getIngredientsApi } from '@api';
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { TIngredient } from '@utils-types';

export const getIngredientsApiThunk = createAsyncThunk(
  'ingredients',
  async () => await getIngredientsApi()
);

export type TIngredientsState = {
  ingredients: Array<TIngredient>;
  isLoading: boolean;
  errorMessage: string | null;
};

const initialState: TIngredientsState = {
  ingredients: [],
  isLoading: false,
  errorMessage: null
};

const ingredientsSlice = createSlice({
  name: 'ingredient',
  initialState,
  reducers: {},
  selectors: {
    getIngredients: (state) => state.ingredients,
    getIngredientsIsLoading: (state) => state.isLoading,
    getIngredientsError: (state) => state.errorMessage
  },
  extraReducers: (builder) => {
    builder
      .addCase(getIngredientsApiThunk.pending, (state) => {
        state.isLoading = true;
        state.errorMessage = null;
      })
      .addCase(getIngredientsApiThunk.rejected, (state, action) => {
        state.isLoading = false;
        state.errorMessage = action.error.message ? action.error.message : null;
      })
      .addCase(getIngredientsApiThunk.fulfilled, (state, action) => {
        state.isLoading = false;
        state.ingredients = action.payload;
      });
  }
});

export const ingredientsReducer = ingredientsSlice.reducer;
export const { getIngredients, getIngredientsIsLoading, getIngredientsError } =
  ingredientsSlice.selectors;
