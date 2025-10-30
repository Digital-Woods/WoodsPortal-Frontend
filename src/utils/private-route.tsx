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
    const currentPath: any = router.state.location.pathname;
    if (!isUser) {
        const isPublicPath = [
        Routes.login,
        Routes.register,
        Routes.forgotPassword,
        Routes.resetPassword,
        Routes.verifyEmail,
        Routes.ResendEmail,
      ].includes(currentPath);
      if(isPublicPath) return

      const redirectPath = currentPath != Routes.login ? `?r=${router.state.location.href}` : '';
      const redirectRoute = `${Routes.login}${redirectPath}`;
      router.history.replace(redirectRoute); // If not authenticated, force log in
    }
  }, [isUser]);

  if (isUser) {
    return <>{children}</>;
  }

  return <Loader showText={false} />;
};

export default PrivateRoute;
