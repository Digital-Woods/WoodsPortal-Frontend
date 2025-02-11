const PrivateRoute = ({ component: Component, ...rest }) => {
  const { Switch, Route, Redirect } = ReactRouterDOM;
  return (
    <Route
      {...rest}
      render={(props) =>
        isAuthenticated() || env.DATA_SOURCE_SET === true  ? <Component {...props} /> : <Redirect to="/login" />
      }
    />
  );
};
