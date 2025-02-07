const FilesSkeleton = () => {
    return (
        <div className="w-full">
            <div className="rounded-lg mt-2 border dark:border-none  bg-cleanWhite dark:bg-dark-300 md:p-4 p-2 !pb-0">
                <div className="flex justify-between mb-6 items-center">
                    <Input
                        placeholder="Search..."
                        height="semiMedium"
                        value={''}
                        icon={SearchIcon} 
                    />
                    <div className="flex justify-end space-x-2">
                        <Button  variant="create">
                            <span className="mr-2"> <IconPlus className='!w-3 !h-3' /> </span> New Folder
                        </Button>

                        <Button  variant="create">
                            <span className="mr-2"> <IconPlus className='!w-3 !h-3' /> </span> New File
                        </Button>
                    </div>
                </div>

                <div className="flex md:flex-row text-xs dark:text-white flex-col-reverse justify-between gap-2 md:items-center ">
                    Home
                </div>

                <h1 className="text-xl font-semibold mb-4 dark:text-white">
                    Home
                </h1>
                <div className="w-full">
                    <div className="table-container  overflow-auto  rounded-md ">
                        <Table className="w-full dark:bg-[#2a2a2a]">
                            <TableHeader className="bg-gray-100 text-left dark:bg-dark-500">
                                <TableRow>
                                    <TableHead className="px-4 py-2 dark:border-gray-600 whitespace-nowrap dark:text-white dark:bg-dark-500 text-xs"></TableHead>
                                    <TableHead className="px-4 py-2 dark:border-gray-600 whitespace-nowrap dark:text-white dark:bg-dark-500 text-xs">Name</TableHead>
                                    <TableHead className="px-4 py-2 dark:border-gray-600 whitespace-nowrap dark:text-white dark:bg-dark-500 text-xs text-left">File Type</TableHead>
                                    <TableHead className="px-4 py-2 dark:border-gray-600 whitespace-nowrap dark:text-white dark:bg-dark-500 text-xs text-left">Size</TableHead>
                                    <TableHead className="px-4 py-2 dark:border-gray-600 whitespace-nowrap dark:text-white dark:bg-dark-500 text-xs"></TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {[...Array(10)].map((_, i) => (
                                    <TableRow className={`animate-pulse border-t dark:border-gray-600 relative cursor-pointer hover:bg-gray-200 dark:hover:bg-dark-300`}>
                                        {[...Array(5)].map((_, j) => (
                                            <TableCell key={j} className="px-4 py-2 dark:border-gray-600 whitespace-nowrap text-xs dark:text-white">
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
            </div>
        </div>
    )
}