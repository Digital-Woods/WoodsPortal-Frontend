import { OverviewSkeleton } from '@/components/ui/skeletons/OverviewSkeleton'
import { FilesSkeleton } from '@/components/ui/skeletons/FilesSkeleton'


export const DetailsSkeleton = ({header = true, tabs = 4, active = 'overview' }: any) => {
    return (

        <div className={`animate-pulse flex flex-col items-start gap-4 rounded-lg`}>
            {header ? <div className="relative h-36 rounded-lg w-full p-4 flex flex-col items-start justify-center overflow-hidden bg-custom-gradient">
                <div className="bg-gray-300 dark:bg-dark-white w-36 h-5 rounded-sm animate-pulse"></div>
                <div className="bg-gray-300 dark:bg-dark-white w-48 h-5 rounded-sm mt-2 animate-pulse"></div>
            </div> : null}


            {/* Tabs */}
            <div className="flex gap-2 bg-white dark:bg-dark-500 p-1 animate-pulse rounded-lg">
                {Array(tabs).fill("").map((_, index) => (
                    <div key={index} className="px-4 py-2 bg-gray-300 dark:bg-dark-white text-white rounded-md w-20 h-8 animate-pulse" />
                ))}
            </div>
            {active === 'overview' && (
                <OverviewSkeleton />
            )}

            {active === 'file' && (
                <FilesSkeleton />
            )}

        </div>
    );
};
