const HomeCompanyCardSkeleton = () => {
    return (
        <div className="rounded-lg animate-pulse relative overflow-hidden">
            {/* Associated Company Details */}
            <div className="w-full dark:border-gray-600">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2 relative z-[2] text-xs dark:text-white transition-all duration-500 md:p-4 p-3">
                    <button className="absolute right-2 top-2 z-[4] p-3 rounded-full overflow-hidden">
                        <div className="bg-secondary dark:bg-white opacity-20 absolute top-0 right-0 left-0 bottom-0"></div>
                        <span className="text-secondary dark:text-white inline-block -rotate-45">
                            <Arrow />
                        </span>
                    </button>

                    {Array.from({ length: 4 }).map((_, i) => (
                        <div key={i} className="flex flex-col items-start gap-1 text-xs">
                            <span className="font-semibold">
                                <sapn className="h-3 bg-gray-300 dark:bg-dark-white rounded-sm w-[120px] inline-block"></sapn>
                            </span>
                            <span className="h-3 bg-gray-300 dark:bg-dark-white rounded-sm w-[100px] inline-block"></span>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    )
}
