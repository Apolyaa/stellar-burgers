import { ProfileOrdersUI } from '@ui-pages';
import { FC, useEffect } from 'react';
import { useDispatch, useSelector } from '../../services/store';
import { getUserOrders } from '../../services/userOrders/userOrdersSlice';

export const ProfileOrders: FC = () => {
  const dispatch = useDispatch();

  const { orders } = useSelector((state) => state.userOrders);

  useEffect(() => {
    dispatch(getUserOrders());
  }, [dispatch]);

  return <ProfileOrdersUI orders={orders} />;
};
