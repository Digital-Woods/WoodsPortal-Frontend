export const DashboardTitleSkeleton = () => {
  return (
    <div className="mb-4 animate-pulse">
      {/* Title */}
      <div className="h-6 w-48 bg-gray-300 dark:bg-dark-white dark:bg-opacity-20 rounded-md mb-2"></div>

      {/* Records count */}
      <div className="h-4 w-24 bg-gray-200 dark:bg-dark-white dark:bg-opacity-20 rounded-md"></div>
    </div>
  );
};
