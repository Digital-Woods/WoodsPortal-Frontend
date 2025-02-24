const {
  BrowserRouter,
  Route,
  Link,
  HashRouter,
  NavLink,
  Switch,
  Redirect,
  useParams,
} = ReactRouterDOM;

const {
  ChangeEvent,
  useCallback,
  useEffect,
  useMemo,
  useState,
  useRef,
  createContext,
  useContext,
} = React;

const queryClient = new ReactQuery.QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      refetchInterval: false,
    },
  },
});

function App() {
  const { RecoilRoot } = Recoil;
  const { QueryClientProvider } = ReactQuery;
  return (
    <RecoilRoot>
      <QueryClientProvider client={queryClient}>
        <HashRouter>
          <Route
            render={() =>
              isAuthenticated() || env.DATA_SOURCE_SET === true ? (
                <MainLayout />
              ) : (
                <Switch>
                  <Route exact path="/login" component={Login} />
                  <Route exact path="/login/tow-fa" component={TwoFa} />
                  <Route
                    exact
                    path="/forget-password"
                    component={ForgetPassword}
                  />
                  <Route exact path="/verify-email" component={VerifyEmail} />
                  <Route
                    exact
                    path="/reset-password"
                    component={ResetPassword}
                  />
                  <Redirect to="/login" />
                </Switch>
              )
            }
          />
        </HashRouter>
      </QueryClientProvider>
    </RecoilRoot>
  );
}

// Render the App component
ReactDOM.render(<App />, document.getElementById("app"));
