const defaultSvg = `
<svg viewBox="0 0 512 512" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" fill="#FFFFFF">
  <g id="SVGRepo_bgCarrier" stroke-width="0"></g>
  <g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g>
  <g id="SVGRepo_iconCarrier">
    <title>circle-dot</title>
    <g id="Page-1" stroke="none" stroke-width="1" fill="none" fill-rule="evenodd">
      <g id="drop" fill="#FFFFFF" transform="translate(42.666667, 42.666667)">
        <path d="M213.333333,3.55271368e-14 C331.15408,3.55271368e-14 426.666667,95.5125867 426.666667,213.333333 C426.666667,331.15408 331.15408,426.666667 213.333333,426.666667 C95.5125867,426.666667 3.55271368e-14,331.15408 3.55271368e-14,213.333333 C3.55271368e-14,95.5125867 95.5125867,3.55271368e-14 213.333333,3.55271368e-14 Z M213.333333,42.6666667 C119.076736,42.6666667 42.6666667,119.076736 42.6666667,213.333333 C42.6666667,307.589931 119.076736,384 213.333333,384 C307.589931,384 384,307.589931 384,213.333333 C384,119.076736 307.589931,42.6666667 213.333333,42.6666667 Z M213.333333,106.666667 C272.243707,106.666667 320,154.42296 320,213.333333 C320,272.243707 272.243707,320 213.333333,320 C154.42296,320 106.666667,272.243707 106.666667,213.333333 C106.666667,154.42296 154.42296,106.666667 213.333333,106.666667 Z" id="Combined-Shape"></path>
      </g>
    </g>
  </g>
</svg>
`;

const noRouteSvg = `<svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#e8eaed"><path d="M480-280q17 0 28.5-11.5T520-320q0-17-11.5-28.5T480-360q-17 0-28.5 11.5T440-320q0 17 11.5 28.5T480-280Zm-40-160h80v-240h-80v240Zm40 360q-83 0-156-31.5T197-197q-54-54-85.5-127T80-480q0-83 31.5-156T197-763q54-54 127-85.5T480-880q83 0 156 31.5T763-763q54 54 85.5 127T880-480q0 83-31.5 156T763-197q-54 54-127 85.5T480-80Zm0-80q134 0 227-93t93-227q0-134-93-227t-227-93q-134 0-227 93t-93 227q0 134 93 227t227 93Zm0-320Z"/></svg>`;

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
  const [logoutDialog, setLogoutDialog] = Recoil.useRecoilState(logoutDialogState);
  const { sidebarCollapsed, setSidebarCollapsed } = useCollapsible();
  const [isSecondIcon, setIsSecondIcon] = useState(false);
  const { sidebarOpen, setSidebarOpen } = useCollapsible();
  const { me } = useMe();
  const { logout, isLoading, error } = useLogout();
  const { routes, setRoutes } = useRoute();
  const customPath = useDynamicPathname();

  const [activeRoute, setActiveRoute] = useState("");
  const [sideBarOptions, setSideBarOptions] = useState({});
  const [brandName, setBrandName] = useState(hubSpotUserDetails.hubspotPortals.portalSettings.brandName);

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

  const mutation = useMutation({
    mutationFn: (data) => HttpClient.post(API_ENDPOINTS.USER_LOGOUT, data),
    onSuccess: () => {
      setLogoutDialog(false);
      window.location.href = "/login";
    },
    onError: (error) => {
      console.error("Logout failed", error);
    },
  });
  useEffect(() => {
    setSideBarOptions(hubSpotUserDetails.sideBarOptions);
  })

  return (
    <div>
      {sidebarOpen && (
        <div className="relative z-[10]">
          <div
            className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity lg:hidden"
            aria-hidden="true"
            onClick={() => setSidebarOpen(false)}
          ></div>
        </div>
      )}
      <div className={className}>
        <div
          className={`h-[100vh] z-50 sidebar bg-sidelayoutColor dark:bg-dark-300 lg:relative lg:translate-x-0 absolute inset-y-0 left-0 transform transition duration-200 ease-in-out ${sidebarOpen ? "translate-x-0" : "-translate-x-full"
            }
        ${sidebarCollapsed ? "p-3" : "p-4"}
        `}
        >
          <div className="h-full flex flex-col">
            <div className="flex justify-between items-center mb-8 h-[50px]">
              <div className={`flex ${showCompanyNameOption === true ? 'flex-row items-center' : 'flex-col'} gap-2`}>

                {showSamllLogoOption ?
                  <div className="w-[50px]">
                    <img src={hubSpotUserDetails.hubspotPortals.portalSettings.smallLogo} alt="Logo" className={`h-auto `} />
                  </div> :
                  <div className={`mr-2 ${showCompanyNameOption === true ? 'w-[50px]' : 'w-full max-h-[70px]'}`}>
                    <Logo />
                  </div>}

                {showCompanyNameOption === true ? <h1
                  className={`text-lg font-semibold pr-4 pl-1 break-all text-sidelayoutTextColor dark:text-white ${sidebarCollapsed ? "hidden" : "block"
                    }`}
                >
                  {shouldShowTooltip ? (
                    <Tooltip content={brandName} right>
                      {brandName.slice(0, 15)}
                      {brandName.length > 15 ? "..." : ""}
                    </Tooltip>
                  ) : (
                    brandName
                  )}
                </h1> : ''}

              </div>
              <div
                className="cursor-pointer  items-center max-lg:hidden flex"
                onClick={toggleSidebar}
              >
                {isSecondIcon ? (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    height="20px"
                    viewBox="0 -960 960 960"
                    width="20px"
                    className="fill-sidelayoutTextColor dark:fill-white"
                  >
                    <path d="M383-480 200-664l56-56 240 240-240 240-56-56 183-184Zm264 0L464-664l56-56 240 240-240 240-56-56 183-184Z" />
                  </svg>
                ) : (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    height="20px"
                    viewBox="0 -960 960 960"
                    width="20px"
                    className="fill-sidelayoutTextColor dark:fill-white"
                  >
                    <path d="M440-240 200-480l240-240 56 56-183 184 183 184-56 56Zm264 0L464-480l240-240 56 56-183 184 183 184-56 56Z" />
                  </svg>
                )}
              </div>
              <div
                className=" rounded-lg cursor-pointer  bg-gray-600 px-2 py-1 lg:hidden"
                onClick={() => setSidebarOpen(false)}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  height="20px"
                  viewBox="0 -960 960 960"
                  width="20px"
                  className="fill-sidelayoutTextColor"
                >
                  <path d="m291-240-51-51 189-189-189-189 51-51 189 189 189-189 51 51-189 189 189 189-51 51-189-189-189 189Z" />
                </svg>
              </div>
            </div>
            <nav className="space-y-1 flex-1">
              <div className=" flex flex-col h-full justify-between ">
                <div>
                  {(routes.length > 0 && activeRoute) &&
                    routes.map(({ path, title, icon }) => (
                      <NavLink
                        key={path}
                        to={path}
                        className={`block hover:bg-activeState dark:hover:bg-activeState dark:hover:text-white p-3 rounded-md no-underline ${activeRoute === path ? "bg-activeState" : ""
                          }`}
                        onClick={() => setActiveRoute(path)}
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
                      </NavLink>
                    ))}
                </div>
                {
                  showSidebarCtaOption === true && (
                    !sidebarCollapsed && (
                      <div>
                        <div className="bg-custom-gradient text-detailsBannerTextColor p-10 text-md text-center font-medium rounded-md">
                          <p>{sideBarOptions.title}</p>
                          <a href={sideBarOptions.buttonUrl}>
                            <Button
                              className="bg-detailsBannerTextColor dark:bg-white hover:bg-white text-blue-important mt-8"
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
                    className="block hover:bg-activeState dark:hover:bg-activeState dark:hover:text-white  p-3 rounded-md no-underline cursor-pointer"
                    onClick={() => setLogoutDialog(true)}
                  >
                    <div
                      className={`flex items-center gap-x-3 gap-y-1 ${sidebarCollapsed ? "justify-center" : "justify-start"
                        }`}
                    >
                      <div>
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          height="20px"
                          viewBox="0 -960 960 960"
                          width="20px"
                          className="fill-sidelayoutTextColor"
                        >
                          <path d="M200-120q-33 0-56.5-23.5T120-200v-560q0-33 23.5-56.5T200-840h280v80H200v560h280v80H200Zm440-160-55-58 102-102H360v-80h327L585-622l55-58 200 200-200 200Z" />
                        </svg>
                      </div>
                      <p
                        className={`${sidebarCollapsed ? "hidden" : ""
                          } text-sidelayoutTextColor dark:text-white text-sm font-medium `}
                      >
                        Logout
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </nav>
          </div>
        </div>
      </div>

      <Dialog open={logoutDialog} onClose={() => setLogoutDialog(false)}>
        <div className="bg-cleanWhite dark:bg-dark-100 dark:text-white rounded-md flex-col justify-start items-center gap-6 inline-flex">
          <div className="">
            <div className="w-[50px]">
              <img src={hubSpotUserDetails.hubspotPortals.portalSettings.smallLogo} alt="Logo" className={`h-auto `} />
            </div>
          </div>

          <div className="flex-col justify-start items-start gap-1 flex">
            <div className="text-[#2F2E33] dark:text-white text-base font-semibold   leading-snug">
              Log out of your account?
            </div>
          </div>
          <div className="pt-3 sm:flex sm:flex-row-reverse gap-x-3 justify-between w-full">
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
