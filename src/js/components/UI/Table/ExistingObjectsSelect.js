const ExistingObjectsSelect = ({
    optionObjects,
    selectedObjects,
    handleCheckboxChange,
    pagination = false,
}) => {

    return (
        <div>
            <Table className="w-full dark:!bg-transparent">
                <TableBody>
                    {optionObjects?.map((item) => (
                        <TableRow key={item.value} className='dark:!bg-transparent'>
                            <TableCell className="flex items-center px-4 !py-2 !border-none dark:text-white dark:bg-transparent hover:bg-gray-50 dark:hover:bg-dark-400">
                                <div class="flex items-center">
                                    <input
                                        id={item.value}
                                        name={item.value}
                                        type="checkbox"
                                        className="mr-2 form-checkbox h-4 w-4 text-secondary focus:outline-none cursor-pointer"
                                        checked={selectedObjects?.some((obj) => obj.value === item.value)}
                                        onChange={() => handleCheckboxChange(item.value, item.label)}
                                    />
                                    <label htmlFor={item.value} className="flex items-center cursor-pointer">
                                        {item.label}
                                    </label>
                                </div>
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>

            {pagination && (
                <div className="flex items-center justify-between max-md:flex-col max-sm:mt-3 text-sm">
                    <div className="flex justify-start">
                        <Pagination
                            numOfPages={1}
                            currentPage={1}
                            setCurrentPage={() => { }}
                        />
                    </div>
                </div>
            )}
        </div>
    );
};
