import { DetailsGallery } from "@/components/Details/DetailsGallery";
import { getRouteMenuConfig, setRouteMenuConfig, getPortal } from "@/data/client/auth-utils";
import { hubId } from "@/data/hubSpotData";
import { getQueryParamsFromCurrentUrl } from "@/utils/param";
import { useResponsive } from "@/utils/UseResponsive";
import { env } from "@/env";
import { useState, useEffect } from "react";
import { Dialog } from "../Dialog";
import { Files } from "../files/Files";
import { DetailsSkeleton } from "../skeletons/DetailsSkeleton";
import { DynamicComponentView } from "../Table/DynamicComponentView";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "../Tabs";
import { homeTabsDataTypeFilter } from "@/data/hubSpotData";
import { Notes } from "../Notes";

export const UserDetails = ({ path, objectId, id, userPermissions, isLoading, isLoadedFirstTime, userCompanyId }: any) => {
    const [item, setItems] = useState<any>([]);
    const [images, setImages] = useState<any>([]);
    // const [sortItems, setSortItems] = useState<any>([]);
    // const [associations, setAssociations] = useState<any>({});
    // const { me } = useMe();
    const [configurations, setConfigurations] = useState<any>({
        fileManager: false,
        note: false,
        ticket: false
    });
    // const param = getParam("t");
    const param = getQueryParamsFromCurrentUrl();
    const [activeTab, setActiveTab] = useState<any>("files");
    const [permissions, setPermissions] = useState<any>(userPermissions);
    const urlParam = getQueryParamsFromCurrentUrl();
    const [galleryDialog, setGalleryDialog] = useState<any>(false);
    // const { sync, setSync } = useSync();
    const [sidebarDetailsOpen, setSidebarDetailsOpen] = useState<any>(false);
    const { isLargeScreen } = useResponsive();
    const [userToggled, setUserToggled] = useState<any>(false); // Track user interaction
    const [totalRecord, setTotalRecord] = useState<any>(0);

    // Automatically adjust the sidebar based on screen size
    const getInitialFilter = (type: any) => {
        console.log("homeTabsDataTypeFilter", homeTabsDataTypeFilter)
    return homeTabsDataTypeFilter[type] === 'contact' ? '0-1' : 
            homeTabsDataTypeFilter[type] === 'company' ? '0-2' : 
            '0-1';
    };

    const [selectedFileDataFilter, setSelectedFileDataFilter] = useState(() => getInitialFilter('files'));
    const [selectedNotesDataFilter, setSelectedNotesDataFilter] = useState(() => getInitialFilter('notes'));
    const [selectedTicketsDataFilter, setSelectedTicketsDataFilter] = useState(() => getInitialFilter('tickets'));

    const userDataFilter = [
        { label: 'Owned by organization', value: '0-2' },
        { label: 'Owned by me', value: '0-1' },
    ];

    const FilterDropdown = ({ 
    value, 
    onChange, 
    className = "w-[200px] rounded-md bg-cleanWhite px-2 text-sm transition-colors border-2 dark:border-gray-600 focus:ring-0 focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50 dark:bg-gray-700 dark:text-gray-200 dark:placeholder-gray-400 py-2"
    }: any) => (
        <select
            className={className}
            value={value}
            onChange={(e) => onChange(e.target?.value || "")}
        >
            {userDataFilter.map((filter) => (
            <option key={filter.value} value={filter.value}>
                {filter.label}
            </option>
            ))}
        </select>
    );

    useEffect(() => {
        if (!userToggled) {
            setSidebarDetailsOpen(isLargeScreen);
        }
    }, [isLargeScreen, userToggled]);

    // Function to toggle sidebar manually
    const toggleSidebar = () => {
        setUserToggled(true); // Mark as user-initiated
        setSidebarDetailsOpen((prev: any) => !prev);
    };

    // Reset user preference when screen size changes significantly
    useEffect(() => {
        const resetOnResize = () => {
            setUserToggled(false);
        };

        window.addEventListener("resize", resetOnResize);
        return () => window.removeEventListener("resize", resetOnResize);
    }, []);

    useEffect(() => {
        setConfigurations(userPermissions);
        setPermissions(userPermissions);
    }, [userPermissions]);

    const setActiveTabFucntion = (active: any) => {
        // setParam("t", active);
        setActiveTab(active);

        const routeMenuConfig = {
            key: 'home',
            details: {
                activeTab: active
            },
        };
        setSelectRouteMenuConfig(routeMenuConfig);
    };

    // Start Cookie RouteMenuConfig
    const setSelectRouteMenuConfig = (routeMenuConfig: any) => {
        let routeMenuConfigs = getRouteMenuConfig() || {};
        const { key, details } = routeMenuConfig;
        routeMenuConfigs[key] = { ...routeMenuConfigs[key], details };
        setRouteMenuConfig(routeMenuConfigs);
    };

    useEffect(() => {
        let routeMenuConfigs = getRouteMenuConfig();

        if (
            routeMenuConfigs &&
            routeMenuConfigs.hasOwnProperty('home')
        ) {
            const activeTab = routeMenuConfigs.home?.details?.activeTab;
            setActiveTabFucntion(activeTab || "files")
        } else {
            setActiveTabFucntion("files")
        }
    }, []);

    let portalId;
    if (env.VITE_DATA_SOURCE_SET != true) {
        portalId = getPortal()?.portalId;
    }


    const apis = {
        tableAPI: `/api/${hubId}/${portalId}/hubspot-object-data/${env.VITE_HUBSPOT_DEFAULT_OBJECT_IDS.tickets}${param}`,
        stagesAPI: `/api/${hubId}/${portalId}/hubspot-object-pipelines/${env.VITE_HUBSPOT_DEFAULT_OBJECT_IDS.tickets}/`, // concat pipelineId
        formAPI: `/api/${hubId}/${portalId}/hubspot-object-forms/${env.VITE_HUBSPOT_DEFAULT_OBJECT_IDS.tickets}/fields${param ? param + `&parentObjectTypeId=${selectedTicketsDataFilter}` : `?parentObjectTypeId=${selectedTicketsDataFilter}`
            }`,
        formDataAPI: `/api/:hubId/:portalId/hubspot-object-data/${env.VITE_HUBSPOT_DEFAULT_OBJECT_IDS.tickets}/:objectId${param ? param + "&isForm=true" : "?isForm=true"
            }`,
        createAPI: `/api/${hubId}/${portalId}/hubspot-object-forms/${env.VITE_HUBSPOT_DEFAULT_OBJECT_IDS.tickets}/fields${param}`,
        createExistingAPI: `/api/${hubId}/${portalId}/hubspot-object-forms/:fromObjectTypeId/:fromRecordId/associations/:toObjectTypeId${param}`,
        removeExistingAPI: `/api/${hubId}/${portalId}/hubspot-object-forms/:fromObjectTypeId/:fromRecordId/disassociate/:toObjectTypeId${param}`,
        updateAPI: `/api/${hubId}/${portalId}/hubspot-object-forms/${env.VITE_HUBSPOT_DEFAULT_OBJECT_IDS.tickets}/fields/:formId${param}`, // concat ticketId
    };

    if (!isLoadedFirstTime) {
        return (
            <div className={`dark:bg-dark-200 w-[100%] rounded-tl-xl hide-scrollbar overflow-hidden `}
            >
                <div className="h-[calc(100vh_-136px)]">
                    <div className="mt-4">
                        <DetailsSkeleton header={false} tabs={3} active={'file'} />
                    </div>
                </div>
            </div>
        );
    }
    return (
        <div className={`dark:bg-dark-200 w-[100%] rounded-tl-xl hide-scrollbar overflow-hidden `}
        >
            <div className=" flex relative bg-cleanWhite  dark:bg-dark-200 overflow-hidden">

                {/* main content code start */}
                <div className={`w-full hide-scrollbar overflow-y-auto overflow-x-hidden`}>
                    <div className={``}>
                        <div className={`flex md:flex-row flex-col md:items-center justify-between my-4 gap-3`}>
                        <div className="border rounded-lg dark:border-none bg-graySecondary  dark:bg-dark-300 border-flatGray w-fit">
                            <Tabs
                                activeTab={activeTab}
                                setActiveTab={setActiveTabFucntion}
                                className="rounded-md"
                            >
                                <TabsList>
                                    {permissions && permissions?.fileManager?.display && (
                                        <TabsTrigger className="rounded-md" value="files">
                                            <p className="text-black dark:text-white">Files</p>
                                        </TabsTrigger>
                                    )}
                                    {permissions && permissions?.note?.display && (
                                        <TabsTrigger className="rounded-md" value="notes">
                                            <p className="text-black dark:text-white">Notes</p>
                                        </TabsTrigger>
                                    )}
                                    {permissions && permissions?.ticket?.display && (
                                        <TabsTrigger className="rounded-md" value="tickets">
                                            <p className="text-black dark:text-white">{permissions?.ticket?.display_label ? permissions?.ticket?.display_label : 'Tickets'}
                                                {totalRecord > 0 && (
                                                    <span className="ml-2 px-2 py-1 rounded-md bg-secondary dark:bg-white dark:text-dark-300 text-white text-xs">
                                                        {totalRecord}
                                                    </span>
                                                )}
                                            </p>
                                        </TabsTrigger>
                                    )}
                                    {/* <TabsTrigger className="rounded-md" value="photos">
  <p className="text-black dark:text-white">Photos</p>
</TabsTrigger> */}
                                </TabsList>

                                <TabsContent value="overview"></TabsContent>
                                <TabsContent value="files"></TabsContent>
                                <TabsContent value="notes">{/* <Notes /> */}</TabsContent>
                                {/* <TabsContent value="photos"></TabsContent> */}
                            </Tabs>
                             </div>
                            {activeTab === "files" && homeTabsDataTypeFilter.files === 'all' && (
                                <FilterDropdown 
                                value={selectedFileDataFilter} 
                                onChange={setSelectedFileDataFilter} 
                                />
                            )}

                            {activeTab === "notes" && homeTabsDataTypeFilter.notes === 'all' && objectId && id && (
                                <FilterDropdown 
                                value={selectedNotesDataFilter} 
                                onChange={setSelectedNotesDataFilter} 
                                />
                            )}

                            {activeTab === "tickets" && homeTabsDataTypeFilter.tickets === 'all' && (
                                <FilterDropdown 
                                value={selectedTicketsDataFilter} 
                                onChange={setSelectedTicketsDataFilter} 
                                />
                            )}
                        </div>

                        {/* {(path === "/sites" || path === "/assets") && <DetailsMapsCard />} */}

                        {/* {path === "/jobs" && (
<div className="col-span-4">
<DetailsTable item={item} path={path} />
</div>
)} */}
                        {/* {sortItems && activeTab === "overview" && (
<DetailsView item={item} sortItems={sortItems} />
)} */}

                        {activeTab === "files" && (
                            <Files tabName='home' fileId={selectedFileDataFilter == '0-2' ? userCompanyId : id} path={path} objectId={selectedFileDataFilter} id={selectedFileDataFilter == '0-2' ? userCompanyId : id} permissions={permissions ? permissions.fileManager : null} />
                        )}

                        {activeTab === "notes" && objectId && id && (
                            <Notes tabName='home' item={item} path={path} objectId={selectedNotesDataFilter} id={selectedNotesDataFilter == '0-2' ? userCompanyId : id} permissions={permissions ? permissions.note : null} />
                        )}

                        {activeTab === "tickets" && (
                            // <Tickets
                            //     path={path}
                            //     objectId={objectId}
                            //     id={id}
                            //     parentObjectTypeId={objectId}
                            //     parentObjectRowId={id}
                            //     permissions={permissions ? permissions.ticket : null}
                            //     companyAsMediator={false}
                            //     profileTicket={true}
                            // />

                            <DynamicComponentView
                                hubspotObjectTypeId={'0-5'}
                                path={path}
                                title={permissions?.ticket?.display_label || "Tickets"}
                                ticketTableTitle={permissions?.ticket?.display_label || "Tickets"}
                                apis={apis}
                                componentName="ticket"
                                defPermissions={permissions ? permissions.ticket : null}
                                editView={true}
                                setTotalRecord={setTotalRecord}
                                isShowTitle={false}
                                isHome={true}
                                companyAsMediator={selectedTicketsDataFilter == '0-2' ? true : false}
                            />
                        )}

                        {images.length > 0 && activeTab === "photos" && (
                            <DetailsGallery
                                images={images}
                                setGalleryDialog={setGalleryDialog}
                            />
                        )}
                    </div>
                </div>
                {/* main content code end */}

                <Dialog
                    open={galleryDialog}
                    onClose={setGalleryDialog}
                    className="w-[50%]"
                >
                    <div className=" bg-cleanWhite dark:bg-dark-200 dark:text-white rounded-md flex-col justify-start items-center gap-6 inline-flex">
                        <div className="grid grid-cols-2 gap-4">
                            {images.map((url: any, index: any) => (
                                <img
                                    key={index}
                                    src={url}
                                    alt={`Image ${index + 1}`}
                                    className="w-full h-auto"
                                />
                            ))}
                        </div>
                    </div>
                </Dialog>
            </div>
        </div>
    );
};