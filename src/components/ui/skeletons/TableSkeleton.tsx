import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '@/components/ui/Table';


export const TableSkeleton = ({ row = 10, col = 5 }: any) => {
    return (
        <div className="w-full">
            <div className="table-container rounded-md ">
                <Table className="w-full animate-pulse dark:bg-[#2a2a2a]">
                    <TableHeader className="bg-gray-100 text-left dark:bg-dark-500">
                        <TableRow>
                            {[...Array(col)].map((_, j) => (
                                <TableHead key={j} className="px-4 py-2 whitespace-nowrap dark:text-white dark:bg-dark-500 text-xs">
                                    <div className="h-4 w-full bg-gray-200 dark:bg-dark-white dark:bg-opacity-20 rounded-md"></div>
                                </TableHead>
                            ))}
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {[...Array(row)].map((_, i) => (
                            <TableRow className={`animate-pulse border-t dark:border-gray-600 relative cursor-pointer hover:bg-gray-200 dark:hover:bg-dark-300`}>
                                {[...Array(col)].map((_, j) => (
                                    <TableCell key={j} className="px-4 py-2 whitespace-nowrap text-xs dark:text-white">
                                        <div className="h-4 w-full bg-gray-200 dark:bg-dark-white dark:bg-opacity-20 rounded-md"></div>
                                    </TableCell>
                                ))}
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </div>
            {/* Pagination & Results Skeleton */}
            <div className="flex items-center justify-between p-3">
                {/* Showing Results Text */}
                <div className="h-4 w-48 bg-gray-200 rounded-md animate-pulse"></div>

                {/* Pagination Controls */}
                <div className="flex items-center gap-2">
                    <div className="h-8 w-8 bg-gray-300 dark:bg-dark-white dark:bg-opacity-20 rounded-md animate-pulse"></div> {/* Left Arrow */}
                    <div className="h-6 w-6 bg-gray-300 dark:bg-dark-white dark:bg-opacity-20 rounded-md animate-pulse"></div> {/* Page Number */}
                    <div className="h-8 w-8 bg-gray-300 dark:bg-dark-white dark:bg-opacity-20 rounded-md animate-pulse"></div> {/* Right Arrow */}
                </div>
            </div>
        </div>
    );
};
