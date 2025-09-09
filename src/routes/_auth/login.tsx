import { createFileRoute } from '@tanstack/react-router'
import { useState } from 'react';
import { FinalLogin } from '@/components/ui/auth/FinalLogin';
import { PreLogin } from '@/components/ui/auth/PreLogin';
import { ExistingUserRegister } from '@/components/ui/auth/ExistingUserRegister';

const Login = () => {
  const [activeState, setActiveState] = useState("pre-login");
  const [entredEmail, setEntredEmail] = useState("");
  const [loginData, setloginData] = useState([]);
  const clientSiteUrl = window.location.origin;

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
