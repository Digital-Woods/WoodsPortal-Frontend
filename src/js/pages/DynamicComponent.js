const BackIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    height="24px"
    viewBox="0 -960 960 960"
    width="24px"
    fill="#5f6368"
  >
    <path d="m313-440 224 224-57 56-320-320 320-320 57 56-224 224h487v80H313Z" />
  </svg>
);

const DynamicComponent = ({
  hubspotObjectTypeId,
  path,
  title,
  showIframe,
  propertyName,
  companyAsMediator,
  pipeLineId,
  specPipeLine,
  objectDescription,
}) => {
  hubspotObjectTypeId = hubspotObjectTypeId || getParam("objectTypeId");
  const objectTypeName = getParam("objectTypeName");
  const param = getQueryParamsFromCurrentUrl();
  const [sidebarRightOpen, setSidebarRightOpen] = useState(false);
  const { isLargeScreen, isMediumScreen, isSmallScreen } = useResponsive();
  const [userToggled, setUserToggled] = useState(false);
  const [totalRecord, setTotalRecord] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const { breadcrumbs, setBreadcrumbs } = useBreadcrumb();
  const [tableTitle, setTableTitle] = useState(null);
  const [singularTableTitle, setSingularTableTitle] = useState("");

  let portalId;
  if (env.DATA_SOURCE_SET != true) {
    portalId = getPortal()?.portalId;
  }

  // Sidebar show/hide logic for medium and small devices
  const toggleSidebar = () => {
    setUserToggled(true); // Mark as user-initiated
    setSidebarRightOpen((prev) => !prev);
  };

  // Automatically adjust the sidebar based on screen size
  useEffect(() => {
    if (!userToggled) {
      if (isLargeScreen) {
        setSidebarRightOpen(true); // Always open on large screens
      } else if (isMediumScreen || isSmallScreen) {
        setSidebarRightOpen(false); // Closed by default on smaller screens
      }
    }
  }, [isLargeScreen, isMediumScreen, isSmallScreen, userToggled]);

  // Reset user preference when screen size changes significantly
  useEffect(() => {
    const resetOnResize = () => {
      setUserToggled(false);
    };

    window.addEventListener("resize", resetOnResize);
    return () => window.removeEventListener("resize", resetOnResize);
  }, []);

  useEffect(() => {
    if (breadcrumbs && breadcrumbs.length > 0) {
      const last = breadcrumbs[breadcrumbs.length - 1];
      const previous = breadcrumbs[breadcrumbs.length - 2];
      const singularLastName = last.name.endsWith("s")
        ? last.name.slice(0, -1)
        : last.name;
      setTableTitle(previous?.name ? { last: last, previous: previous} : {last: last})
      setSingularTableTitle(
        previous?.name
          ? `${singularLastName} with ${previous?.name}`
          : singularLastName
      );
    }
  }, [breadcrumbs]);

  const apis = {
    tableAPI: `/api/${hubId}/${portalId}/hubspot-object-data/${hubspotObjectTypeId}${param}`,
    stagesAPI: `/api/${hubId}/${portalId}/hubspot-object-pipelines/${hubspotObjectTypeId}/`, // concat pipelineId
    formAPI: `/api/${hubId}/${portalId}/hubspot-object-forms/${hubspotObjectTypeId}/fields${param}`,
    formDataAPI: `/api/:hubId/:portalId/hubspot-object-data/${hubspotObjectTypeId}/:objectId${
      param ? param + "&isForm=true" : "?isForm=true"
    }`,
    createAPI: `/api/${hubId}/${portalId}/hubspot-object-forms/${hubspotObjectTypeId}/fields${param}`,
    createExistingAPI: `/api/${hubId}/${portalId}/hubspot-object-forms/:fromObjectTypeId/:fromRecordId/associations/:toObjectTypeId${param}`,
    removeExistingAPI: `/api/${hubId}/${portalId}/hubspot-object-forms/:fromObjectTypeId/:fromRecordId/disassociate/:toObjectTypeId${param}`,
    updateAPI: `/api/${hubId}/${portalId}/hubspot-object-forms/${hubspotObjectTypeId}/fields/:formId${param}`, // concat ticketId
  };

  console.log('apis_1', apis)

  // const tableTitle = () => {
  //   return objectTypeName ? objectTypeName : title;
  // };

  const back = () => {
    window.location.hash = `${getParam("parentObjectTypeName")}/${getParam(
      "parentObjectTypeId"
    )}/${getParam("parentObjectRecordId")}`;
  };

  return (
    <div className="bg-sidelayoutColor dark:bg-dark-300">
      <div className="dark:bg-dark-200 mt-[calc(var(--nav-height)-1px)] h-[calc(100vh-var(--nav-height))] overflow-x-auto hide-scrollbar bg-cleanWhite dark:text-white md:pl-4 md:pt-4 md:pr-3 pl-3 pt-3 pr-3">
        <div className="flex relative z-[2] gap-6">
          <div className="flex flex-col gap-2 flex-1">
            {hubSpotUserDetails.sideMenu[0].tabName != title ? (
              <span className="flex-1">
                <ol className="flex dark:text-white flex-wrap">
                  {tableTitle && Object.entries(tableTitle).map(([key, value], index, array) => {
                    return (
                      <li key={key} className="flex items-center">
                        <Link
                          className="text-xl font-semibold text-[#0091AE] capitalize dark:text-white hover:underline"
                          to={value?.path}
                        >
                          {getParamHash(formatCustomObjectLabel(value?.name))}
                        </Link>
                        {index < array.length - 1 && (
                          <span className="mx-1 text-xl font-semibold text-[#0091AE]">
                            associated with
                          </span>
                        )}
                      </li>
                    );
                  })}
                </ol>
                <p className="dark:text-white leading-5 text-sm flex items-center">
                  {!isLoading ? (
                    `${totalRecord} records`
                  ) : (
                    <div className="h-4 w-20 bg-gray-300 dark:bg-white dark:opacity-20 rounded-sm animate-pulse mr-1 mt-1"></div>
                  )}
                </p>
                <pre className="dark:text-white ">
                  {objectDescription
                    ? ReactHtmlParser.default(
                        DOMPurify.sanitize(objectDescription)
                      )
                    : ""}
                </pre>
              </span>
            ) : (
              ""
            )}
          </div>
        </div>

        <div className="flex gap-4 w-full overflow-hidden relative">
          {/* Main content container */}
          {hubSpotUserDetails.sideMenu[0].tabName === title &&
          !isLargeScreen &&
          !sidebarRightOpen ? (
            <div className="rounded-full dark:bg-dark-200 z-[52] absolute right-[10px] top-[10px]">
              <button
                className="rounded-full p-2 dark:bg-cleanWhite bg-sidelayoutColor text-sidelayoutTextColor dark:text-dark-200 animate-pulseEffect dark:animate-pulseEffectDark"
                onClick={toggleSidebar}
              >
                <DetailsIcon />
              </button>
            </div>
          ) : (
            ""
          )}

          <div className="w-full" key={hubspotObjectTypeId}>
            <DashboardTable
              key={hubspotObjectTypeId}
              hubspotObjectTypeId={hubspotObjectTypeId}
              path={path}
              title={title || hubSpotUserDetails.sideMenu[0].label}
              tableTitle={singularTableTitle || hubSpotUserDetails.sideMenu[0].label}
              propertyName={propertyName}
              showIframe={showIframe}
              apis={apis}
              componentName="object"
              companyAsMediator={companyAsMediator}
              pipeLineId={pipeLineId}
              specPipeLine={specPipeLine}
              setTotalRecord={setTotalRecord}
              setIsLoading={setIsLoading}
            />
          </div>
        </div>
      </div>
    </div>
  );
};
