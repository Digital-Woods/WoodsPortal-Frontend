import { useEffect, useState } from 'react';
import { createFileRoute, useRouter } from '@tanstack/react-router';
import { toast } from 'sonner';
import { Client } from '@/data/client/index';
import {
  setPortal,
  setLoggedInDetails,
  setTwoFa,
  setAuthCredentials,
  setRefreshToken,
} from '@/data/client/auth-utils';
import { hubSpotUserDetails, makeLink } from '@/data/hubSpotData';
import { isArray } from '@/utils/DataMigration';
import { useAuth } from '@/state/use-auth';

const SsoLogin = () => {
  const router = useRouter();
  const { setSubscriptionType }: any = useAuth();
  const [isLoading, setIsLoading] = useState(true);
  const clearPreHashQueryParams = () => {
    if (!window.location.search) return;
    window.history.replaceState(
      null,
      '',
      `${window.location.pathname}${window.location.hash || ''}`
    );
  };

  useEffect(() => {
    const handleSsoCallback = async () => {
      try {
        const hashPart = window.location.hash || '';
        const queryFromHash = hashPart.includes('?') ? hashPart.split('?')[1] : '';
        const searchParams = new URLSearchParams(queryFromHash || window.location.search);
        const code = searchParams.get('code') || '';
        const state = searchParams.get('state') || '';
        const callbackKey = `${code}:${state}`;

        if (!code || !state) {
          toast.error('Missing SSO callback parameters.');
          router.history.replace('/login');
          return;
        }

        // Avoid repeated callback calls for the same one-time OAuth code.
        if (sessionStorage.getItem('sso_callback_processed') === callbackKey) {
          toast.error('SSO callback already processed. Please try login again.');
          router.history.replace('/login');
          return;
        }
        sessionStorage.setItem('sso_callback_processed', callbackKey);

        const data: any = await Client.authentication.ssoCallback(code, state);
        const tokenData: any = data?.data?.tokenData || {};
        const loggedInDetails: any = data?.data?.loggedInDetails || {};
        const currentPortal: any = data?.data?.loggedInDetails?.currentPortal || {};

        if (loggedInDetails?.currentPortal) {
          delete loggedInDetails?.currentPortal;
        }
        if (loggedInDetails?.hubspots) {
          delete loggedInDetails?.hubspots;
        }

        if (!tokenData?.token) {
          toast.error('SSO login failed.');
          router.history.replace('/login');
          return;
        }

        setPortal(currentPortal);

        const subscriptionType = loggedInDetails?.subscriptionType || 'FREE';
        setSubscriptionType(subscriptionType);

        const token = tokenData?.token;
        const refreshToken = tokenData?.refreshToken;
        const expiresIn = tokenData?.expiresIn;
        const rExpiresIn = tokenData?.refreshExpiresIn;

        if (
          loggedInDetails &&
          loggedInDetails?.hubspot &&
          loggedInDetails?.hubspot.twoFa
        ) {
          clearPreHashQueryParams();
          setLoggedInDetails(data.data);
          setTwoFa({ twoFa: loggedInDetails?.hubspot?.twoFa });
          window.location.hash = '/login/two-fa';
          return;
        }

        await setAuthCredentials(token, expiresIn);
        await setRefreshToken(refreshToken, rExpiresIn);
        await setLoggedInDetails(data.data);

        let path =
          isArray(hubSpotUserDetails?.sideMenu) && hubSpotUserDetails?.sideMenu.length > 0
            ? makeLink(hubSpotUserDetails?.sideMenu[0])
            : '';
        if (router.state.location?.search?.r) {
          path = router.state.location?.search?.r as any;
        }
        clearPreHashQueryParams();
        router.navigate({ to: `/${path}` });
        toast.success(data?.statusMsg || 'Login successful');
      } catch (error: any) {
        const errorMessage =
          error?.response?.data?.errorMessage || 'SSO callback failed.';
        toast.error(errorMessage);
        router.history.replace('/login');
      } finally {
        setIsLoading(false);
      }
    };

    handleSsoCallback();
  }, [router, setSubscriptionType]);

  return (
    <div className="w-full flex flex-col items-center justify-center gap-2 h-screen">
      <div>
        <svg xmlns="http://www.w3.org/2000/svg" height={80} width={80} viewBox="0 0 200 200"><radialGradient id="a7" cx=".66" fx=".66" cy=".3125" fy=".3125" gradientTransform="scale(1.5)"><stop offset="0" stop-color="#FF5C35"></stop><stop offset=".3" stop-color="#FF5C35" stop-opacity=".9"></stop><stop offset=".6" stop-color="#FF5C35" stop-opacity=".6"></stop><stop offset=".8" stop-color="#FF5C35" stop-opacity=".3"></stop><stop offset="1" stop-color="#FF5C35" stop-opacity="0"></stop></radialGradient><circle transform-origin="center" fill="none" stroke="url(#a7)" stroke-width="16" stroke-linecap="round" stroke-dasharray="200 1000" stroke-dashoffset="0" cx="100" cy="100" r="70"><animateTransform type="rotate" attributeName="transform" calcMode="spline" dur="2" values="360;0" keyTimes="0;1" keySplines="0 0 1 1" repeatCount="indefinite"></animateTransform></circle><circle transform-origin="center" fill="none" opacity=".2" stroke="#FF5C35" stroke-width="16" stroke-linecap="round" cx="100" cy="100" r="70"></circle></svg>
      </div>
      <p className="text-sm">{isLoading ? 'Signing you in...' : 'Redirecting...'}</p>
    </div>
  );
};

export default SsoLogin

export const Route = createFileRoute('/_auth/login/sso')({
  component: SsoLogin,
  beforeLoad: () => {
    return {
      layout: "AuthLayout",
      requiresAuth: false,
    }
  },
})
