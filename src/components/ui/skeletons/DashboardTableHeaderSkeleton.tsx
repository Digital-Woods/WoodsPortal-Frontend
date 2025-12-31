export const DashboardTableHeaderSkeleton = () => {
  return (
    <div className="flex justify-between mb-6 items-center max-sm:flex-col-reverse max-sm:items-end gap-3 animate-pulse">

      {/* Left Section */}
      <div className="flex gap-3 justify-between max-sm:flex-col-reverse max-sm:w-full">

        {/* Toggle + Select */}
        <div className="flex gap-3">
          {/* Toggle buttons skeleton */}
          <div className="flex gap-2 p-1 rounded-md bg-gray-100 dark:bg-dark-500">
            <div className="h-8 w-8 bg-gray-200 dark:bg-dark-white dark:bg-opacity-20 rounded-md"></div>
            <div className="h-8 w-8 bg-gray-200 dark:bg-dark-white dark:bg-opacity-20 rounded-md"></div>
          </div>

          {/* Pipeline select skeleton */}
          <div className="h-10 w-[180px] bg-gray-200 dark:bg-dark-white dark:bg-opacity-20 rounded-md"></div>
        </div>

        {/* Search input skeleton */}
        <div className="h-10 w-[260px] bg-gray-200 dark:bg-dark-white dark:bg-opacity-20 rounded-md"></div>
      </div>

      {/* Right Create button */}
      <div className="h-10 w-[160px] bg-gray-300 dark:bg-dark-white dark:bg-opacity-20 rounded-md"></div>
    </div>
  );
};
