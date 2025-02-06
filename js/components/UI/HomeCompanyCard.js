const HomeCompanyCard = ({ userData }) => {
    const [userAssociatedDetails, setUserAssociatedDetails] = useState({});
    const [userAssociatedDetailsModal, setUserAssociatedDetailsModal] = useState({});
    const [openModal, setOpenModal] = useState(false);
    const [expandDialog, setExpandDialog] = useState(false);

    useEffect(() => {
        if (userData?.response) {
            setUserAssociatedDetails(userData.response?.associations?.COMPANY || {});
            setUserAssociatedDetailsModal(userData.response?.associations?.COMPANY || {});
        }
    }, [userData]);

    if (!userAssociatedDetails || Object.keys(userAssociatedDetails).length === 0) {
        return <HomeCompanyCardSkeleton />;
    }

    // Filter and sort associated company details
    const filteredAssociatedDetailsModal = Object.entries(userAssociatedDetailsModal).filter(
        ([key, value]) => value?.label && !["configurations", "objectTypeId", "labels", "name", "hs_object_id"].includes(key)
    );
    const visibleAssociatedDetailsModal = sortProperties(Object.fromEntries(filteredAssociatedDetailsModal));

    const filterKeys = companyPropertiesList?.map(item => item.value);

    const filteredAssociatedDetails = Object.entries(userAssociatedDetails).filter(
        ([key, value]) => value?.label && filterKeys.includes(key)
    );
    const sortedAssociatedDetails = sortProperties(Object.fromEntries(filteredAssociatedDetails));
    const visibleAssociatedDetails = sortedAssociatedDetails.slice(0, 4);

    const expandToggleButton = () => {
        setExpandDialog(!expandDialog);
    }

    return (
        <div className="rounded-lg border dark:border-none dark:bg-dark-300 relative overflow-hidden">
            {/* Associated Company Details */}
            {visibleAssociatedDetails && (
                <div className="w-full dark:border-gray-600">
                    <div className="relative md:py-4 py-3 md:px-4 px-3 ">
                        <div className={` bg-[${moduleStylesOptions.homeTabStyles.overlayer.color || '#E5F5F8'}]/${moduleStylesOptions.homeTabStyles.overlayer.opacity || '100'} dark:bg-gray-600/10 absolute top-0 right-0 left-0 bottom-0`}></div>
                        <div className="relative z-2 ">
                            {companyDetailsModal == 'true' ? (
                                <button onClick={() => setOpenModal(true)} className="absolute right-4 top-1/2 -translate-y-1/2 p-3 rounded-full overflow-hidden">
                                    <div className="bg-secondary dark:bg-white opacity-20 absolute top-0 right-0 left-0 bottom-0"></div>
                                    <span className="text-secondary dark:text-white inline-block -rotate-45">
                                        <Arrow />
                                    </span>
                                </button>
                            ) : null}
                            <p className="text-xs text-gray-500 dark:text-white">Company Name</p>
                            <h3 className="text-lg font-semibold text-secondary dark:text-white dark:opacity-70">
                                {userAssociatedDetails?.name?.value || "No Company Name"}
                            </h3>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-xs dark:text-white transition-all mt-2 duration-500 md:px-4 px-3 md:pb-4 pb-3 ">
                        {visibleAssociatedDetails.map(([key, value]) => (
                            <div key={key} className="flex flex-col items-start gap-1 text-xs">
                                <span className="font-semibold">{value?.label}</span>
                                {renderCellContent(false, value?.value, value)}
                            </div>
                        ))}
                    </div>
                </div>
            )}
            {companyDetailsModal == 'true' ? (
                <Dialog open={openModal} onClose={setOpenModal}
                    className={`!p-0 relative mx-auto bg-white overflow-y-auto max-h-[95vh] ${expandDialog ? 'lg:w-[calc(100vw-25vw)] md:w-[calc(100vw-5vw)] w-[calc(100vw-20px)]' : 'lg:w-[780px] md:w-[680px] w-[calc(100vw-28px)] '} `}
                >
                    <div className="flex justify-between items-center mb-4 bg-[#516f90] dark:bg-dark-300 dark:bg-dark-200 p-4">
                        <h2 className="text-lg font-semibold text-white dark:text-white">
                            {userAssociatedDetails?.name?.value || "No Company Name"}
                        </h2>
                        <div className="flex gap-2 items-center">
                            <button
                                variant="outline"
                                onClick={expandToggleButton}
                                className="text-white dark:text-white cursor-pointer"
                            >
                                {expandDialog ?
                                    <div title='Shrink window'>
                                        <ShrinkIcon width='22px' height='22px' />
                                    </div>
                                    :
                                    <div title='Make window expand'>
                                        <ExpandIcon width='22px' height='22px' />
                                    </div>
                                }
                            </button>
                            <button
                                variant="outline"
                                onClick={() => setOpenModal(false)}
                                className="text-white dark:text-white"
                            >
                                <CloseIcon width='24px' height='24px' />
                            </button>
                        </div>
                    </div>
                    <div>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-2 text-xs dark:text-white transition-all mt-2 duration-500 md:px-4 px-3 md:pb-4 pb-3 ">
                            {visibleAssociatedDetailsModal.map(([key, value]) => (
                                <div key={key} className="flex flex-col items-start gap-1 text-xs">
                                    <span className="font-semibold">{value?.label}</span>
                                    {renderCellContent(false, value?.value, value)}
                                </div>
                            ))}
                        </div>
                    </div>
                </Dialog>) : null}
        </div>
    );
};

