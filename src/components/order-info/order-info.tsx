import { FC, useEffect, useMemo } from 'react';
import { Preloader } from '../ui/preloader';
import { OrderInfoUI } from '../ui/order-info';
import { TIngredient } from '@utils-types';
import { useDispatch, useSelector } from '../../services/store';
import { getIngredients } from '../../services/ingredients/ingredientsSlice';
import { useParams } from 'react-router-dom';
import { getFeed } from '../../services/feed/feedSlice';
import { getOrderByNumber } from '../../services/userOrders/userOrdersSlice';

export const OrderInfo: FC = () => {
  const { number } = useParams<{ number: string }>();

  const feedOrders = useSelector(getFeed).orders;
  const currentOrder = useSelector((state) => state.userOrders.currentOrder);
  const dispatch = useDispatch();

  useEffect(() => {
    if (!number) return;

    const isOrderExists = feedOrders.some(
      (order) => order.number.toString() === number
    );

    if (!isOrderExists) {
      dispatch(getOrderByNumber(Number(number)));
    }
  }, [dispatch, number, feedOrders]);

  const orderData = useMemo(() => {
    if (!number) return null;

    return (
      feedOrders.find((order) => order.number.toString() === number) ||
      currentOrder ||
      null
    );
  }, [feedOrders, currentOrder, number]);

  const ingredients = useSelector(getIngredients);

  /* Готовим данные для отображения */
  const orderInfo = useMemo(() => {
    if (!orderData || !ingredients.length) return null;

    const date = new Date(orderData.createdAt);

    type TIngredientsWithCount = {
      [key: string]: TIngredient & { count: number };
    };

    const ingredientsInfo = orderData.ingredients.reduce(
      (acc: TIngredientsWithCount, item) => {
        if (!acc[item]) {
          const ingredient = ingredients.find((ing) => ing._id === item);
          if (ingredient) {
            acc[item] = {
              ...ingredient,
              count: 1
            };
          }
        } else {
          acc[item].count++;
        }

        return acc;
      },
      {}
    );

    const total = Object.values(ingredientsInfo).reduce(
      (acc, item) => acc + item.price * item.count,
      0
    );

    return {
      ...orderData,
      ingredientsInfo,
      date,
      total
    };
  }, [orderData, ingredients]);

  if (!orderInfo) {
    return <Preloader />;
  }

  return <OrderInfoUI orderInfo={orderInfo} />;
};
