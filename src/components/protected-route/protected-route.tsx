import { Navigate, useLocation } from 'react-router-dom';
import { useEffect } from 'react';
import { getUser } from '../../services/profile/profileSlice';
import { useDispatch, useSelector } from '../../services/store';

interface ProtectedRouteProps {
  children: React.ReactElement;
  authOnly?: boolean;
  guestOnly?: boolean;
}

export const ProtectedRoute = ({
  children,
  authOnly,
  guestOnly
}: ProtectedRouteProps) => {
  const dispatch = useDispatch();
  const { user, status } = useSelector((state) => state.profile);
  const location = useLocation();

  useEffect(() => {
    if (
      !user &&
      document.cookie.includes('accessToken=') &&
      status === 'idle'
    ) {
      dispatch(getUser());
    }
  }, [user, status, dispatch]);

  if (
    authOnly &&
    !user &&
    !document.cookie.includes('accessToken=') &&
    status !== 'loading'
  ) {
    return <Navigate to='/login' state={{ from: location }} replace />;
  }

  if (guestOnly && user) {
    const from = location.state?.from || { pathname: '/' };
    return <Navigate replace to={from} />;
  }

  return children;
};
