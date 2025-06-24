import { configureStore } from '@reduxjs/toolkit';

import {
  TypedUseSelectorHook,
  useDispatch as dispatchHook,
  useSelector as selectorHook
} from 'react-redux';

import { ingredientsReducer } from './ingredients/ingredientsSlice';
import { orderReducer } from './order/orderSlice';
import { feedsReducer } from './feed/feedSlice';
import { burgerConstructorReducer } from './burger-constructor/burgerConstructorSlice';
import { authReducer } from './auth/authSlice';
import { profileReducer } from './profile/profileSlice';
import { userOrdersReducer } from './userOrders/userOrdersSlice';
// const rootReducer = () => {reducer}; // Заменить на импорт настоящего редьюсера

export const store = configureStore({
  reducer: {
    ingredient: ingredientsReducer,
    burgerConstructor: burgerConstructorReducer,
    newOrder: orderReducer,
    feeds: feedsReducer,
    auth: authReducer,
    profile: profileReducer,
    userOrders: userOrdersReducer
  },
  devTools: process.env.NODE_ENV !== 'production'
});

export type RootState = ReturnType<typeof store.getState>;

export type AppDispatch = typeof store.dispatch;

export const useDispatch: () => AppDispatch = () => dispatchHook();
export const useSelector: TypedUseSelectorHook<RootState> = selectorHook;

export default store;
