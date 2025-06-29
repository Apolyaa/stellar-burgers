import { Preloader } from '@ui';
import { FeedUI } from '@ui-pages';
import { FC, useEffect } from 'react';
import { useSelector, useDispatch } from '../../services/store';
import { getFeeds, getOrders } from '../../services/feed/feedSlice';

export const Feed: FC = () => {
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(getFeeds());
  }, [dispatch]);

  const orders = useSelector(getOrders);
  const isLoading = useSelector((state) => state.feeds.isLoading);

  if (isLoading || !orders.length) {
    return <Preloader />;
  }

  return (
    <FeedUI
      orders={orders}
      handleGetFeeds={() => {
        dispatch(getFeeds());
      }}
    />
  );
};
