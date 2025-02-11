const PublicRoute = ({ component: Component, restricted = true, ...rest }) => {
  const { Switch, Route, Redirect } = ReactRouterDOM;

  return (
    <Route
      {...rest}
      render={(props) =>
        isAuthenticated() && restricted ? (
          <Redirect to="/" />
        ) : (
          <Component {...props} />
        )
      }
    />
  );
};
