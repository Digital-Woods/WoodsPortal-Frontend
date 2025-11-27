import { useMe } from "@/data/user";
import { moduleStylesOptions } from "@/data/hubSpotData";
import { profileInitial } from "@/utils/DataMigration";
import { useState, useEffect } from "react";
import { SkeletonLoader } from "../skeletons/SkeletonLoader";
import { useAuth } from "@/state/use-auth";

const sortProperties = (data: any) => {
    return Object.entries(data)
        .filter(([key, value]: any) => value?.label) // Exclude unwanted keys
        .sort(([, a]: any, [, b]: any) => {
            if (a?.isPrimaryDisplayProperty && !b?.isPrimaryDisplayProperty) return -1;
            if (!a?.isPrimaryDisplayProperty && b?.isPrimaryDisplayProperty) return 1;
            if (a?.isSecondaryDisplayProperty && !b?.isSecondaryDisplayProperty) return -1;
            if (!a?.isSecondaryDisplayProperty && b?.isSecondaryDisplayProperty) return 1;
            return 0;
        });
};

export const UserProfileCard = ({ userData, isLoading }: any) => {
    const [userDetails, setUserDetails] = useState<any>({});
    const [userAssociatedDetails, setUserAssociatedDetails] = useState<any>({});
    const [showMoreDetails, setShowMoreDetails] = useState<any>(false);
    const [showMoreAssociated, setShowMoreAssociated] = useState<any>(false);
    // const [iframeViewDialog, setIframeViewDialog] = useState(false);
    // const [iframeUrls, setIframeUrls] = useState([]);
    // const [currentIframeIndex, setCurrentIframeIndex] = useState(0);
    const { me, getMe } = useMe();
    const {profileDetails: loggedInDetails}: any = useAuth();

    useEffect(() => {
        if (userData?.response) {
            setUserDetails(userData?.response);
            setUserAssociatedDetails(userData.response?.associations?.COMPANY || {});
        }
    }, [userData]);

    if (isLoading) {
        return <SkeletonLoader />;
    }

    // const firstName = userDetails?.firstname?.value || "";
    // const lastName = userDetails?.lastname?.value || "";
    const firstName = getFirstName(loggedInDetails, me);
    const lastName = getLastName(loggedInDetails, me);
    const email = getEmail(loggedInDetails, me);

    function getFirstName(loggedInDetails: any, me: any) {
        if (loggedInDetails && loggedInDetails?.firstName) {
            return loggedInDetails?.firstName;
        } else if (me && me?.firstName) {
            return me.firstName;
        } else if (me && me?.email) {
            return me?.email;
        } else {
            return "";
        }
    }

    function getLastName(loggedInDetails: any, me: any) {
        if (loggedInDetails && loggedInDetails?.lastName) {
            return loggedInDetails?.lastName;
        } else if (me && me?.lastName) {
            return me.lastName;
        } else {
            return "";
        }
    }

    function getEmail(loggedInDetails: any, me: any) {
        if (loggedInDetails && loggedInDetails?.email) {
            return loggedInDetails.email;
        } else if (me && me?.email) {
            return me?.email;
        } else {
            return "";
        }
    }
    const initials = profileInitial(firstName, lastName);
    // const propertyName = companyCardIframeList.propertyName ? companyCardIframeList.propertyName.split(',') : [];
    // const showIframe = companyCardIframeList.showIframe || false;
    // Filter and sort user details
    const filteredDetails = Object.entries(userDetails).filter(
        ([key, value]: any) => value?.label && !["firstname", "lastname", "email", "company", "phone", "associations", "hs_object_id"].includes(key)
    );
    const sortedDetails = sortProperties(Object.fromEntries(filteredDetails));
    const visibleDetails = showMoreDetails ? sortedDetails : sortedDetails.slice(0, 4);

    // Filter and sort associated company details
    const filteredAssociatedDetails = Object.entries(userAssociatedDetails).filter(
        ([key, value]: any) => value?.label && !["configurations", "objectTypeId", "labels", 'name', "hs_object_id"].includes(key)
    );
    const sortedAssociatedDetails = sortProperties(Object.fromEntries(filteredAssociatedDetails));
    const visibleAssociatedDetails = showMoreAssociated ? sortedAssociatedDetails : sortedAssociatedDetails.slice(0, 4);
    // const isImageUrl = (url) => {
    //     const imageExtensions = [".jpg", ".jpeg", ".png", ".gif", ".bmp", ".webp"];

    //     // Check if the URL ends with an image extension
    //     const hasImageExtension = imageExtensions.some((ext) =>
    //         url.toLowerCase().endsWith(ext)
    //     );

    //     // Check if the URL contains known patterns for image URLs
    //     const containsImagePattern =
    //         url.includes("images.unsplash.com") || url.includes("photo");

    //     // Return true if either condition is true
    //     return hasImageExtension || containsImagePattern;
    // };
    // const handleViewClick = (urls) => {
    //     const urlArray = urls.split(",").map((url) => url.trim()); // Split and trim the comma-separated URLs
    //     setIframeUrls(urlArray);
    //     setCurrentIframeIndex(0); // Start with the first URL
    //     setIframeViewDialog(true);
    // };

    // const handleNext = () => {
    //     setCurrentIframeIndex((prevIndex) =>
    //         prevIndex < iframeUrls.length - 1 ? prevIndex + 1 : prevIndex
    //     );
    // };

    // const handlePrevious = () => {
    //     setCurrentIframeIndex((prevIndex) =>
    //         prevIndex > 0 ? prevIndex - 1 : prevIndex
    //     );
    // };

    return (
        <div>
            <div className="flex max-sm:flex-col items-start gap-8 w-full mx-auto p-6 rounded-lg border dark:border-none dark:bg-dark-300 relative overflow-hidden">
                <div className={` bg-[${moduleStylesOptions?.homeTabStyles?.overlayer?.color || '#E5F5F8'}]/${moduleStylesOptions?.homeTabStyles?.overlayer?.opacity || '100'}  dark:bg-gray-600/10 absolute top-0 right-0 left-0 h-[80px]`}></div>

                {/* Profile Initials */}
                <div className="flex items-center justify-center relative z-2">
                    <div className="rounded-full h-[80px] w-[80px] max-sm:w-[50px] max-sm:h-[50px] flex items-center justify-center bg-gray-400 text-white text-2xl font-medium">
                        {initials}
                    </div>
                </div>

                {/* User Details */}
                <div className="relative w-full z-2">
                    <div className="flex flex-col md:flex-row gap-2 pb-3">
                        <div className="flex-1">
                            <div className="text-xl font-semibold  dark:text-white dark:opacity-70 text-secondary mb-1">
                                {firstName} {lastName}
                            </div>
                            <p className="text-xs dark:text-white">
                                {email}{userDetails?.phone?.value ? ` • ${userDetails?.phone?.value}` : ''}
                            </p>
                        </div>
                    </div>

                    {/* User Info Grid */}
                    {/* <div className="">
                        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4 gap-2 text-xs dark:text-white transition-all duration-500">
                            {visibleDetails.map(([key, value]) => (
                                <div key={key} className="flex flex-col items-start gap-1 text-xs">
                                    <span className="font-semibold">{value?.label}:</span>
                                    {renderCellContent(
                                        {
                                            companyAsMediator: false,
                                            value: value?.value,
                                            column: { ...value, key },
                                            itemId: null,
                                            path: null,
                                            hubspotObjectTypeId: null,
                                            type: "details",
                                            associationPath: null,
                                            detailsView: null,
                                            hoverRow: null,
                                            item: null,
                                            urlParam: null
                                        }
                                    )}
                                </div>
                            ))}
                        </div>

                        {sortedDetails.length > 4 && (
                            <Button
                                variant="link"
                                size="link"
                                onClick={() => setShowMoreDetails(!showMoreDetails)}
                                className="font-medium mt-2 text-xs dark:text-white"
                            >
                                {showMoreDetails ? "Show Less" : "Show More"}
                            </Button>
                        )}
                    </div> */}

                    {/* Associated Company Details */}
                    {visibleAssociatedDetails && (
                        <div className="">
                            <div className="text-lg font-semibold  dark:text-white dark:opacity-70 mb-0">
                                {userAssociatedDetails?.name?.value || "--"}
                            </div>

                            {/* <div className="">
                                <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4 gap-2 text-xs dark:text-white transition-all mt-2 duration-500">
                                    {(userDetails?.associations?.COMPANY?.name) ? (
                                        (visibleAssociatedDetails?.length ?? 0) > 0 ? (
                                            visibleAssociatedDetails.map(([key, value]) => (
                                                // propertyName.includes(key) && showIframe ? (
                                                //     <div key={key} className="flex flex-col items-start gap-1 text-xs">
                                                //         <span className="font-semibold">
                                                //             {value?.label}:
                                                //         </span>
                                                //         <span className="text-sm dark:text-white ">
                                                //             {value?.value ? (
                                                //                 <Button
                                                //                     className=""
                                                //                     variant="outline"
                                                //                     size="xsm"
                                                //                     onClick={() => handleViewClick(value?.value)}
                                                //                 >
                                                //                     View {value?.label}
                                                //                 </Button>
                                                //             ) : (
                                                //                 "--"
                                                //             )}
                                                //         </span>
                                                //     </div>
                                                // ) : (
                                                    <div key={key} className="flex flex-col items-start gap-1 text-xs">
                                                        <span className="font-semibold">{value?.label}</span>
                                                        {renderCellContent(
                                                            // false, value?.value, value
                                                            {
                                                                companyAsMediator: false,
                                                                value: value?.value,
                                                                column: { ...value, key },
                                                            }
                                                        )}
                                                    </div>
                                                // )
                                                ))
                                        ) : (
                                            <div className="text-xs dark:text-white">
                                                Please enable visibility in the admin panel for the property.
                                            </div>
                                        )
                                    ) : (
                                        <div className="text-xs dark:text-white">
                                            No primary company is currently associated with this contact.
                                        </div>
                                    )}
                                </div>

                                {sortedAssociatedDetails.length > 4 && (
                                    <Button
                                        variant="link"
                                        size="link"
                                        onClick={() => setShowMoreAssociated(!showMoreAssociated)}
                                        className="font-medium mt-2 text-xs dark-text-white"
                                    >
                                        {showMoreAssociated ? "Show Less" : "Show More"}
                                    </Button>
                                )}
                            </div> */}
                        </div>
                    )}
                </div>
            </div>
            {/* Iframe View Dialog Component */}
            {/* <IframeViewDialog
                open={iframeViewDialog}
                onClose={() => setIframeViewDialog(false)}
                iframeUrls={iframeUrls}
                currentIframeIndex={currentIframeIndex}
                handleNext={handleNext}
                handlePrevious={handlePrevious}
                isImageUrl={isImageUrl}
            /> */}
        </div>
    );
};
