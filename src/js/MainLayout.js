const { useState, useEffect, useRef, useCallback } = React;
const { useMutation, useQuery } = ReactQuery;

const MainLayout = ({ children }) => {
  const { routes, setRoutes } = useRoute();
  const { sidebarCollapsed } = useCollapsible();
  const { Switch, Route, Redirect } = ReactRouterDOM;
  const [showPortalMessage, setShowPortalMessage] = React.useState(false);
  const [isLoading, setIsLoading] = React.useState(true);
  const { logout, error } = useLogout();
  const [dashboardTabName, setDashboardTabName] = React.useState('');

  const defaultRoutes = [
    {
      path: `/login`,
      title: "Login",
      icon: "",
      isRequiredAuth: false,
      isHeader: false,
      component: <Login />,
    },
    {
      path: `/forget-password`,
      title: "Forget Password",
      icon: "",
      isRequiredAuth: false,
      isHeader: false,
      component: <ForgetPassword />,
    },
    {
      path: `/notifications`,
      title: "Notifications",
      icon: "",
      isRequiredAuth: true,
      isHeader: true,
      component: <Notification />,
    },
    {
      path: `/profile`,
      title: "Profile",
      icon: "",
      isRequiredAuth: true,
      isHeader: true,
      component: <Profile />,
    },
  ];

  useEffect(() => {
    const sideMenu = [
      {
        name: "CONTACT",
        labels: {
          singular: "Contact",
          plural: "Contacts",
        },
        hubspotObjectId: 1,
        hubspotObjectTypeId: "0-1",
        children: hubSpotUserDetails.sideMenu,
      },
    ];

    const apiRoutes = sideMenu[0].children.map((menuItem, index) => ({
      hubspotObjectTypeId: `${menuItem.hubspotObjectTypeId}`,
      path: `/${formatPath(menuItem.tabName || menuItem.label)}`,
      title: formatCustomObjectLabel(menuItem.tabName || menuItem.label),
      icon: menuItem.icon,
      isRequiredAuth: true,
      isHeader: true,
      companyAsMediator: menuItem.companyAsMediator,
      pipeLineId: menuItem.pipeLineId,
      specPipeLine: menuItem.specPipeLine,
      objectDescription:menuItem.objectDescription,
      component: (
        <DynamicComponent
          key={index}
          hubspotObjectTypeId={`/${menuItem.hubspotObjectTypeId}`}
          path={`/${formatPath(menuItem.tabName || menuItem.label)}`}
          title={formatCustomObjectLabel(menuItem.tabName || menuItem.label)}
          icon={menuItem.icon}
          companyAsMediator={menuItem.companyAsMediator}
          pipeLineId={menuItem.pipeLineId}
          specPipeLine={menuItem.specPipeLine}
          objectDescription={menuItem.objectDescription}
        />
      ),
    }));
    setRoutes(apiRoutes);
    setIsLoading(false);
    setDashboardTabName(sideMenu[0]?.children[0]?.tabName ? formatPath(sideMenu[0]?.children[0]?.tabName):'');
  }, []);

  if (isLoading) {
    return (
      <div className="text-center p-10 w-full h-screen flex items-center justify-center">
        <div className="loader">
          <div className="loader-line"></div>
        </div>
      </div>
    );
  }

  if (showPortalMessage) {
    return (
      <div className="text-center p-10 w-full h-screen text-3xl font-semibold bg-secondary text-white flex flex-col items-center justify-center">
        <h2>Please Select a HubSpot Portal</h2>
        <p>Before Continuing.</p>
        <div
          className="block bg-white text-black my-4 px-3 py-2.5 rounded-md no-underline cursor-pointer"
          onClick={logout}
        >
          <div className="flex items-center gap-x-4">
            <div>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                height="20px"
                viewBox="0 -960 960 960"
                width="20px"
                className="dark:fill-white fill-black"
              >
                <path d="M228.31-164q-27.01 0-45.66-18.65Q164-201.3 164-228.31v-503.38q0-27.01 18.65-45.66Q201.3-796 228.31-796h252.07v52H228.31q-4.62 0-8.46 3.85-3.85 3.84-3.85 8.46v503.38q0 4.62 3.85 8.46 3.84 3.85 8.46 3.85h252.07v52H228.31Zm428.92-177.23-37.54-36.39L696.08-454H387.85v-52h308.23l-76.39-76.38 37.54-36.39L796-480 657.23-341.23Z" />
              </svg>
            </div>
            <p
              className={`
                       text-black text-sm font-medium  dark:text-white`}
            >
              Logout
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <React.Fragment>
      {isLoading != false ? (
        <div className="loader-line"></div>
      ) : (
        <div className="dark:bg-dark-200 bg-cleanWhite lg:flex-col flex lg:h-[100vh] h-[100vh]">
          <Drawer
            className={`relative lg:fixed min-h-screen w-full inset-0 lg:w-${
              sidebarCollapsed ? "[75px]" : "[250px]"
            }`}
          />
          <div
            className={`dark:bg-dark-200  lg:h-[100vh] h-[100vh] bg-cleanWhite ml-auto w-full lg:w-${
              sidebarCollapsed ? "[calc(100%_-_75px)]" : "[calc(100%_-_250px)]"
            }`}
          >
            <Switch>
              {/* Default Route */}
              {defaultRoutes.map(
                ({ path, title, icon, isRequiredAuth, isHeader, component }) =>
                  isRequiredAuth ? (
                    <PrivateRoute
                      key={path}
                      path={path}
                      component={(props) => (
                        <React.Fragment>
                          {isHeader && (
                            <HeaderLayout
                              {...props}
                              path={path}
                              title={`${title}`}
                              icon={icon}
                            />
                          )}
                          {component}
                        </React.Fragment>
                      )}
                    />
                  ) : (
                    <PublicRoute
                      key={path}
                      path={path}
                      routes={routes}
                      component={(props) => (
                        <React.Fragment>
                          {isHeader && (
                            <HeaderLayout
                              {...props}
                              path={path}
                              title={`${title}`}
                              icon={icon}
                            />
                          )}
                          {component}
                        </React.Fragment>
                      )}
                    />
                  )
              )}
              <PrivateRoute
                exact
                path="/not-verified-email"
                component={NotVerifiedEmail}
              />

              {/* Root Route */}
              <PrivateRoute
                exact
                path="/"
                component={() => (
                  <React.Fragment>
                    <HeaderLayout
                      path={routes[0].path}
                      title={routes[0].title}
                      icon={routes[0].icon}
                    />
                    <DynamicComponent
                      hubspotObjectTypeId={routes[0].hubspotObjectTypeId}
                      path={routes[0].path}
                      title={routes[0].title}
                      icon={routes[0].icon}
                      companyAsMediator={routes[0].companyAsMediator}
                      pipeLineId={routes[0].pipeLineId}
                      specPipeLine={routes[0].specPipeLine}
                      objectDescription={routes[0].objectDescription}
                    />
                  </React.Fragment>
                )}
              />

              {/* Details Routs */}
              <PrivateRoute
                path={`/:path/:object_id/:id`}
                component={(props) => (
                  <React.Fragment>
                    <HeaderLayout
                      {...props}
                      path={`/${props.match.params.path}`}
                      id={`/${props.match.params.id}`}
                      title={props.match.params.path}
                      icon={``}
                    />
                    <Details
                      path={props.match.params.path}
                      objectId={props.match.params.object_id}
                      id={props.match.params.id}
                    />
                  </React.Fragment>
                )}
              />

              {/* Association Routs */}
              <PrivateRoute
                key={`association`}
                path={`/association/:name`}
                component={(props) => (
                  <React.Fragment>
                    <HeaderLayout
                      {...props}
                      path={`/association`}
                      title={`Association`}
                    />
                    <DynamicComponent
                      {...props}
                      path={`/association`}
                      title={`Association`}
                    />
                  </React.Fragment>
                )}
              />

              {/* List Routs */}
              {routes.map(
                ({
                  hubspotObjectTypeId,
                  path,
                  title,
                  icon,
                  companyAsMediator,
                  pipeLineId,
                  specPipeLine,
                  objectDescription
                }) => (
                  <PrivateRoute
                    key={path}
                    path={path}
                    component={(props) => (
                      <React.Fragment>
                        <HeaderLayout
                          {...props}
                          path={path}
                          title={`${title}`}
                          icon={icon}
                        />
                        {path === `/${dashboardTabName}` ? (
                          <Home
                            {...props}
                            hubspotObjectTypeId={hubspotObjectTypeId}
                            path={path}
                            title={`${title}`}
                            icon={icon}
                            companyAsMediator={companyAsMediator}
                            pipeLineId={pipeLineId}
                            specPipeLine={specPipeLine}
                          />
                        ) : (
                          <DynamicComponent
                            {...props}
                            hubspotObjectTypeId={hubspotObjectTypeId}
                            path={path}
                            title={`${title}`}
                            icon={icon}
                            companyAsMediator={companyAsMediator}
                            pipeLineId={pipeLineId}
                            specPipeLine={specPipeLine}
                            objectDescription={objectDescription}
                          />
                        )}
                      </React.Fragment>
                    )}
                  />
                )
              )}

              <Redirect to="/login" />
            </Switch>
          </div>
        </div>
      )}
    </React.Fragment>
  );
};
