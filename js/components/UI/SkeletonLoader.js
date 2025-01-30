const SkeletonLoader = ({ items = 1, profile = false }) => {
    return (
        <div className="animate-pulse space-y-4">
            {[...Array(items)].map((_, index) => (
                <div key={index} className="bg-white shadow rounded-lg p-4">

                    {/* Profile Section */}
                    {profile ? (
                        <div className="flex items-center space-x-4 p-4 bg-red-50 rounded-t-lg">
                            <div className="w-12 h-12 bg-gray-300 rounded-full"></div>
                            <div className="flex-1 space-y-2">
                                <div className="h-4 bg-gray-300 rounded w-1/3"></div>
                                <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                            </div>
                        </div>
                    ) : null}

                    {/* Data Rows */}
                    <div className="p-4 space-y-3">
                        <div className="grid grid-cols-4 gap-4">
                            {Array(4)
                                .fill(0)
                                .map((_, i) => (
                                    <div key={i}>
                                        <div className="h-3 bg-gray-300 rounded w-2/3 mb-1"></div>
                                        <div className="h-3 bg-gray-200 rounded w-full"></div>
                                    </div>
                                ))}
                        </div>

                        {/* Company Section */}
                        <div className="border-t pt-3 space-y-3">
                            <div className="h-4 bg-gray-300 rounded w-1/4"></div>
                            <div className="grid grid-cols-4 gap-4">
                                {Array(4)
                                    .fill(0)
                                    .map((_, i) => (
                                        <div key={i}>
                                            <div className="h-3 bg-gray-300 rounded w-2/3 mb-1"></div>
                                            <div className="h-3 bg-gray-200 rounded w-full"></div>
                                        </div>
                                    ))}
                            </div>
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
};

