
const UserProfileCard = ({ userData }) => {

    const [userDetails, setUserDetails] = useState({});
    const [userAssociatedDetails, setUserAssociatedDetails] = useState({});

    useEffect(() => {
        setUserDetails(userData?.response || {});
        setUserAssociatedDetails(userData?.response?.associations?.COMPANY || {});
    }, [userData]);

    // console.log(userData, "userData");
    // console.log(userDetails, "userDetails");
    // console.log(userAssociatedDetails, "userAssociatedDetails");


    return (
        <div className=" flex max-sm:flex-col items-start gap-8 w-full  mx-auto p-6 rounded-lg shadow-md border dark:border-gray-600 relative overflow-hidden">
            <div className="bg-secondary opacity-10 absolute top-0 right-0 left-0 h-[90px]"></div>
            <div className="flex items-centre justify-center relative z-50 ">
                <div className=" rounded-full h-[100px] w-[100px] max-sm:w-[50px] max-sm:h-[50px]">
                    <img
                        src="https://plus.unsplash.com/premium_photo-1737392495759-2aace4708e48?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxmZWF0dXJlZC1waG90b3MtZmVlZHwxN3x8fGVufDB8fHx8fA%3D%3D"
                        alt="Profile"
                        className="w-full h-full object-cover rounded-full"
                    />
                </div>
            </div>
            <div className="relative w-full z-50">
                <div className="flex flex-col md:flex-row gap-4 pb-4 mb-4">
                    <div className="flex-1">
                        <h2 className="text-xl font-semibold dark:text-secondary text-secondary">{userDetails?.firstname?.value || '--'} {userDetails?.lastname?.value || '--'}</h2>
                        <p className="text-xs dark:text-white ">
                            {userDetails?.email?.value || '--'} • {userDetails?.phone?.value || '--'}
                        </p>
                    </div>
                </div>

                {/* userDetails */}
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2 text-xs dark:text-white ">
                    {userDetails ?
                        Object.entries(userDetails)
                            .filter(([key]) => !['firstname', 'lastname', 'email', 'company', 'phone', 'associations'].includes(key))
                            .map(([key, value]) =>
                                <div key={value?.key} className="flex flex-col items-start gap-1 text-xs">
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
                            ) : ''}
                </div>

                {/* userAssociatedDetails */}
                <div className="mt-6 pt-4 border-t dark:border-gray-600">
                    <p className="text-xs text-gray-500">Company Name</p>
                    <h3 className="text-lg font-semibold  dark:text-white ">{userAssociatedDetails?.name?.value || 'No Company Name'}</h3>
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2 text-xs dark:text-white  mt-2">
                        {userAssociatedDetails &&
                            Object.entries(userAssociatedDetails)
                                .filter(([key]) => !['configurations', 'objectTypeId', 'labels', 'name'].includes(key))
                                .map(([key, value]) => (
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
                </div>
            </div>
            {/* User Info Section */}
        </div >
    );
};

