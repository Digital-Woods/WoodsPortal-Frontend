import React from 'react';
import { useRouter } from '@tanstack/react-router';
import { getAuthCredentials, isAuthenticated } from './auth-utils';
import Loader from '@/components/ui/loader/loader';
import { Routes } from '@/config/routes';

const PublicRoute: React.FC<{
  children?: React.ReactNode;
}> = ({ children }) => {
  const router = useRouter();
  const { token } = getAuthCredentials();

  React.useEffect(() => {
    const currentPath = location.pathname;

    const isPublicPath = [
      Routes.login,
      Routes.twoFa,
      Routes.register,
      Routes.forgotPassword,
      Routes.resetPassword,
      Routes.verifyEmail,
      Routes.ResendEmail,
    ].includes(currentPath);

    if (!isAuthenticated({ token }) && !isPublicPath) {
      router.history.replace(Routes.login);
    }

    if (isAuthenticated({ token }) && isPublicPath) {
      router.history.replace(Routes.app); // or Routes.dashboard or whatever is your main app route
    }
  }, [token, router]);

  if (!isAuthenticated({ token })) {
    return <>{children}</>;
  }

  return <Loader showText={false} />;
};

export default PublicRoute;
