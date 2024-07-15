const { BrowserRouter, Route, Link, HashRouter, NavLink } = ReactRouterDOM;
const { RecoilRoot } = Recoil;
const { QueryClientProvider, QueryClient } = ReactQuery;

ReactDOM.render(
  <RecoilRoot>
    <QueryClientProvider client={new QueryClient()}>s
      <HashRouter>
        <MainLayout />
      </HashRouter>    
    </QueryClientProvider>
  </RecoilRoot>,
  document.getElementById("app")
);
