export const DetailsSidebarSkeleton = () => {
    return (
        <div className="space-y-4">
            {Array(4).fill("").map((_, index) => (
                <div key={index} className="bg-[var(--right-tables-background-color)] dark:bg-dark-300 p-4 rounded-lg animate-pulse">
                    <div className="flex justify-between items-center">
                        <span className="bg-gray-300 dark:bg-dark-white w-20 h-4 rounded-sm"></span>
                        <span className="bg-gray-500 w-4 h-2 rounded-sm"></span>
                    </div>
                    <div className="bg-gray-300 dark:bg-dark-white w-full h-4 rounded-sm mt-2"></div>
                    <div className="bg-gray-300 dark:bg-dark-white w-full h-4 rounded-sm mt-2"></div>
                    <div className="bg-gray-300 dark:bg-dark-white w-40 h-4 rounded-sm mt-2 ml-auto"></div>
                </div>
            ))}
        </div>
    );
};