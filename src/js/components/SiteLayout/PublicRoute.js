const PublicRoute = ({
  component: Component,
  restricted = true,
  routes,
  ...rest
}) => {
  const { Switch, Route, Redirect } = ReactRouterDOM;

  // return (
  //   <Route
  //     {...rest}
  //     render={(props) =>
  //       isAuthenticated() && restricted ? (
  //         <Redirect to="/" />
  //       ) : (
  //         <Component {...props} />
  //       )
  //     }
  //   />
  // );
  return isAuthenticated() && restricted ? (
    <Redirect to={routes?.length > 0 ? routes[0].path : "/"} />
  ) : (
    <Route {...rest} render={(props) => <Component {...props} />} />
  );
};
