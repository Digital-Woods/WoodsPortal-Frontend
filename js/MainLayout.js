const MainLayout = ({ children }) => {
  const { routes, setRoutes } = useRoute();
  const { sidebarCollapsed } = useCollapsible();

  const { data, error, isLoading } = useQuery({
    queryKey: ["features"],
    queryFn: async () => await Client.fetchFeatures.all,
    onSuccess: (response) => {
      const apiRoutes = response.data.map((label) => ({
        path: `/${label.name}`,
        title: label.label,
        icon: label.icon,
      }));
      setRoutes(apiRoutes);
    },
  });

  console.log()

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error fetching data</div>;
  }

  return (
    <div className="flex dark:bg-gray-800 bg-white">
      <div className={`lg:w-${sidebarCollapsed ? "[12%]" : "[20%]"}`}>
        <SideLayout />
      </div>

      <div
        className={`lg:w-${
          sidebarCollapsed ? "[88%]" : "[80%]"
        } w-[100%] dark:bg-gray-800 lg:p-4 p-1 lg:h-full h-screen`}
      >
        <HeaderLayout />
        <div className="px-4 py-6">
          {routes.length > 0 &&
            routes.map(({ path, title, icon }) => (
              <Route
                key={path}
                path={path}
                render={(props) => (
                  <DynamicComponent
                    {...props}
                    path={path}
                    title={title}
                    icon={icon}
                  />
                )}
              />
            ))}

             <Route key="/details" path='/details/:feature/:id' render={(props) => <Details id={props.match.params.id} path={props.match.params.feature} />} />
                
            
        </div>
      </div>
    </div>
  );
};
