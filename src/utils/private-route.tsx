import React from 'react';
import { useRouter } from '@tanstack/react-router'
import {
  getAuthCredentials,
  isAuthenticated
} from '@/data/client/auth-utils';
import Loader from '@/components/ui/loader/loader';
import { Routes } from '@/config/routes';
import { isAuthenticateApp } from '@/data/client/token-store';

const PrivateRoute: React.FC<{
  children?: React.ReactNode;
}> = ({ children }) => {
  const router = useRouter();
  // const token = getAuthCredentials();
  // const isUser = !!token;

  const isUser = isAuthenticateApp();

  React.useEffect((): any => {
    if (!isUser) {
      router.history.replace(Routes.login); // If not authenticated, force log in
    }
  }, [isUser]);

  if (isUser) {
    return <>{children}</>;
  }

  return <Loader showText={false} />;
};

export default PrivateRoute;
