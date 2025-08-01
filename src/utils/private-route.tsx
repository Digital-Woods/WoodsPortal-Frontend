import React from 'react';
import { useRouter, useRouterState } from '@tanstack/react-router'
import {
  getAuthCredentials,
  getEmailVerified,
  getPortalId,
  getHubId,
  getTwoFa,
} from './auth-utils';
import Loader from '@/components/ui/loader/loader';
import { Routes } from '@/config/routes';
import { useMeQuery } from '@/data/user';

const PrivateRoute: React.FC<{
  children?: React.ReactNode;
}> = ({ children }) => {
  const router = useRouter();
  const routeState = useRouterState();
  const currentRoute = routeState.location.pathname;
  const { token } = getAuthCredentials();
  const isUser = !!token;
  const { emailVerified } = getEmailVerified();
  const { twoFa } = getTwoFa();

  // Get User Data
  const { data: meData } = useMeQuery();

  // fetch portalID
  let portalId: number = getPortalId();
  let hubId: number = getHubId();

  React.useEffect(() => {
    if (!emailVerified) router.history.replace(Routes.ResendEmail);
    if (currentRoute == Routes.ResendEmail && emailVerified) Routes.mapObjects;
  }, [emailVerified]);

  React.useEffect(() => {
    if (twoFa && !isUser) router.history.replace(Routes.twoFa);
    if (currentRoute == Routes.twoFa && !twoFa) Routes.mapObjects;
  }, [twoFa, isUser]);

  React.useEffect(() => {
    if (!isUser && !twoFa) router.history.replace(Routes.login); // If not authenticated, force log in
  }, [isUser]);
  React.useEffect(() => {
    if ((twoFa || emailVerified) && meData?.data) {
      if (!hubId) {
        if (currentRoute == Routes.accountSelect) {
          {
            children;
          }
        } else {
          router.history.replace(Routes.accountSelect);
        }
      } else if (!portalId) {
        if (currentRoute === Routes.accountSelect) {
          {
            children;
          }
        } else {
          router.history.replace(Routes.portal);
        }
      }
    }
  }, [portalId, meData, twoFa, emailVerified]);

  if (twoFa || !emailVerified || !hubId || !portalId) {
    return <>{children}</>;
  }

  if (hubId && portalId && isUser) {
    return <>{children}</>;
  }

  return <Loader showText={false} />;
};

export default PrivateRoute;
