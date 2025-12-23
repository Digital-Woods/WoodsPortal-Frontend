import { StrictMode, useEffect, useState } from 'react'
import { RouterProvider } from '@tanstack/react-router'

import * as TanStackQueryProvider from './integrations/tanstack-query/root-provider.tsx'
import { getRefreshToken } from './data/client/auth-utils.ts';
import { getAuthRefreshToken, logout } from './data/client/http-client.ts';
import { isCookieExpired } from './utils/cookie.ts';
import { isExpiresAccessToken } from './data/client/token-store.ts';
import { env } from './env.ts';
import Loader from './components/ui/loader/loader.tsx';

export const App = ({ router }: any) => {
  const refreshToken = getRefreshToken()
  const [isLoading, setIsLoading] = useState<any>(true);

  useEffect(() => {
    setIsLoading(true)
    let mounted = true;

    const bootstrap = async () => {
      try {
        // if (!refreshToken) {
        //   logout();
        //   return;
        // }

        if (isCookieExpired(env.VITE_REFRESH_TOKEN)) {
          logout();
          return;
        }

        if (isExpiresAccessToken()) {
          await getAuthRefreshToken(refreshToken);
        }
      } catch (e: any) {
        logout();
      } finally {
        if (mounted) setIsLoading(false);
      }
    };

    bootstrap();

    return () => {
      mounted = false;
    };
  }, [refreshToken]);


  return (
    <>
      {isLoading ?
          <Loader showText={false} />
        :
        <StrictMode>
          <TanStackQueryProvider.Provider>
            <RouterProvider router={router} />
          </TanStackQueryProvider.Provider>
        </StrictMode>
      }
    </>
  );
};
