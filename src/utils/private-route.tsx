import React from 'react';
import { useRouter } from '@tanstack/react-router'
import {
  getAuthCredentials,
  isAuthenticated
} from '@/data/client/auth-utils';
import Loader from '@/components/ui/loader/loader';
import { Routes } from '@/config/routes';

const PrivateRoute: React.FC<{
  children?: React.ReactNode;
}> = ({ children }) => {
  const router = useRouter();
  const token = getAuthCredentials();
  const isUser = !!token;

  React.useEffect((): any => {
    if (!isUser) {
      router.history.replace(Routes.login); // If not authenticated, force log in
    }
  }, [isUser]);

  if (isAuthenticated()) {
    return <>{children}</>;
  }

  return <Loader showText={false} />;
};

export default PrivateRoute;
