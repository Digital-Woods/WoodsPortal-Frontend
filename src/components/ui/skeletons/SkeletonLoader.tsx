import { moduleStylesOptions } from '@/data/hubSpotData';

export const SkeletonLoader = () => {
    return (
        <div className="animate-pulse flex max-sm:flex-col items-start gap-8 w-full mx-auto p-6 rounded-lg shadow-md border dark:border-none dark:bg-dark-300 relative overflow-hidden">
            <div className={`bg-[${moduleStylesOptions.homeTabStyles.overlayer.color || '#E5F5F8'}]/${moduleStylesOptions.homeTabStyles.overlayer.opacity || '100'} dark:bg-gray-600/10 absolute top-0 right-0 left-0 h-[90px]`}></div>

            {/* Profile Initials */}
            <div className="flex items-center justify-center relative z-50">
                <div className="rounded-full h-[80px] w-[80px] max-sm:w-[50px] max-sm:h-[50px] flex items-center justify-center bg-gray-400 text-white text-2xl font-medium">
                    U
                </div>
            </div>

            {/* User Details */}
            <div className="relative w-full z-50 mt-2">
                <div className="flex flex-col md:flex-row gap-4 pb-4 mb-4">
                    <div className="flex-1">
                        <h2 className=" flex items-center flex-wrap gap-2 text-xl font-semibold dark:text-secondary text-secondary mb-2">
                            {/* {firstName} {lastName} */}
                            <span className="h-3 bg-gray-300 dark:bg-dark-white rounded-sm w-[150px] inline-block "></span>
                        </h2>
                        <p className="text-xs flex items-center flex-wrap gap-1 dark:text-white">
                            <span className="h-3 bg-gray-300 dark:bg-dark-white rounded-sm w-[100px] inline-block"></span>
                            •
                            <span className="h-3 bg-gray-300 dark:bg-dark-white rounded-sm w-[100px] inline-block "></span>
                        </p>
                    </div>
                </div>

                {/* User Info Grid */}
                <div className="">
                    <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4 gap-2 text-xs dark:text-white transition-all duration-500">
                        {Array.from({ length: 4 }).map((_, i) => (
                            <div key={i} className="flex flex-col items-start gap-1 text-xs">
                                <span className="font-semibold">
                                    <sapn className="h-3 bg-gray-300 dark:bg-dark-white rounded-sm w-[120px] inline-block"></sapn>
                                </span>
                                <span className="h-3 bg-gray-300 dark:bg-dark-white rounded-sm w-[100px] inline-block"></span>
                            </div>
                        ))}
                    </div>

                    {/* {sortedDetails.length > 4 && (
                        <Button
                            variant="link"
                            size="link"
                            onClick={() => setShowMoreDetails(!showMoreDetails)}
                            className="font-medium mt-2 text-xs"
                        >
                            {showMoreDetails ? "Show Less" : "Show More"}
                        </Button>
                    )} */}
                </div>

                {/* Associated Company Details */}
                <div className="mt-6 pt-4 border-t dark:border-gray-600">
                    <h3 className="text-lg font-semibold dark:text-white mb-4">
                        <span className="h-6 bg-gray-300 dark:bg-dark-white rounded-sm w-[100px] inline-block"></span>
                    </h3>

                    <div className="">
                        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4 gap-2 text-xs dark:text-white transition-all mt-2 duration-500">
                            {Array.from({ length: 4 }).map((_, i) => (
                                <div key={i} className="flex flex-col items-start gap-1 text-xs">
                                    <span className="font-semibold">
                                        <span className="h-3 bg-gray-300 dark:bg-dark-white rounded-sm w-[120px] inline-block"></span>
                                    </span>
                                    <span className="h-3 bg-gray-300 dark:bg-dark-white rounded-sm w-[100px] inline-block"></span>
                                </div>
                            ))}
                        </div>

                        {/* {sortedAssociatedDetails.length > 4 && (
                            <Button
                                variant="link"
                                size="link"
                                onClick={() => setShowMoreAssociated(!showMoreAssociated)}
                                className="font-medium mt-2 text-xs"
                            >
                                {showMoreAssociated ? "Show Less" : "Show More"}
                            </Button>
                        )} */}
                    </div>
                </div>
            </div>
        </div>
    );
};

