const Login = () => {
  const [activeState, setActiveState] = useState("pre-login");
  const [entredEmail, setEntredEmail] = useState("");
  const [loginData, setloginData] = useState([]);
  const clientSiteUrl = window.location.origin;

  return (
    <div>
      {activeState === "pre-login" ? (
        <PreLogin setActiveState={setActiveState} entredEmail={entredEmail} setEntredEmail={setEntredEmail} setloginData={setloginData}/>
      ) : activeState === "final-login" ? (
        <FinalLogin setActiveState={setActiveState} entredEmail={entredEmail} loginData={loginData} clientSiteUrl={clientSiteUrl} />
      ) : (
        <ExistingUserRegister setActiveState={setActiveState} entredEmail={entredEmail} loginData={loginData} clientSiteUrl={clientSiteUrl} />
      )}
    </div>
  );
};
