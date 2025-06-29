import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { TConstructorIngredient, TIngredient } from '@utils-types';
import { v4 as uuidv4 } from 'uuid';

export type TBurgerConstructorState = {
  bun: TConstructorIngredient | null;
  ingredients: TConstructorIngredient[];
};

const initialState: TBurgerConstructorState = {
  bun: null,
  ingredients: []
};

const burgerConstructorSlice = createSlice({
  name: 'burgerConstructor',
  initialState,
  reducers: {
    addIngredient: {
      reducer: (state, action: PayloadAction<TConstructorIngredient>) => {
        if (action.payload.type == 'bun') state.bun = action.payload;
        else state.ingredients.push(action.payload);
      },
      prepare: (ingredient: TIngredient) => mapIngredient(ingredient)
    },
    removeIngredient: (state, action: PayloadAction<string>) => {
      state.ingredients = state.ingredients.filter(
        (item) => item.id !== action.payload
      );
    },
    moveDownIngredient: (state, action: PayloadAction<string>) => {
      const element = state.ingredients.find(
        (item) => item.id == action.payload
      );
      if (!element) return;

      const ingredientIndex = state.ingredients.indexOf(element);
      state.ingredients.splice(
        ingredientIndex + 1,
        0,
        state.ingredients.splice(ingredientIndex, 1)[0]
      );
    },
    moveUpIngredient: (state, action: PayloadAction<string>) => {
      const element = state.ingredients.find(
        (item) => item.id == action.payload
      );
      if (!element) return;

      const ingredientIndex = state.ingredients.indexOf(element);
      state.ingredients.splice(
        ingredientIndex - 1,
        0,
        state.ingredients.splice(ingredientIndex, 1)[0]
      );
    },
    clearConstructor: (state) => {
      state.bun = null;
      state.ingredients = [];
    }
  },
  selectors: {
    getBurgerConstructorItems: (state) => state
  }
});

function mapIngredient(ingredient: TIngredient) {
  return { payload: { ...ingredient, id: uuidv4() } };
}

export const burgerConstructorReducer = burgerConstructorSlice.reducer;
export const { getBurgerConstructorItems } = burgerConstructorSlice.selectors;
export const {
  addIngredient,
  removeIngredient,
  moveDownIngredient,
  moveUpIngredient,
  clearConstructor
} = burgerConstructorSlice.actions;
