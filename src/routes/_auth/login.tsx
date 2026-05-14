import { Outlet, createFileRoute, useRouter, useRouterState } from '@tanstack/react-router'
import { useEffect, useState } from 'react';
import { FinalLogin } from '@/components/ui/auth/FinalLogin';
import { PreLogin } from '@/components/ui/auth/PreLogin';
import { ExistingUserRegister } from '@/components/ui/auth/ExistingUserRegister';

const Login = () => {
  const router = useRouter();
  const pathname = useRouterState({ select: (state) => state.location.pathname });
  const [activeState, setActiveState] = useState("pre-login");
  const [entredEmail, setEntredEmail] = useState("");
  const [loginData, setloginData] = useState([]);
  const clientSiteUrl = window.location.origin;

  useEffect(() => {
    if (pathname !== '/login') return;

    const fromMainQuery = new URLSearchParams(window.location.search);
    let code = fromMainQuery.get('code') || '';
    let state = fromMainQuery.get('state') || '';

    // Handles URLs like "#/login?r=/?state=...&code=..."
    if (!code || !state) {
      const hashPart = window.location.hash || '';
      const hashQuery = hashPart.includes('?') ? hashPart.split('?')[1] : '';
      const hashParams = new URLSearchParams(hashQuery);
      const rParam = hashParams.get('r') || '';

      if (rParam.includes('?')) {
        const rQuery = rParam.split('?')[1];
        const rParams = new URLSearchParams(rQuery);
        code = rParams.get('code') || '';
        state = rParams.get('state') || '';
      }
    }

    if (code && state) {
      // Consume pre-hash callback params so retries/failures don't loop forever.
      if (window.location.search) {
        window.history.replaceState(
          null,
          '',
          `${window.location.pathname}${window.location.hash || '#/login'}`
        );
      }

      router.history.replace(
        `/login/sso?code=${encodeURIComponent(code)}&state=${encodeURIComponent(state)}`
      );
    }
  }, [pathname, router]);

  if (pathname.startsWith('/login/')) {
    return <Outlet />;
  }

  return (
    <div>
      {activeState === "pre-login" ? (
        <PreLogin setActiveState={setActiveState} entredEmail={entredEmail} setEntredEmail={setEntredEmail} setloginData={setloginData} />
      ) : activeState === "final-login" ? (
        <FinalLogin setActiveState={setActiveState} entredEmail={entredEmail} loginData={loginData} clientSiteUrl={clientSiteUrl} />
      ) : (
        <ExistingUserRegister setActiveState={setActiveState} entredEmail={entredEmail} loginData={loginData} clientSiteUrl={clientSiteUrl} />
      )}
    </div>
  );
};

export default Login

export const Route = createFileRoute('/_auth/login')({
  component: Login,
  beforeLoad: () => {
    return {
      layout: "AuthLayout",
      requiresAuth: false,
    }
  },
})
