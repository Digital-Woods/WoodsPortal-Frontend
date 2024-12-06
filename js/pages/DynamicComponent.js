const BackIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#5f6368"><path d="m313-440 224 224-57 56-320-320 320-320 57 56-224 224h487v80H313Z" /></svg>
);

const DynamicComponent = ({ hubspotObjectTypeId, path, title, showIframe, propertyName }) => {
  hubspotObjectTypeId = hubspotObjectTypeId || getParam("objectTypeId")
  const [inputValue, setInputValue] = useState("");
  const [activeTab, setActiveTab] = useState("account");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  // const [param, setParam] = useState("");

  const mediatorObjectTypeId = getParam("mediatorObjectTypeId")
  const mediatorObjectRecordId = getParam("mediatorObjectRecordId")
  // const param = mediatorObjectTypeId && mediatorObjectRecordId ? `?mediatorObjectTypeId=${mediatorObjectTypeId}&mediatorObjectRecordId=${mediatorObjectRecordId}` : ''
  const param = getQueryParamsFromCurrentUrl()

  // useEffect(() => {
  //   const queryParamsFromCurrentUrl = getQueryParamsFromCurrentUrl()
  //   console.log('queryParamsFromCurrentUrl', queryParamsFromCurrentUrl)
  //   if (queryParamsFromCurrentUrl) {
  //     setParam(queryParamsFromCurrentUrl)
  //   }
  // }, [getQueryParamsFromCurrentUrl()]);

  let portalId;
  if (env.DATA_SOURCE_SET != true) {
    portalId = getPortal().portalId
  }

  const apis = {
    tableAPI: `/api/${hubId}/${portalId}/hubspot-object-data/${hubspotObjectTypeId}${param}`,
    stagesAPI: `/api/${hubId}/${portalId}/hubspot-object-pipelines/${hubspotObjectTypeId}/`, // concat pipelineId
    formAPI: `/api/${hubId}/${portalId}/hubspot-object-forms/${hubspotObjectTypeId}/fields`,
    formDataAPI: `/api/:hubId/:portalId/hubspot-object-data/${hubspotObjectTypeId}/:objectId${param ? param + '&isForm=true' : '?isForm=true'}`,
    createAPI: `/api/${hubId}/${portalId}/hubspot-object-forms/${hubspotObjectTypeId}/fields${param}`,
    updateAPI: `/api/${hubId}/${portalId}/hubspot-object-forms/${hubspotObjectTypeId}/fields/:formId${param}` // concat ticketId
  }

  const handleInputChange = (event) => {
    setInputValue(event.target.value);
  };

  const viewText =
    (activeTab === "account"
      ? `List of ${title}`
      : `List of ${title}`
    )
      .charAt(0)
      .toUpperCase() +
    (activeTab === "account"
      ? `List of ${title}`
      : `List of ${title}`
    )
      .slice(1)
      .toLowerCase();

  const objectTypeName = getParam("objectTypeName")
  const tableTitle = () => {
    return objectTypeName ? objectTypeName : title
  }

  const back = () => {
    window.location.hash = `${getParam("parentObjectTypeName")}/${getParam("parentObjectTypeId")}/${getParam("parentObjectRowId")}`;
  }
  const { isLargeScreen, isMediumScreen, isSmallScreen } = useResponsive();

  useEffect(() => {
    if (isLargeScreen) setSidebarOpen(false);
  }, [isLargeScreen]);


  return (
    <div className="bg-sidelayoutColor dark:bg-dark-300">
      <div className={`dark:bg-dark-200 rounded-tl-xl bg-cleanWhite dark:text-white md:pl-6 md:pt-6 
      ${isLargeScreen
          ? " "
          : `${!sidebarOpen ? 'md:pr-6 pr-3  pl-3  pt-3' : 'pl-3 pt-3'} rounded-tr-xl`
        }
      relative`}>
        <div class={`h-12 bg-gradient-to-b rounded-tl-xl from-cleanWhite dark:from-dark-200 to-cleanWhite/0 absolute top-0 left-0 right-0 z-[1]
                ${isLargeScreen
            ? " "
            : "md:pr-6 pr-3 rounded-tr-xl"
          }
          `}></div>
        <div className="flex justify-between items-center relative gap-6">
          <div className="flex items-start flex-col gap-2">
            {objectTypeName &&
              <div className="pr-2 cursor-pointer" onClick={() => back()}>
                <BackIcon />
              </div>
            }
            {hubSpotUserDetails.sideMenu[0].tabName != title ?
              <span>
                <span className="text-xl font-semibold text-[#0091AE] capitalize dark:text-white">
                  {tableTitle()}
                </span>
                <p className="text-primary  dark:text-white leading-5 text-sm">
                  {env.DATA_SOURCE_SET !== true ? viewText : viewText + 's'}
                </p>
              </span> : ''}
          </div>

          {/* <div className="centered-tab border rounded-lg p-1 bg-cleanWhite dark:bg-dark-300 border-flatGray dark:border-gray-700 ">
          <Tabs
            activeTab={activeTab}
            setActiveTab={setActiveTab}
            className="rounded-md "
          >
            <TabsList>
              <TabsTrigger value="account">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  height="18px"
                  viewBox="0 -960 960 960"
                  width="18px"
                  fill="currentcolor"
                  className="dark:fill-white"
                >
                  <path d="M280-600v-80h560v80H280Zm0 160v-80h560v80H280Zm0 160v-80h560v80H280ZM160-600q-17 0-28.5-11.5T120-640q0-17 11.5-28.5T160-680q17 0 28.5 11.5T200-640q0 17-11.5 28.5T160-600Zm0 160q-17 0-28.5-11.5T120-480q0-17 11.5-28.5T160-520q17 0 28.5 11.5T200-480q0 17-11.5 28.5T160-440Zm0 160q-17 0-28.5-11.5T120-320q0-17 11.5-28.5T160-360q17 0 28.5 11.5T200-320q0 17-11.5 28.5T160-280Z" />
                </svg>
              </TabsTrigger>
              <TabsTrigger value="password">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  height="18px"
                  viewBox="0 -960 960 960"
                  width="18px"
                  fill="currentcolor"
                  className="dark:fill-white"
                >
                  <path d="m600-120-240-84-186 72q-20 8-37-4.5T120-170v-560q0-13 7.5-23t20.5-15l212-72 240 84 186-72q20-8 37 4.5t17 33.5v560q0 13-7.5 23T812-192l-212 72Zm-40-98v-468l-160-56v468l160 56Zm80 0 120-40v-474l-120 46v468Zm-440-10 120-46v-468l-120 40v474Zm440-458v468-468Zm-320-56v468-468Z" />
                </svg>
              </TabsTrigger>
            </TabsList>
            <TabsContent value="account"></TabsContent>
            <TabsContent value="password"></TabsContent>
          </Tabs>
        </div> */}

          {/* <div>
          <Button className="text-white">
            New Site <span className="ml-2"> + </span>{" "}
          </Button>
        </div> */}
        </div>

        {activeTab === "account" ? (
          <div className="flex gap-4 w-full overflow-hidden relative">
            {/* Main content container */}
            {hubSpotUserDetails.sideMenu[0].tabName === title &&
              !isLargeScreen &&
              !sidebarOpen ? (
              <div className="rounded-full dark:bg-dark-200 z-[52] absolute right-[10px] top-[10px]">
                <button
                  className="rounded-full p-2 dark:bg-cleanWhite bg-sidelayoutColor text-sidelayoutTextColor dark:text-dark-200 animate-pulseEffect dark:animate-pulseEffectDark"
                  onClick={() => setSidebarOpen(true)}
                >
                  <svg
                    viewBox="0 0 64 64"
                    fill="currentColor"
                    height="1.5em"
                    width="1.5em"
                  >
                    <path
                      fill="none"
                      stroke="currentColor"
                      strokeMiterlimit={20}
                      strokeWidth={3}
                      d="M0 21h6M16 21h48M0 33h6M16 33h48M0 45h6M16 45h48"
                    />
                  </svg>
                </button>
              </div>
            ) : (
              ""
            )}

            <div
              className={`lg:max-h-[calc(100vh-82px)] max-h-[calc(100vh-110px)] hide-scrollbar overflow-y-auto  ${showSidebarListDataOption &&
                hubSpotUserDetails.sideMenu[0].tabName === title
                ? isLargeScreen
                  ? "w-[calc(100%_-350px)]"
                  : "w-full"
                : "w-full lg:pr-6 pr-0"
                }`}
            >
              {hubSpotUserDetails.sideMenu[0].tabName === title && (
                <div>
                  <HomeBanner moduleBannerDetailsOption={moduleBannerDetailsOption} />
                </div>
              )}

              <DashboardTable
                hubspotObjectTypeId={hubspotObjectTypeId}
                path={path}
                title={tableTitle() || hubSpotUserDetails.sideMenu[0].label}
                propertyName={propertyName}
                showIframe={showIframe}
                apis={apis}
                editView={true}
              />
            </div>

            {/* Sidebar container */}
            {showSidebarListDataOption &&
              hubSpotUserDetails.sideMenu[0].tabName === title && (
                <div
                  className={`${isLargeScreen
                    ? "relative translate-x-0"
                    : "absolute translate-x-full md:w-[365px] w-screen md:p-3 px-2 pb-2 z-50"
                    } inset-y-0 bg-cleanWhite dark:bg-dark-200 right-0 transform transition duration-200 ease-in-out ${sidebarOpen ? "translate-x-0 pt-2" : "translate-x-full"
                    }`}
                >
                  {!isLargeScreen && sidebarOpen ?
                    <div className=" rounded-full dark:bg-dark-200 z-50 absolute right-[15px] top-[16px]">
                      <button className='rounded-full p-2 dark:bg-cleanWhite bg-sidelayoutColor text-sidelayoutTextColor dark:text-dark-200 animate-pulseEffect dark:animate-pulseEffectDark' onClick={() => setSidebarOpen(false)}>
                        <svg
                          viewBox="0 0 1024 1024"
                          fill="currentColor"
                          height="1em"
                          width="1em"
                        >
                          <path d="M869 487.8L491.2 159.9c-2.9-2.5-6.6-3.9-10.5-3.9h-88.5c-7.4 0-10.8 9.2-5.2 14l350.2 304H152c-4.4 0-8 3.6-8 8v60c0 4.4 3.6 8 8 8h585.1L386.9 854c-5.6 4.9-2.2 14 5.2 14h91.5c1.9 0 3.8-.7 5.2-2L869 536.2a32.07 32.07 0 000-48.4z" />
                        </svg>
                      </button>
                    </div>
                    : ''
                  }
                  <div className={`${!isSmallScreen ? 'w-[350px]  pr-3' : 'w-full'} lg:max-h-[calc(100vh-82px)]  max-h-[calc(100vh-110px)] hide-scrollbar overflow-y-auto`}>
                    <div className="flex-col flex lg:gap-6 gap-3">
                      {sidebarListDataOption.map((option, index) => {
                        const hubspotObjectTypeId = option.hubspotObjectTypeId;
                        const sidebarDataApis = {
                          tableAPI: `/api/${hubId}/${portalId}/hubspot-object-data/${hubspotObjectTypeId}${param}`,
                          stagesAPI: `/api/${hubId}/${portalId}/hubspot-object-pipelines/${hubspotObjectTypeId}/`, // concat pipelineId
                          formAPI: `/api/${hubId}/${portalId}/hubspot-object-forms/${hubspotObjectTypeId}/fields`,
                          formDataAPI: `/api/:hubId/:portalId/hubspot-object-data/${hubspotObjectTypeId}/:objectId${param ? param + "&isForm=true" : "?isForm=true"
                            }`,
                          createAPI: `/api/${hubId}/${portalId}/hubspot-object-forms/${hubspotObjectTypeId}/fields${param}`,
                          updateAPI: `/api/${hubId}/${portalId}/hubspot-object-forms/${hubspotObjectTypeId}/fields/:formId${param}`, // concat ticketId
                        };

                        return index === 0 ? (
                          <SidebarData
                            key={index}
                            hubspotObjectTypeId={hubspotObjectTypeId}
                            path={`/${formatPath(option.label)}`}
                            title={option.label}
                            apis={sidebarDataApis}
                            companyAsMediator={option.companyAsMediator}
                            pipeLineId={option.pipeLineId}
                            specPipeLine={option.specPipeLine}
                          />
                        ) : (
                          <SidebarTable
                            key={index}
                            hubspotObjectTypeId={hubspotObjectTypeId}
                            path={`/${formatPath(option.label)}`}
                            title={option.label}
                            apis={sidebarDataApis}
                            companyAsMediator={option.companyAsMediator}
                            pipeLineId={option.pipeLineId}
                            specPipeLine={option.specPipeLine}
                          />
                        );
                      })}
                    </div>
                  </div>
                </div>
              )}
          </div>

        ) : (
          <div className="dark:text-white text-cleanWhite">
            Under Construction
          </div>
        )}
      </div>
    </div>
  );
};
