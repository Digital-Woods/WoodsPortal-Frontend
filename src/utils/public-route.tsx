import React from 'react';
import { useRouter, useRouterState } from '@tanstack/react-router';
// import { getAuthCredentials, isAuthenticated } from '@/data/client/auth-utils';
import Loader from '@/components/ui/loader/loader';
import { Routes } from '@/config/routes';
import { isAuthenticateApp } from '@/data/client/token-store';

const PublicRoute: React.FC<{
  children?: React.ReactNode;
}> = ({ children }) => {
  const router = useRouter();
  // const token = getAuthCredentials();
  const routeState = useRouterState();
  const currentRoute = routeState.location.pathname;
  const isAuthenticated = isAuthenticateApp();

  React.useEffect(() => {
    const isPublicPath = [
      Routes.login,
      Routes.register,
      Routes.forgotPassword,
      Routes.resetPassword,
      Routes.verifyEmail,
      Routes.ResendEmail,
    ].includes(currentRoute);


    if (!isAuthenticated && !isPublicPath) {
      router.history.replace(Routes.login);
    }

    // if (isAuthenticated && isPublicPath) {
    //   router.history.replace(Routes.app);
    // }
  }, [router, isAuthenticated]);

  if (!isAuthenticated) {
    return <>{children}</>;
  }

  return <Loader showText={false} />;
};

export default PublicRoute;
