import { CautionCircle } from "@/assets/icons/CautionCircle";
import { IframeIcon } from "@/assets/icons/IframeIcon";
import { OpenIcon } from "@/assets/icons/OpenIcon";
import { useSync } from "@/state/use-sync";
import { useState, useEffect } from "react";
import { Button } from "./Button";
import { IframeViewDialog } from "./IframeViewDialog";
import { HomeCompanyCardSkeleton } from "./skeletons/HomeCompanyCardSkeleton";

export const HomeCompanyCard = ({ companyDetailsModalOption, userData, isLoading, isLoadedFirstTime, propertiesList, iframePropertyName, className, usedInDynamicComponent = false, viewStyle }: any) => {
    const [userAssociatedDetails, setUserAssociatedDetails] = useState({});
    const [userAssociatedDetailsModal, setUserAssociatedDetailsModal] = useState({});
    const [openModal, setOpenModal] = useState(false);
    const [expandDialog, setExpandDialog] = useState(false);
    const { sync, setSync } = useSync();
    const [iframeViewDialog, setIframeViewDialog] = useState(false);
    const [iframeUrls, setIframeUrls] = useState([]);
    const [currentIframeIndex, setCurrentIframeIndex] = useState(0);

    // Process the propertiesList to filter and organize data
    const processProperties = (propertiesList: any, data: any) => {
        if (!propertiesList || !Array.isArray(propertiesList)) return {};

        const result: any = {};

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

    const getDisplayType = (key: any) => {
        const setting = iframeSettings.find(setting => setting.properties_value === key);
        // Return the display type, default to 'simpleText' if not specified
        return setting?.property_value_show_as || 'simpleText';
    };

    const getActionType = (key: any) => {
        const setting = iframeSettings.find(setting => setting.properties_value === key);
        // Return the display type, default to 'simpleText' if not specified
        return setting?.on_click_action || 'showIframe';
    };

    // const isIframeEnabled = (key) => {
    //     const displayType = getDisplayType(key);
    //     return displayType === 'iframe';
    // };

    const isButtonEnabled = (key: any) => {
        const displayType = getDisplayType(key);
        return displayType === 'button';
    };

    const isLinkEnabled = (key: any) => {
        const displayType = getDisplayType(key);
        return displayType === 'link';
    };

    const isValidUrl = (url: any) => {
        try {
            new URL(url);
            return true;
        } catch (e) {
            return false;
        }
    };

    const getPropertyValueType = (key: any, value = '') => {
        const setting = iframeSettings.find(setting => setting.properties_value === key);
        const displayType = getDisplayType(key);
        const actionType = getActionType(key);
        if (!value) {
            return "--";
        }

        // if (displayType === 'iframe') {
        //     // return setting?.iframe_button_name || 'View';
        //     return (
        //         <span className="text-sm dark:text-white ">
        //             {value ? (
        //                 <Button
        //                     className=""
        //                     size="xsm"
        //                     onClick={() => handleViewClick(value)}
        //                 >
        //                     {setting?.iframe_button_name || view}
        //                 </Button>
        //             ) : (
        //                 "--"
        //             )}
        //         </span>
        //     );
        // }

        if (displayType === 'button') {
            const isValid = isValidUrl(value);
            return (
                <span className="text-sm dark:text-white">
                    {actionType === 'showIframe' ? (
                        <Button
                            className=" break-all"
                            size="xsm"
                            onClick={() => handleViewClick(value)}
                        >
                            {setting?.button_name || 'View'}
                        </Button>
                    ) : (
                        isValid ? (
                            <Button className="" size="xsm">
                                <a target="_blank" href={value} rel="noopener noreferrer" className=" break-all">
                                    {setting?.button_name || 'View'}
                                </a>
                            </Button>
                        ) : (
                            <div className="dark:text-white flex gap-1 relative items-center">
                                <span className="text-yellow-600">
                                    <CautionCircle width='14px' height='14px' />
                                </span>
                                <span className="text-red-700 text-xs">Please add a valid link</span>
                            </div>
                        )
                    )}
                </span>
            );
        }

        if (displayType === 'link') {
            const isValid = isValidUrl(value);
            return (
                <span className="text-sm dark:text-white">
                    {
                        actionType === 'showIframe' ? (
                            <span
                                className="text-secondary text-xs dark:text-white flex gap-1 relative items-center cursor-pointer break-all hover:underline"
                                onClick={() => handleViewClick(value)}
                            >
                                {value} <IframeIcon />
                            </span>
                        ) : (
                            isValid ? (
                                <a
                                    target="_blank"
                                    href={value}
                                    rel="noopener noreferrer"
                                    className="text-secondary text-xs dark:text-white flex gap-1 relative items-center break-all"
                                >
                                    {value} <OpenIcon />
                                </a>
                            ) : (
                                <div className="dark:text-white flex gap-1 relative items-center">
                                    <span className="text-yellow-600">
                                        <CautionCircle width='14px' height='14px' />
                                    </span>
                                    <span className="text-red-700 text-xs">Please add a valid link</span>
                                </div>

                            )
                        )}
                </span>
            );
        }

        return null;
    };

    const isImageUrl = (url: any) => {
        const imageExtensions = [".jpg", ".jpeg", ".png", ".gif", ".bmp", ".webp"];
        const hasImageExtension = imageExtensions.some((ext) =>
            url.toLowerCase()?.endsWith(ext)
        );
        const containsImagePattern =
            url.includes("images.unsplash.com") || url.includes("photo");
        return hasImageExtension || containsImagePattern;
    };

    const handleViewClick = (urls: any) => {
        const urlArray = urls.split(",").map((url: any) => url.trim());
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
                    <div className={`grid ${viewStyle != 'list' ? 'grid-cols-2' : 'grid-cols-1'}  gap-2 relative z-[2] text-xs dark:text-white transition-all duration-500 md:pb-4 pb-3 md:px-4 px-3 ${className}`}>
                        {/* {companyDetailsModalOption ? (
                            <button onClick={() => setOpenModal(true)} className="absolute right-2 top-2 z-[4] p-3 rounded-full overflow-hidden">
                                <div className="bg-secondary dark:bg-white opacity-20 absolute top-0 right-0 left-0 bottom-0"></div>
                                <span className="text-secondary dark:text-white inline-block -rotate-45">
                                    <Arrow />
                                </span>
                            </button>
                        ) : null} */}
                        {Object.entries(visibleAssociatedDetails).map(([key, value]: any) => {
                            if (isButtonEnabled(key)) {
                                return (
                                    <div key={key} className={`flex ${viewStyle == 'list' ? 'flex-row items-center' : 'flex-col items-start'} gap-2 text-xs`}>
                                        <span className="font-semibold">{value?.label}:</span>
                                        {value?.value ? (
                                            getPropertyValueType(key, value?.value)
                                        ) : (
                                            "--"
                                        )}
                                    </div>
                                );
                            }
                            else if (isLinkEnabled(key)) {
                                return (
                                    <div key={key} className={`flex ${viewStyle == 'list' ? 'flex-row items-center' : 'flex-col items-start'} gap-2 text-xs`}>
                                        <span className="font-semibold">{value?.label}:</span>
                                        {value?.value ? (
                                            getPropertyValueType(key, value?.value)
                                        ) : (
                                            "--"
                                        )}
                                    </div>
                                );
                            }
                            else {
                                return (
                                    <div key={key} className={`flex ${viewStyle == 'list' ? 'flex-row items-center' : 'flex-col items-start'} gap-2 text-xs`}>
                                        <span className="font-semibold">{value?.label}:</span>
                                        <span className=" break-all">
                                            {value?.value ? (
                                             value?.value
                                            ) : (
                                                "--"
                                            )}
                                        </span>
                                    </div>
                                );
                            }
                        })}
                    </div>
                </div>
            )}
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