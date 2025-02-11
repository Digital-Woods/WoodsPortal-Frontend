const OverviewSkeleton = () => {
    return (
        <div className="w-full animate-pulse p-4 bg-white dark:bg-dark-500 rounded-lg">
            <div className="space-y-4">
                {Array(6).fill("").map((_, index) => (
                    <div key={index} className="flex gap-6 animate-pulse">
                        <span className="bg-gray-300 dark:bg-dark-white w-32 h-4 rounded-sm"></span>
                        <span className="bg-gray-300 dark:bg-dark-white w-40 h-4 rounded-sm"></span>
                    </div>
                ))}
            </div>
        </div>
    )
}
