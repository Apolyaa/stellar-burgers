import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { TConstructorIngredient, TIngredient } from '@utils-types';

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
    addIngredient: (state, action: PayloadAction<TIngredient>) => {
      const newIngredient = mapIngredient(action.payload);

      if (action.payload.type == 'bun') state.bun = newIngredient;
      else state.ingredients.push(newIngredient);
    },
    removeIngredient: (state, action: PayloadAction<string>) => {
      state.ingredients = state.ingredients.filter(
        (item) => item._id !== action.payload
      );
    },
    moveDownIngredient: (state, action: PayloadAction<TIngredient>) => {
      const element = state.ingredients.find(
        (item) => item._id == action.payload._id
      );
      if (!element) return;

      const ingredientIndex = state.ingredients.indexOf(element);
      state.ingredients.splice(
        ingredientIndex + 1,
        0,
        state.ingredients.splice(ingredientIndex, 1)[0]
      );
    },
    moveUpIngredient: (state, action: PayloadAction<TIngredient>) => {
      const element = state.ingredients.find(
        (item) => item._id == action.payload._id
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

function mapIngredient(ingredient: TIngredient): TConstructorIngredient {
  return {
    id: ingredient._id,
    _id: ingredient._id,
    name: ingredient.name,
    type: ingredient.type,
    proteins: ingredient.proteins,
    fat: ingredient.fat,
    carbohydrates: ingredient.carbohydrates,
    calories: ingredient.calories,
    price: ingredient.price,
    image: ingredient.image,
    image_large: ingredient.image_large,
    image_mobile: ingredient.image_mobile
  };
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
