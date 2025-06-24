import { FC, useMemo } from 'react';
import { TConstructorIngredient } from '@utils-types';
import { BurgerConstructorUI } from '@ui';
import { useSelector, useDispatch } from '../../services/store';
import {
  getBurgerConstructorItems,
  clearConstructor
} from '../../services/burger-constructor/burgerConstructorSlice';
import {
  getOrdersSelector,
  clear,
  orderBurgerApiThunk
} from '../../services/order/orderSlice';
import { useNavigate } from 'react-router-dom';
import { getFeeds } from '../../services/feed/feedSlice';
import { getUserOrders } from '../../services/userOrders/userOrdersSlice';

export const BurgerConstructor: FC = () => {
  const constructorItems = useSelector(getBurgerConstructorItems);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  let { orderRequest, order } = useSelector(getOrdersSelector);
  let orderModalData = order;
  const user = useSelector((state) => state.profile.user);

  const onOrderClick = () => {
    if (!constructorItems.bun || orderRequest) return;

    if (!user) {
      navigate('/login', { state: { from: '/' } });
      return;
    }

    const ingredientsIds = [
      constructorItems.bun._id,
      ...constructorItems.ingredients.map((item) => item._id),
      constructorItems.bun._id
    ];
    dispatch(orderBurgerApiThunk(ingredientsIds));
    dispatch(getFeeds());
    dispatch(getUserOrders());
    dispatch(clearConstructor());
  };
  const closeOrderModal = () => {
    dispatch(clear());
  };

  const price = useMemo(
    () =>
      (constructorItems.bun ? constructorItems.bun.price * 2 : 0) +
      constructorItems.ingredients.reduce(
        (s: number, v: TConstructorIngredient) => s + v.price,
        0
      ),
    [constructorItems]
  );

  return (
    <BurgerConstructorUI
      price={price}
      orderRequest={orderRequest}
      constructorItems={constructorItems}
      orderModalData={orderModalData}
      onOrderClick={onOrderClick}
      closeOrderModal={closeOrderModal}
    />
  );
};
