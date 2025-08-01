import { createFileRoute } from '@tanstack/react-router'
import { useState } from 'react';
import PreLogin from '@/routes/_auth/PreLogin';
import FinalLogin from '@/routes/_auth/FinalLogin';
import ExistingUserRegister from '@/routes/_auth/ExistingUserRegister';

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
