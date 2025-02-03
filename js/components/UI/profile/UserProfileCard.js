const sortProperties = (data) => {
    return Object.entries(data)
        .filter(([key, value]) => value?.label) // Exclude unwanted keys
        .sort(([, a], [, b]) => {
            if (a.isPrimaryDisplayProperty && !b.isPrimaryDisplayProperty) return -1;
            if (!a.isPrimaryDisplayProperty && b.isPrimaryDisplayProperty) return 1;
            if (a.isSecondaryDisplayProperty && !b.isSecondaryDisplayProperty) return -1;
            if (!a.isSecondaryDisplayProperty && b.isSecondaryDisplayProperty) return 1;
            return 0;
        });
};

const UserProfileCard = ({ userData }) => {
    const [userDetails, setUserDetails] = useState({});
    const [userAssociatedDetails, setUserAssociatedDetails] = useState({});
    const [showMoreDetails, setShowMoreDetails] = useState(false);
    const [showMoreAssociated, setShowMoreAssociated] = useState(false);

    useEffect(() => {
        if (userData?.response) {
            setUserDetails(userData.response);
            setUserAssociatedDetails(userData.response?.associations?.COMPANY || {});
        }
    }, [userData]);

    if (!userDetails || Object.keys(userDetails).length === 0) {
        return <SkeletonLoader items={1} profile={true} />;
    }

    const firstName = userDetails?.firstname?.value || "";
    const lastName = userDetails?.lastname?.value || "";
    const initials = profileInitial(firstName, lastName);

    // Filter and sort user details
    const filteredDetails = Object.entries(userDetails).filter(
        ([key, value]) => value?.label && !["firstname", "lastname", "email", "company", "phone", "associations", "hs_object_id"].includes(key)
    );
    const sortedDetails = sortProperties(Object.fromEntries(filteredDetails));
    const visibleDetails = showMoreDetails ? sortedDetails : sortedDetails.slice(0, 4);

    // Filter and sort associated company details
    const filteredAssociatedDetails = Object.entries(userAssociatedDetails).filter(
        ([key, value]) => value?.label && !["configurations", "objectTypeId", "labels", "name", "hs_object_id"].includes(key)
    );
    const sortedAssociatedDetails = sortProperties(Object.fromEntries(filteredAssociatedDetails));
    const visibleAssociatedDetails = showMoreAssociated ? sortedAssociatedDetails : sortedAssociatedDetails.slice(0, 4);

    return (
        <div>
            <div className="flex max-sm:flex-col items-start gap-8 w-full mx-auto p-6 rounded-lg shadow-md border dark:border-none dark:bg-dark-300 relative overflow-hidden">
                <div className="bg-secondary opacity-10 absolute top-0 right-0 left-0 h-[90px]"></div>

                {/* Profile Initials */}
                <div className="flex items-center justify-center relative z-50">
                    <div className="rounded-full h-[80px] w-[80px] max-sm:w-[50px] max-sm:h-[50px] flex items-center justify-center bg-gray-400 text-white text-2xl font-medium">
                        {initials}
                    </div>
                </div>

                {/* User Details */}
                <div className="relative w-full z-50">
                    <div className="flex flex-col md:flex-row gap-4 pb-4 mb-4">
                        <div className="flex-1">
                            <h2 className="text-xl font-semibold dark:text-secondary text-secondary">
                                {firstName} {lastName}
                            </h2>
                            <p className="text-xs dark:text-white">
                                {userDetails?.email?.value || "--"} • {userDetails?.phone?.value || "--"}
                            </p>
                        </div>
                    </div>

                    {/* User Info Grid */}
                    <div className="">
                        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4 gap-2 text-xs dark:text-white transition-all duration-500">
                            {visibleDetails.map(([key, value]) => (
                                <div key={key} className="flex flex-col items-start gap-1 text-xs">
                                    <span className="font-semibold">{value?.label}:</span>
                                    {renderCellContent(
                                        false,
                                        value?.value,
                                        value,
                                        null,
                                        null,
                                        null,
                                        "details",
                                        null,
                                        null,
                                        null,
                                        null
                                    )}
                                </div>
                            ))}
                        </div>

                        {sortedDetails.length > 4 && (
                            <Button
                                variant="link"
                                size="link"
                                onClick={() => setShowMoreDetails(!showMoreDetails)}
                                className="font-medium mt-2 text-xs"
                            >
                                {showMoreDetails ? "Show Less" : "Show More"}
                            </Button>
                        )}
                    </div>

                    {/* Associated Company Details */}
                    {visibleAssociatedDetails && (
                        <div className="mt-6 pt-4 border-t dark:border-gray-600">
                            <p className="text-xs text-gray-500">Company Name</p>
                            <h3 className="text-lg font-semibold dark:text-white">
                                {userAssociatedDetails?.name?.value || "No Company Name"}
                            </h3>

                            <div className="">
                                <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4 gap-2 text-xs dark:text-white transition-all mt-2 duration-500">
                                    {visibleAssociatedDetails.map(([key, value]) => (
                                        <div key={key} className="flex flex-col items-start gap-1 text-xs">
                                            <span className="font-semibold">{value?.label}:</span>
                                            {renderCellContent(false, value?.value, value)}
                                        </div>
                                    ))}
                                </div>

                                {sortedAssociatedDetails.length > 4 && (
                                    <Button
                                        variant="link"
                                        size="link"
                                        onClick={() => setShowMoreAssociated(!showMoreAssociated)}
                                        className="font-medium mt-2 text-xs"
                                    >
                                        {showMoreAssociated ? "Show Less" : "Show More"}
                                    </Button>
                                )}
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};
