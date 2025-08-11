export const BoardViewSkeleton = () => {
    return (
        <div className="grid grid-cols-5 md:mb-4 mb-3 h-[66vh]">
            {Array(5).fill(0).map((_, index) => (
                <div key={index} className={`relative flex flex-col h-full bg-[#f5f8fa] dark:bg-dark-500 border dark:border-gray-600 overflow-y-auto hide-scrollbar first:border-r-0 last:border-l-0 first:rounded-s-md last:rounded-e-md`}>
                    {/* Column Title */}
                    <div className="px-3 py-3 border-b dark:border-b-gray-600 sticky top-0 z-[2] bg-[#f5f8fa] dark:bg-dark-500">
                        <div className="h-4 w-2/4 bg-gray-300 dark:bg-white dark:opacity-20 rounded-sm animate-pulse"></div>
                    </div>

                    {/* Skeleton Cards */}
                    {Array(3).fill(0).map((_, i) => (
                        <div className="rounded-md bg-white border border-gray-300 dark:border-gray-600 shadow-sm p-3 mx-3 my-2 dark:bg-dark-300 dark:text-white">
                            <div key={i} className="h-3 w-3/5 bg-secondary dark:bg-white opacity-10 rounded-sm animate-pulse mb-2"></div>
                            <div key={i} className="h-3 w-2/4 bg-gray-200 dark:bg-white opacity-30 rounded-sm animate-pulse"></div>
                        </div>
                    ))}
                </div>
            ))}
        </div>
    );
};
