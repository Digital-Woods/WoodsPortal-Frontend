import { useState, useEffect } from 'react';
import { env } from "@/env";
import { hubSpotUserDetails } from '@/data/hubSpotData'
import { Button } from '@/components/ui/Button'
import { Tooltip } from '@/components/ui/Tooltip'
import { SearchIcon } from '@/assets/icons/SearchIcon'
import { EnterIcon } from '@/assets/icons/EnterIcon'
import { IconPlus } from '@/assets/icons/IconPlus'
import { Input } from '@/components/ui/Form'
import { recorBtnCustom } from '@/data/hubSpotData'
import { useTable } from '@/state/use-table';
import { useAuth } from '@/state/use-auth';
import { getFormTitle, useUpdateLink } from '@/utils/GenerateUrl';

export const DashboardTableHeader = ({
  title = "",
  componentName,
  permissions,
  hubspotObjectTypeId,
  // activePipeline,
  setActiveTab,
  // search,
  handelChangePipeline,
  pipelines,
  // setSearchTerm,
  // setCurrentPage,
  // setItemsPerPage,
  handleSearch,
  setShowAddDialog,
  // pageLimit,
  defPermissions,
  specPipeLine,
  isHome
}: any) => {
  const pageLimit = env.VITE_TABLE_PAGE_LIMIT;
  const {
    view,
    search,
    setSearch,
    selectedPipeline,
    setSelectedPipeline,
    setPage,
    setLimit,
    // permissions
  } = useTable();

  const { objectName, dialogTitle } = getFormTitle(componentName, title, "addNew");

  const {filterParams} = useUpdateLink();

  useEffect(() => {
    setSearch(filterParams()?.search || "");
  }, []);

  const { subscriptionType }: any = useAuth();

  const [showPipelineFilter, setShowPippelineFilter] = useState(false);

  useEffect(() => {
    if (!defPermissions?.pipeline_id) setShowPippelineFilter(pipelines?.length > 0 ? true : false);
  }, [pipelines]);

  const handelPipeline = async (value: any) => {
    await setPage(subscriptionType === 'FREE' ? '' : 1);
    await setLimit(pageLimit);
    await setSelectedPipeline(isHome ? 'home' : hubspotObjectTypeId, pipelines, value);
    await handelChangePipeline(value);
  };

  // useEffect(() => {
    // if (!view) setActiveTab("LIST");
  // }, [view]);

  return (
    <div className="flex justify-between mb-6 md:items-center max-sm:flex-col-reverse max-sm:items-end gap-2">
      <div className="flex gap-2 justify-between max-sm:flex-col-reverse max-sm:w-full">
        <div className="flex gap-2 justify-between">
          {(hubspotObjectTypeId === "0-3" || hubspotObjectTypeId === "0-5") && (
            <div className="inline-flex p-1 bg-graySecondary dark:bg-dark-200 rounded-md gap-x-2">
              <button
                type="button"
                onClick={() => {
                  if (view != "LIST") setActiveTab("LIST");
                }}
                className={`py-1 px-3 inline-flex dark:text-gray-200 items-center gap-x-2 -ms-px first:ms-0 first:rounded-s-md hover:bg-gray-50 dark:hover:bg-dark-500 last:rounded-e-md text-sm font-medium text-gray-800 ${view === "BOARD"
                    ? " bg-graySecondary dark:bg-dark-200"
                    : "bg-white dark:bg-dark-400"
                  }`}
              >
                <svg
                  fill="currentcolor"
                  width="20px"
                  height="23px"
                  viewBox="0 0 32 32"
                  version="1.1"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <title>list</title>
                  <path d="M8 8v4h16v-4h-16zM8 18h16v-4h-16v4zM8 24h16v-4h-16v4z"></path>
                </svg>
              </button>
              <button
                type="button"
                onClick={() => {
                  if (view != "BOARD") setActiveTab("BOARD");
                }}
                className={`py-1 px-3 inline-flex dark:text-gray-200 items-center gap-x-2 -ms-px first:ms-0 hover:bg-gray-50 dark:hover:bg-dark-500 first:rounded-s-md last:rounded-e-md text-sm font-medium text-gray-800 ${view === "BOARD"
                    ? "bg-white dark:bg-dark-400"
                    : " bg-graySecondary dark:bg-dark-200"
                  }`}
              >
                <svg
                  width="15px"
                  height="15px"
                  viewBox="0 0 16 16"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <g id="SVGRepo_bgCarrier" strokeWidth="0"></g>
                  <g
                    id="SVGRepo_tracerCarrier"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  ></g>
                  <g id="SVGRepo_iconCarrier">
                    {" "}
                    <path d="M7 1H1V5H7V1Z" fill="currentcolor"></path>{" "}
                    <path d="M7 7H1V15H7V7Z" fill="currentcolor"></path>{" "}
                    <path d="M9 1H15V9H9V1Z" fill="currentcolor"></path>{" "}
                    <path d="M15 11H9V15H15V11Z" fill="currentcolor"></path>{" "}
                  </g>
                </svg>
              </button>
            </div>
          )}

          {(subscriptionType !== 'FREE' && 
              (
                (
                  ((hubspotObjectTypeId === "0-3" || hubspotObjectTypeId === "0-5") && pipelines.length > 1) || // if pipelines length > 1 for "0-3" and "0-5" then show (hide for single pipeline)
                  ((hubspotObjectTypeId != "0-3" || hubspotObjectTypeId != "0-5") && pipelines.length > 0) // if pipelines length > 0 then show pipeline for all objects (hide for empty pipeline)
                ) &&
                !specPipeLine
              )
            ) &&
            
            (showPipelineFilter ? (
              <div className="w-[180px]">
                <select
                  id='pipeline-filter'
                  className=" w-full h-full rounded-md bg-cleanWhite px-2 text-sm transition-colors border-2 dark:border-gray-600 focus:ring-0 focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50 dark:bg-gray-700 dark:text-gray-200 dark:placeholder-gray-400 py-2"
                  value={selectedPipeline}
                  onChange={(e) => handelPipeline(e.target?.value || "")}
                >
                  <option value="" disabled={view === "BOARD"} selected>
                    All Pipelines
                  </option>
                  {pipelines.map((item: any) => (
                    <option value={item.pipelineId}>{item.label}</option>
                  ))}
                </select>
              </div>
            ) : null)}
        </div>
        {/* {subscriptionType !== 'FREE' &&  */}
          <div className=" md:flex md:items-center md:gap-2">
            <Tooltip id={"searchInput"} content="Press enter to search" place='right'>
              <div className='relative'>
              <Input
                placeholder="Search..."
                height="semiMedium"
                icon={SearchIcon}
                value={search}
                onChange={async (e) => {
                  await setSearch(e.target.value);
                  if (e.target.value === "") handleSearch();
                }}
                onKeyDown={async (e) => {
                  if (e.key === "Enter") {
                    await setPage(subscriptionType === 'FREE' ? '' : 1);
                    await setLimit(pageLimit);
                    handleSearch(); // Trigger search when Enter is pressed
                  }
                }}
                className="pr-12"
              />
              {search && (
                <div
                  className="text-gray-500 absolute right-2 top-1/2 -translate-y-1/2 cursor-pointer"
                  onClick={async () => {
                    await setPage(subscriptionType === 'FREE' ? '' : 1);
                    await setLimit(pageLimit);
                    handleSearch(); // Trigger search when button is clicked
                  }} // Trigger search on button click
                >
                  <EnterIcon />
                </div>
              )}
              </div>
            </Tooltip>
            {search && (
              <Button
                onClick={async () => {
                  await setSearch("");
                  await setPage(subscriptionType === 'FREE' ? '' : 1);
                  await setLimit(pageLimit);
                  handleSearch();
                }}
                variant="link"
                size="link"
              >
                Clear All
              </Button>
            )}
          </div>
        {/* } */}
      </div>
      {hubSpotUserDetails.sideMenu[0]?.tabName !== title &&
        ((defPermissions && hubspotObjectTypeId === "0-5")
          ? defPermissions?.create
          : permissions?.create) && (
          <div className="text-end">
            <Button variant={!recorBtnCustom ? 'default' : 'create'} onClick={() => setShowAddDialog(true)}>
              <span className="mr-2">
                <IconPlus className="!w-3 !h-3" />
              </span>
              <span className="max-w-[300px] overflow-hidden text-ellipsis whitespace-nowrap">
                Create {title || objectName}
              </span>
            </Button>
          </div>
        )}
    </div>
  );
};
