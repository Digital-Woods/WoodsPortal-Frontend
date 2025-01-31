const DetailsSkeleton = ({ profileDetails = false }) => {
    return (
        <div className="min-h-screen text-white flex gap-4">
            <div className="flex flex-1 gap-6">
                {/* Left Column (Ticket Details) */}
                <div className={`${!profileDetails ? "lg:w-9/12" : ''} flex flex-col items-start gap-4 rounded-lg`}>
                    {!profileDetails ? <div className="relative h-36 rounded-lg w-full p-4 flex flex-col items-start justify-center overflow-hidden bg-custom-gradient">
                        <div className="bg-gray-300 dark:bg-dark-white w-36 h-5 rounded "></div>
                        <div className="bg-gray-300 dark:bg-dark-white w-48 h-5 rounded mt-2"></div>
                    </div> : null}


                    {/* Tabs */}
                    <div className="flex gap-2 bg-white dark:bg-dark-500 p-2 rounded-lg">
                        {Array(4).fill("").map((_, index) => (
                            <div key={index} className="px-4 py-2 bg-gray-300 dark:bg-dark-white text-white rounded-md w-20 h-8 animate-pulse" />
                        ))}
                    </div>
                    <div className="w-full p-4 bg-white dark:bg-dark-500 rounded-lg">
                        <div className="space-y-4">
                            {Array(6).fill("").map((_, index) => (
                                <div key={index} className="flex gap-6 animate-pulse">
                                    <span className="bg-gray-300 dark:bg-dark-white w-32 h-5 rounded"></span>
                                    <span className="bg-gray-500 w-40 h-5 rounded"></span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Right Column (Sidebar) */}
                {!profileDetails ?
                    <div className="space-y-4 lg:w-3/12">
                        {Array(5).fill("").map((_, index) => (
                            <div key={index} className="bg-rsbackground dark:bg-dark-300 p-4 rounded-lg animate-pulse">
                                <div className="flex justify-between items-center">
                                    <span className="bg-gray-300 dark:bg-dark-white w-20 h-5 rounded"></span>
                                    <span className="bg-gray-500 w-6 h-6 rounded-full"></span>
                                </div>
                                <div className="bg-gray-300 dark:bg-dark-white w-full h-5 rounded mt-2"></div>
                                <div className="bg-gray-300 dark:bg-dark-white w-full h-5 rounded mt-2"></div>
                                <div className="bg-gray-300 dark:bg-dark-white w-40 h-5 rounded mt-2"></div>
                            </div>
                        ))}
                    </div> : null}
            </div>
        </div>
    );
};
