const useDynamicPathname = () => {
  const [customPath, setCustomPath] = useState("");

  useEffect(() => {
    const fullPath = window.location.href;

    const segments = fullPath.split("/");

    const dynamicBasePath = segments[3];

    const basePath = `/${dynamicBasePath}`;
    const index = fullPath.indexOf(basePath);

    if (index !== -1) {
      const extractedPath = fullPath.substring(index + basePath.length);
      setCustomPath(extractedPath);
    }
  }, []);

  return customPath;
};

const Drawer = ({ className }) => {
  const { sidebarCollapsed, setSidebarCollapsed } = useCollapsible();
  const [isSecondIcon, setIsSecondIcon] = useState(false);
  const { sidebarOpen, setSidebarOpen } = useCollapsible();
  const { me } = useMe();
  const { logout, isLoading, error } = useLogout();
  const { routes, setRoutes } = useRoute();

  const [activeRoute, setActiveRoute] = useState("");
  const [sideBarOptions, setSideBarOptions] = useState({});
  const [brandName, setBrandName] = useState(hubSpotUserDetails.hubspotPortals.portalSettings.brandName);
  const [logoutDialog, setLogoutDialog] = Recoil.useRecoilState(logoutDialogState);
  const customPath = useDynamicPathname();

  useEffect(() => setActiveRoute(customPath), [customPath]);

  useEffect(() => {
    const brandParam = getParam("brandName");
    if (brandParam && brandParam !== "null") {
      setBrandName(brandParam);
    } else if (
      me &&
      me.hubspotPortals &&
      me.hubspotPortals.portalSettings &&
      me.hubspotPortals.portalSettings.brandName
    ) {
      setBrandName(me.hubspotPortals.portalSettings.brandName);
    }
  }, [me]);

  const toggleSidebar = () => {
    setSidebarCollapsed(!sidebarCollapsed);
    setIsSecondIcon(!isSecondIcon);
  };
  const shouldShowTooltip = brandName.length > 10;

  useEffect(() => {
    setSideBarOptions(hubSpotUserDetails.sideBarOptions);
  }, []);
  const { isLargeScreen, isMediumScreen, isSmallScreen } = useResponsive();

  const handleSetActiveRoute = useCallback(
    (path) => {
      setActiveRoute((prev) => {
        if (prev !== path) {
          return path;
        }
        return prev;
      });
      setSidebarOpen(false);
      window.location.hash = path;
    },
    []
  );

  return (
    <div className="relative">
      {sidebarOpen && (
        <div className="relative z-[53]">
          <div
            className="fixed inset-0 bg-gray-500 dark:bg-dark-300 bg-opacity-50 dark:bg-opacity-50 backdrop-blur-md backdrop-filter transition-opacity lg:hidden"
            aria-hidden="true"
            onClick={() => setSidebarOpen(false)}
          ></div>
        </div>
      )}

      <div className={`${className} relative`}>
        <div
          className={`h-[100vh] z-[55] sidebar bg-sidelayoutColor dark:bg-dark-300 lg:relative lg:translate-x-0 absolute inset-y-0 left-0 transform ${(isMediumScreen || isSmallScreen) && 'w-[300px]'} ${isLargeScreen && 'w-auto'}  transition duration-200 ease-in-out ${sidebarOpen ? "translate-x-0" : "-translate-x-full"
            }
        ${sidebarCollapsed ? "p-3" : "p-4"}
        `}
        >
          <div className="h-full flex flex-col">
            <div className="flex relative justify-between items-center mb-8">
              <div onClick={() => handleSetActiveRoute(formatPath(hubSpotUserDetails.sideMenu[0].tabName))} className={`flex ${showCompanyNameOption === true ? 'flex-row items-center' : 'flex-col'} gap-2 cursor-pointer`}>
                {showCompanyNameOption ?
                  <div className="w-[50px]">
                    <img src={hubSpotUserDetails.hubspotPortals.portalSettings.smallLogo} alt="Logo" className={`h-auto mr-2 `} />
                  </div> :
                  <div className={`${sidebarCollapsed ? 'w-40px' : 'w-full'}  max-h-[60px]`}>
                    {sidebarCollapsed ?
                      <img src={hubSpotUserDetails.hubspotPortals.portalSettings.smallLogo} alt="Logo" className={`h-auto`} /> :
                      <Logo className={'max-h-[60px]'} />
                    }
                  </div>}

                {showCompanyNameOption === true ?
                  <h1 className={`text-sm font-semibold pr-4 pl-1 break-al ease-in-out duration-500 tra text-sidelayoutTextColor dark:text-white ${sidebarCollapsed ? "hidden" : "block"}`}>
                    {shouldShowTooltip ? (
                      <div>
                        {brandName.slice(0, 15)}
                        {brandName.length > 15 ? "..." : ""}
                      </div>
                    ) : (
                      brandName
                    )}
                  </h1> : ''}
              </div>
              <div
                className=" rounded-lg cursor-pointer text-sidelayoutTextColor dark:text-white bg-gray-600 px-2 py-1 lg:hidden absolute right-[-10px] top-0"
                onClick={() => setSidebarOpen(false)}
              >
                <CloseIcon />
              </div>
            </div>
            <nav className="space-y-1 flex-1">
              <div className=" flex flex-col h-full justify-between ">
                <div className={`${showSidebarCtaOption ? 'max-h-[calc(100vh-355px)]' : 'max-h-[calc(100vh-160px)]'} flex flex-col gap-2 overflow-y-auto overflow-x-visible hide-scrollbar relative`}>
                  {(routes.length > 0 && activeRoute) &&
                    routes.map(({ path, title, icon }) => (
                      <div
                        key={path}
                        to={path}
                        className={`cursor-pointer block hover:bg-activeState dark:hover:bg-activeState dark:hover:text-white ${sidebarCollapsed ? 'py-3 px-0' : 'px-3 py-[0.55rem]'} rounded-md no-underline ${activeRoute === path ? "bg-activeState" : ""
                          }`}
                        onClick={() => handleSetActiveRoute(path)}
                      >
                        <div
                          className={`flex items-center text-sidelayoutTextColor dark:text-white gap-x-3 gap-y-1 ${sidebarCollapsed
                            ? "justify-center"
                            : "justify-start"
                            }`}
                        >
                          {icon ? (
                            <SvgRenderer svgContent={icon} />
                          ) : (
                            <SvgRenderer svgContent={defaultSvg} />
                          )}
                          <p
                            className={`${sidebarCollapsed
                              ? "hidden opacity-0"
                              : "opacity-100"
                              } text-sidelayoutTextColor dark:text-white text-sm font-medium transition-opacity capitalize duration-500 opacity-0 ml-2`}
                          >
                            {`${title}`}
                          </p>
                        </div>
                      </div>
                    ))}
                  {routes.length > 7 && (
                    <div className="sticky -bottom-[2] left-0 right-0 h-6 pointer-events-none">
                      <div className="w-full h-full bg-gradient-to-t from-sidelayoutColor dark:from-dark-300 to-transparent"></div>
                    </div>
                  )}
                </div>
                {
                  showSidebarCtaOption === true && (
                    !sidebarCollapsed && (
                      <div className="mt-2">
                        <div className="bg-custom-gradient text-detailsBannerTextColor text-sm p-4 border-1 border border-gray-600 text-md text-center font-medium rounded-md">
                          <p>{sideBarOptions.title}</p>
                          <a href={sideBarOptions.buttonUrl}>
                            <Button
                              className="bg-secondary dark:bg-white hover:bg-white hover:text-secondary dark:text-secondary text-white mt-4"
                              size="sm"
                            >
                              {sideBarOptions.buttonText}
                            </Button>
                          </a>
                        </div>
                      </div>
                    )
                  )
                }

                <div>
                  {/* <NavLink
                  key={"/notifications"}
                  to={"/notifications"}
                  className="block hover:bg-activeState dark:hover:bg-activeState dark:hover:text-white p-3 rounded-md no-underline"
                  activeClassName="dark:bg-dark-600 dark:text-white bg-activeState"
                >
                  <div
                    className={`flex items-center gap-x-3 gap-y-1 ${
                      sidebarCollapsed ? "justify-center" : "justify-start"
                    }`}
                  >
                    <div>
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        height="20px"
                        viewBox="0 -960 960 960"
                        width="20px"
                        className="fill-white"
                      >
                        <path d="M160-200v-80h80v-280q0-83 50-147.5T420-792v-28q0-25 17.5-42.5T480-880q25 0 42.5 17.5T540-820v28q80 20 130 84.5T720-560v280h80v80H160Zm320-300Zm0 420q-33 0-56.5-23.5T400-160h160q0 33-23.5 56.5T480-80ZM320-280h320v-280q0-66-47-113t-113-47q-66 0-113 47t-47 113v280Z" />
                      </svg>
                    </div>
                    <p
                      className={`${
                        sidebarCollapsed ? "hidden opacity-0" : "opacity-100"
                      } text-white dark:text-white text-sm font-medium transition-opacity duration-500 opacity-0`}
                    >
                      Notification Settings
                    </p>
                  </div>
                </NavLink> */}

                  <div
                    className={` dark:hover:text-white hidden lg:block `}
                  >
                    <div className={`flex items-center gap-x-3 gap-y-1 ${sidebarCollapsed ? "justify-center" : "justify-end"}`}>
                      <div onClick={() => toggleSidebar()} className={`flex items-center justify-center hover:bg-activeState dark:hover:bg-activeState ${sidebarCollapsed ? 'py-3 px-0 w-full' : 'px-3 py-[0.55rem]'} rounded-md no-underline cursor-pointer`}>
                        <div className={`cursor-pointer ${isSecondIcon ? "rotate-180" : "rotate-0"} items-center  text-sidelayoutTextColor dark:text-white flex`}>
                          <SidebarTogglerIcon />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </nav>
          </div>
        </div>
      </div>

      <Dialog open={logoutDialog} onClose={() => setLogoutDialog(false)}>
        <div className="bg-cleanWhite dark:bg-dark-200 dark:text-white rounded-md flex-col justify-start items-center gap-6 inline-flex">
          <div className="w-[200px]">
            <img
              src={hubSpotUserDetails.hubspotPortals.portalSettings.authPopupFormLogo}
              alt="Light Mode Logo"
              className="h-auto dark:hidden"
            />
            <img
              src={hubSpotUserDetails.hubspotPortals.portalSettings.logo}
              alt="Dark Mode Logo"
              className="h-auto hidden dark:block"
            />
          </div>
          <div className="text-[#2F2E33] dark:text-white text-base font-semibold   leading-snug">
            Log out of your account?
          </div>
          <div className="pt-3 flex gap-x-3 justify-between w-full">
            <Button
              className="dark:text-white"
              onClick={() => setLogoutDialog(false)}
            >
              Keep Me Logged In
            </Button>
            {env.DATA_SOURCE_SET === false ? (
              <Button
                variant="outline"
                className="dark:text-white"
                onClick={() => {
                  if (!isLoading) {
                    logout();
                  }
                }}
                disabled={isLoading}
              >
                {isLoading ? "Logging out..." : "Logout"}
              </Button>
            ) : (
              <a href="/_hcms/mem/logout" className="dark:text-white">
                <Button
                  variant="outline"
                  className="dark:text-white"
                  onClick={() => setLogoutDialog(false)}
                >
                  Logout
                </Button>
              </a>
            )}
          </div>
        </div>
      </Dialog>
    </div>
  );
};

React.memo(Drawer)