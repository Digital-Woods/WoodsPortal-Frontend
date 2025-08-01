import React from 'react';
import { useRouter, useRouterState } from '@tanstack/react-router';
import { getAuthCredentials, isAuthenticated } from '@/data/client/auth-utils';
import Loader from '@/components/ui/loader/loader';
import { Routes } from '@/config/routes';

const PublicRoute: React.FC<{
  children?: React.ReactNode;
}> = ({ children }) => {
  const router = useRouter();
  const token = getAuthCredentials();
  const routeState = useRouterState();
  const currentRoute = routeState.location.pathname;

  React.useEffect(() => {
    const isPublicPath = [
      Routes.login,
      Routes.register,
      Routes.forgotPassword,
      Routes.resetPassword,
      Routes.verifyEmail,
      Routes.ResendEmail,
    ].includes(currentRoute);


    if (!isAuthenticated() && !isPublicPath) {
      router.history.replace(Routes.login);
    }

    if (isAuthenticated() && isPublicPath) {
      router.history.replace(Routes.app);
    }
  }, [token, router, isAuthenticated]);

  if (!isAuthenticated()) {
    return <>{children}</>;
  }

  return <Loader showText={false} />;
};

export default PublicRoute;
