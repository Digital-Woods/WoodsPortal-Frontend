const HomeCompanyCardSkeleton = () => {
    return (
        <div className="rounded-lg animate-pulse border dark:border-none dark:bg-dark-300 relative overflow-hidden">
            {/* Associated Company Details */}
            <div className="w-full dark:border-gray-600">
                <div className="relative md:py-4 py-3 md:px-4 px-3 ">
                    <div className={`bg-[${moduleStylesOptions.homeTabStyles.overlayer.color || '#E5F5F8'}]/${moduleStylesOptions.homeTabStyles.overlayer.opacity || '100'} dark:bg-gray-600/10 absolute top-0 right-0 left-0 bottom-0`}></div>
                    <div className="relative z-2 ">
                        <button className="absolute right-4 top-1/2 -translate-y-1/2 p-3 rounded-full overflow-hidden">
                            <div className="bg-secondary dark:bg-white opacity-20 absolute top-0 right-0 left-0 bottom-0"></div>
                            <span className="text-secondary dark:text-white inline-block -rotate-45">
                                <Arrow />
                            </span>
                        </button>
                        <p className="text-xs text-gray-500 mb-2">
                            <span className="h-2 bg-gray-300 dark:bg-dark-white rounded-sm w-[70px] inline-block"></span>
                        </p>
                        <h3 className="text-lg font-semibold dark:text-white">
                            <span className="h-6 bg-gray-300 dark:bg-dark-white rounded-sm w-[100px] inline-block"></span>
                        </h3>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-xs dark:text-white transition-all mt-3 duration-500 md:px-4 px-3 md:pb-4 pb-3 ">
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
