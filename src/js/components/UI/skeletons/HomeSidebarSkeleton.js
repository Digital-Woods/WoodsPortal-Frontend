const HomeSidebarSkeleton = () => {
    return (
        <div>
            <React.Fragment>
                <ul className={`space-y-4 transition-all duration-300 ease-in-out overflow-hidden max-h-[270px]`}>
                    {Array(2).fill("").map((_, i) => (
                        <div key={i} className="flex items-start text-rstextcolor bg-rscardbackhround dark:text-white dark:bg-dark-500 p-2 flex-col gap-1 border !border-transparent dark:!border-gray-600 rounded-md justify-between">
                            {[...Array(6)].map((_, j) => (
                                <div
                                    key={j}
                                    className="animate-pulse gap-1 flex items-center justify-between w-full"
                                >
                                    <div className="flex-1 text-xs whitespace-wrap align-top dark:text-white text-rstextcolor !p-[3px]">
                                        <span className="h-3 bg-rstextcolor dark:bg-white rounded-sm w-full inline-block opacity-30"></span>
                                    </div>

                                    <div className="flex-1 dark:text-white text-xs whitespace-wrap text-rstextcolor break-all  !p-[3px]">
                                        <span className="h-3 bg-rstextcolor dark:bg-white rounded-sm w-full inline-block opacity-30"></span>
                                    </div>
                                </div>
                            ))}
                        </div>

                    ))}
                </ul>
                <div className="flex items-center justify-between p-3">

                    {/* Pagination Controls */}
                    <div className="flex items-center gap-2">
                        <div className="h-8 w-8 bg-gray-300 dark:bg-dark-white dark:bg-opacity-20 rounded-md animate-pulse"></div> {/* Left Arrow */}
                        <div className="h-6 w-6 bg-gray-300 dark:bg-dark-white dark:bg-opacity-20 rounded-md animate-pulse"></div> {/* Page Number */}
                        <div className="h-8 w-8 bg-gray-300 dark:bg-dark-white dark:bg-opacity-20 rounded-md animate-pulse"></div> {/* Right Arrow */}
                    </div>
                </div>
            </React.Fragment>
        </div>
    )
}