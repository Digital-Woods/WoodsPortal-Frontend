const HomeCompanyCard = ({ companyDetailsModalOption, userData, isLoading, isLoadedFirstTime, propertiesList, iframePropertyName }) => {
    const [userAssociatedDetails, setUserAssociatedDetails] = useState({});
    const [userAssociatedDetailsModal, setUserAssociatedDetailsModal] = useState({});
    const [openModal, setOpenModal] = useState(false);
    const [expandDialog, setExpandDialog] = useState(false);
    const { sync, setSync } = useSync();
    const [iframeViewDialog, setIframeViewDialog] = useState(false);
    const [iframeUrls, setIframeUrls] = useState([]);
    const [currentIframeIndex, setCurrentIframeIndex] = useState(0);

    // Process the propertiesList to filter and organize data
    const processProperties = (propertiesList, data) => {
        if (!propertiesList || !Array.isArray(propertiesList)) return {};

        const result = {};

        propertiesList.forEach(item => {
            const { properties_value, property_type } = item;

            // Determine where to look for the property
            let source;
            if (property_type === "company") {
                source = data?.associations?.COMPANY || {};
            } else {
                source = data || {};
            }

            // If the property exists in the source, add it to results
            if (source[properties_value]) {
                result[properties_value] = source[properties_value];
            }
        });

        return result;
    };

    useEffect(() => {
        if (userData) {
            // Process the main display properties
            const associatedDetails = processProperties(propertiesList, userData);
            setUserAssociatedDetails(associatedDetails);

            // For modal, show all company properties except excluded ones
            const allCompanyProps = userData?.associations?.COMPANY || {};
            const filtered = Object.entries(allCompanyProps).filter(
                ([key]) => !["configurations", "objectTypeId", "labels", "name", "hs_object_id"].includes(key)
            );
            setUserAssociatedDetailsModal(Object.fromEntries(filtered));
        }
    }, [userData, propertiesList]);

    if (!isLoadedFirstTime || (sync === true)) {
        return <HomeCompanyCardSkeleton />;
    }

    // Sort properties for display
    const visibleAssociatedDetails = userAssociatedDetails;

    const expandToggleButton = () => {
        setExpandDialog(!expandDialog);
    }

    const iframeSettings = Array.isArray(iframePropertyName) ? iframePropertyName : [];

    const isIframeEnabled = (key) => {
        const setting = iframeSettings.find(setting => setting.properties_value === key);
        return setting?.show_iframe;
    };

    const getIframeButtonName = (key) => {
        const setting = iframeSettings.find(setting => setting.properties_value === key);
        return setting?.iframe_button_name || 'View';
    };

    const isImageUrl = (url) => {
        const imageExtensions = [".jpg", ".jpeg", ".png", ".gif", ".bmp", ".webp"];
        const hasImageExtension = imageExtensions.some((ext) =>
            url.toLowerCase().endsWith(ext)
        );
        const containsImagePattern =
            url.includes("images.unsplash.com") || url.includes("photo");
        return hasImageExtension || containsImagePattern;
    };

    const handleViewClick = (urls) => {
        const urlArray = urls.split(",").map((url) => url.trim());
        setIframeUrls(urlArray);
        setCurrentIframeIndex(0);
        setIframeViewDialog(true);
    };

    const handleNext = () => {
        setCurrentIframeIndex((prevIndex) =>
            prevIndex < iframeUrls.length - 1 ? prevIndex + 1 : prevIndex
        );
    };

    const handlePrevious = () => {
        setCurrentIframeIndex((prevIndex) =>
            prevIndex > 0 ? prevIndex - 1 : prevIndex
        );
    };

    return (
        <div className="rounded-lg relative overflow-hidden">
            {/* Associated Company Details */}
            {visibleAssociatedDetails && (
                <div className="w-full">
                    <div className={`grid ${moduleStylesOptions.homeTabStyles.companyProperties.direction != 'list' ? 'grid-cols-2' : 'grid-cols-1'}  gap-2 relative z-[2] text-xs dark:text-white transition-all duration-500 md:pb-4 pb-3 md:px-4 px-3`}>
                        {companyDetailsModalOption ? (
                            <button onClick={() => setOpenModal(true)} className="absolute right-2 top-2 z-[4] p-3 rounded-full overflow-hidden">
                                <div className="bg-secondary dark:bg-white opacity-20 absolute top-0 right-0 left-0 bottom-0"></div>
                                <span className="text-secondary dark:text-white inline-block -rotate-45">
                                    <Arrow />
                                </span>
                            </button>
                        ) : null}
                        { Object.keys(visibleAssociatedDetails).length > 0 ? (
                                Object.entries(visibleAssociatedDetails).map(([key, value]) => (
                                    isIframeEnabled(key) ? (
                                        <div key={key} className={`flex ${moduleStylesOptions.homeTabStyles.companyProperties.direction == 'list' ? 'flex-row items-center' : 'flex-col items-start'} gap-2 text-xs`}>
                                            <span className="font-semibold">
                                                {value?.label}:
                                            </span>
                                            <span className="text-sm dark:text-white ">
                                                {value?.value ? (
                                                    <Button
                                                        className=""
                                                        size="xsm"
                                                        onClick={() => handleViewClick(value?.value)}
                                                    >
                                                        {getIframeButtonName(key)}
                                                    </Button>
                                                ) : (
                                                    "--"
                                                )}
                                            </span>
                                        </div>
                                    ) : (
                                        <div key={key} className={`flex ${moduleStylesOptions.homeTabStyles.companyProperties.direction == 'list' ? 'flex-row items-center' : 'flex-col items-start'} gap-2 text-xs`}>
                                            <span className="font-semibold">{value?.label}:</span>
                                            <span>
                                                {renderCellContent({
                                                    companyAsMediator: false,
                                                    value: value?.value,
                                                    column: { ...value, key },
                                                    type: 'company'
                                                })}
                                            </span>
                                        </div>)
                                ))) : (
                                <div className="text-xs dark:text-white">Please enable visibility in the admin panel for the property you entered.</div>
                            )}
                    </div>
                </div>
            )}

            {companyDetailsModalOption ? (
                <Dialog open={openModal} onClose={setOpenModal}
                    className={`!p-0 relative mx-auto bg-white overflow-y-auto max-h-[95vh] ${expandDialog ? 'lg:w-[calc(100vw-25vw)] md:w-[calc(100vw-5vw)] w-[calc(100vw-20px)]' : 'lg:w-[780px] md:w-[680px] w-[calc(100vw-28px)] '} `}
                >
                    <div className="flex justify-between items-center mb-4 bg-[#516f90] dark:bg-dark-300 dark:bg-dark-200 p-4">
                        <h2 className="text-lg font-semibold text-white dark:text-white mb-0">
                            {userData?.associations?.COMPANY?.name?.value || "No Company Name"}
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
                            {Object.entries(visibleAssociatedDetails).map(([key, value]) => (
                                isIframeEnabled(key) ? (
                                    <div key={key} className="flex flex-col items-start gap-1 text-xs">
                                        <span className="font-semibold">
                                            {value?.label}:
                                        </span>
                                        <span className="text-sm pt-2 dark:text-white align-top">
                                            {value?.value ? (
                                                <Button
                                                    className=""
                                                    variant="outline"
                                                    size="xsm"
                                                    onClick={() => handleViewClick(value?.value)}
                                                >
                                                    {getIframeButtonName(key)}
                                                </Button>
                                            ) : (
                                                "--"
                                            )}
                                        </span>
                                    </div>
                                ) : (
                                    <div key={key} className="flex flex-col items-start gap-1 text-xs">
                                        <span className="font-semibold">{value?.label}</span>
                                        {renderCellContent({
                                            companyAsMediator: false,
                                            value: value?.value,
                                            column: { ...value, key },
                                            type: 'company'
                                        })}
                                    </div>
                                )
                            ))}
                        </div>
                    </div>
                </Dialog>) : null}

            <IframeViewDialog
                open={iframeViewDialog}
                onClose={() => setIframeViewDialog(false)}
                iframeUrls={iframeUrls}
                currentIframeIndex={currentIframeIndex}
                handleNext={handleNext}
                handlePrevious={handlePrevious}
                isImageUrl={isImageUrl}
            />
        </div>
    );
};