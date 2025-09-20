import { Tooltip } from '@/components/ui/Tooltip'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Form'
import { IconPlus } from '@/assets/icons/IconPlus'
import { SearchIcon } from '@/assets/icons/SearchIcon'
import { recorBtnCustom } from '@/data/hubSpotData'

export const DashboardTableHeaderSkeleton = ({
  title,
  hubspotObjectTypeId,
}: any) => {

  return (
    <div className="flex justify-between mb-6 items-center max-sm:flex-col-reverse max-sm:items-end gap-2">
      <div className="flex gap-2 justify-between max-sm:flex-col-reverse max-sm:w-full">
        <div className="flex gap-2 justify-between">
          {(hubspotObjectTypeId === "0-3" || hubspotObjectTypeId === "0-5") && (
            <div className="inline-flex p-1 bg-graySecondary dark:bg-dark-200 rounded-md gap-x-2">
              <button
                type="button"
                className={`py-1 px-3 inline-flex bg-transparent dark:text-gray-200 items-center gap-x-2 -ms-px first:ms-0 first:rounded-s-md hover:bg-gray-50 dark:hover:bg-dark-500 last:rounded-e-md text-sm font-medium text-gray-800`}
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
                className={`py-1 px-3 inline-flex bg-transparent dark:text-gray-200 items-center gap-x-2 -ms-px first:ms-0 hover:bg-gray-50 dark:hover:bg-dark-500 first:rounded-s-md last:rounded-e-md text-sm font-medium text-gray-800`}
              >
                <svg
                  width="15px"
                  height="15px"
                  viewBox="0 0 16 16"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <g id="SVGRepo_bgCarrier" stroke-width="0"></g>
                  <g
                    id="SVGRepo_tracerCarrier"
                    stroke-linecap="round"
                    stroke-linejoin="round"
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

          {(hubspotObjectTypeId === "0-3" || hubspotObjectTypeId === "0-5") && (
            <div className="w-[180px]">
              <select
                id='pipeline-filter-sceleton'
                className="w-full rounded-md bg-cleanWhite px-2 text-sm transition-colors border-2 dark:border-gray-600 focus:ring-0 focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50 dark:bg-gray-700 dark:text-gray-200 dark:placeholder-gray-400 py-2"
                value={''}
              >
                <option value="" selected>
                  All Pipelines
                </option>
              </select>
            </div>
          )}
        </div>
        <div className=" md:flex md:items-center md:gap-2">
          <Tooltip id={'searchInputSkeleton'} content="Press enter to search ">
            <Input
              placeholder="Search..."
              height="semiMedium"
              icon={SearchIcon}
              className="pr-12"
            />
          </Tooltip>
        </div>
      </div>
      <div className="text-end">
        <Button variant={!recorBtnCustom ? 'default' : 'create'}>
          <span className="mr-2">
            <IconPlus className="!w-3 !h-3" />
          </span>
          Create {title}
        </Button>
      </div>
    </div>
  );
};
