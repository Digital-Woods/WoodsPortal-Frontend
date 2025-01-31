
const TableSkeleton = () => {
    return (
        <div className="">
            {/* Table Header Skeleton */}
            <div className="grid grid-cols-5 gap-4 p-3 bg-gray-100 dark:bg-dark-500 rounded-md">
                {[...Array(5)].map((index) => (
                    <div key={index} className="h-4 w-full bg-gray-300 dark:bg-dark-white dark:bg-opacity-20 rounded-md animate-pulse"></div>
                ))}
            </div>

            {/* Table Rows Skeleton */}
            {[...Array(10)].map((_, i) => (
                <div key={i} className="grid grid-cols-5 gap-4 p-3 border-b animate-pulse">
                    {[...Array(5)].map((_, j) => (
                        <div key={j} className="h-4 w-full bg-gray-200 dark:bg-dark-white dark:bg-opacity-20 rounded-md"></div>
                    ))}
                </div>
            ))}
            {/* Pagination & Results Skeleton */}
            <div className="flex items-center justify-between p-3">
                {/* Showing Results Text */}
                <div className="h-4 w-48 bg-gray-200 rounded-md animate-pulse"></div>

                {/* Pagination Controls */}
                <div className="flex items-center gap-2">
                    <div className="h-8 w-8 bg-gray-300 dark:bg-dark-white dark:bg-opacity-20 rounded-md animate-pulse"></div> {/* Left Arrow */}
                    <div className="h-6 w-6 bg-gray-300 dark:bg-dark-white dark:bg-opacity-20 rounded-md animate-pulse"></div> {/* Page Number */}
                    <div className="h-8 w-8 bg-gray-300 dark:bg-dark-white dark:bg-opacity-20 rounded-md animate-pulse"></div> {/* Right Arrow */}
                </div>
            </div>
        </div>
    );
};
