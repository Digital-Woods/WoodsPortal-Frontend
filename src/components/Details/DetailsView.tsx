import { CautionCircle } from "@/assets/icons/CautionCircle";
import { IframeIcon } from "@/assets/icons/IframeIcon";
import { OpenIcon } from "@/assets/icons/OpenIcon";
import { renderCellContent } from "@/utils/DataMigration";
import { useState } from "react";
import { Button } from "../ui/Button";
import { IframeViewDialog } from "../ui/IframeViewDialog";
import { OverviewSkeleton } from "../ui/skeletons/OverviewSkeleton";
import { DetailsViewUpdate } from "./DetailsViewUpdate";

export const DetailsView = ({
  item,
  propertyName,
  showIframe,
  objectId,
  id,
  refetch,
  permissions,
  isLoading,
  urlParam
}: any) => {
  const [iframeViewDialog, setIframeViewDialog] = useState(false);
  const [iframeUrls, setIframeUrls] = useState([]);
  const [currentIframeIndex, setCurrentIframeIndex] = useState(0);
  const [isUpdating, setIsUpdating] = useState(false);
  const [editRowKey, setEditRowKey] = useState(null);

  const iframeSettings = Array.isArray(propertyName) ? propertyName : [];

  const getDisplayType = (key: any) => {
    const setting = iframeSettings.find(setting => setting.properties_value === key);
    return setting?.property_value_show_as || 'button';
  };

  const getActionType = (key: any) => {
    const setting = iframeSettings.find(setting => setting.properties_value === key);
    return setting?.on_click_action || 'showIframe';
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

    const isValid = isValidUrl(value);
    const buttonName = setting?.button_name || 'View';

    if (displayType === 'button') {
      return (
        <td className="py-2 pl-1 text-sm dark:text-white break-all gap-2">
          {actionType === 'showIframe' ? (
            <Button
              className="break-all"
              size="xsm"
              onClick={() => handleViewClick(value)}
            >
              {buttonName}
            </Button>
          ) : (
            isValid ? (
              <Button className="" size="xsm">
                <a
                  href={value}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="break-all"
                >
                  {buttonName}
                </a>
              </Button>
            ) : (
              <div className="dark:text-white flex gap-1 items-center">
                <span className="text-yellow-600">
                  <CautionCircle width="14px" height="14px" />
                </span>
                <span className="text-red-700 text-xs">
                  Please add a valid link
                </span>
              </div>
            )
          )}
        </td>
      );
    }

    if (displayType === 'link') {
      return (
        <td className="py-2 pl-1 text-sm dark:text-white break-all gap-2">
          {actionType === 'showIframe' ? (
            <span
              className="text-secondary text-xs dark:text-white flex gap-1 items-center cursor-pointer break-all hover:underline"
              onClick={() => handleViewClick(value)}
            >
                {value}
              <span className="inline-block w-4 h-4">
              <IframeIcon />
              </span>
            </span>
          ) : (
            isValid ? (
              <a
                href={value}
                target="_blank"
                rel="noopener noreferrer"
                className="text-secondary text-xs dark:text-white flex gap-1 items-center break-all"
              >
                {value}
                <OpenIcon />
              </a>
            ) : (
              <div className="dark:text-white flex gap-1 items-center">
                <span className="text-yellow-600">
                  <CautionCircle width="14px" height="14px" />
                </span>
                <span className="text-red-700 text-xs">
                  Please add a valid link
                </span>
              </div>
            )
          )}
        </td>
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
                // console.log(item,'item');

  if (isLoading && !item) {
    return (
      <OverviewSkeleton />
    );
  }

  return (
    <div className="dark:bg-dark-300 bg-cleanWhite rounded-md mt-5 dark:text-white overflow-hidden">
      <table className="w-full dark:bg-[#2a2a2a]">
        <tbody>
        {item?.length > 0 && item
            .filter((item: any) => !item.hidden)
            .map((value: any, index: any) => {
              const key = value.key;
              const propertyConfig = propertyName && propertyName.find((p: any) => p.properties_value === key);

              if (showIframe && propertyConfig) {
                // Show special rendering for properties in propertyName array
                return (
                  <tr key={key}>
                    <td className="py-2 pr-1 text-sm dark:text-white lg:w-[200px] w-[130px] whitespace-wrap align-top">
                      {value?.label}:
                      </td>
                    {value?.value ? (
                      getPropertyValueType(key, value?.value)
                    ) : (
                      "--"
                    )}
                  </tr>
                );
              } else {
                // Original rendering when showIframe is false
                return (
                  <tr key={value?.key}>
                    <td className="py-2 pr-1 text-sm dark:text-white lg:w-[200px] w-[130px] whitespace-wrap align-top">
                      {value?.label}:
                    </td>
                    <td className="py-2 pl-1 text-sm dark:text-white break-all gap-2">
                      {value?.isEditableField && permissions?.update ? (
                        <DetailsViewUpdate
                          renderValue={renderCellContent({
                            companyAsMediator: false,
                            value: value?.value,
                            column: value,
                            itemId: null,
                            path: null,
                            hubspotObjectTypeId: null,
                            type: 'details',
                            associationPath: null,
                            detailsView: null,
                            hoverRow: null,
                            item: item,
                            urlParam: item,
                          })}
                          value={value}
                          refetch={refetch}
                          id={id}
                          objectId={objectId}
                          item={item}
                          urlParam={urlParam}
                          isUpdating={isUpdating}
                          setIsUpdating={setIsUpdating}
                          editRowKey={editRowKey}
                          setEditRowKey={setEditRowKey}
                        />
                      ) : (
                        renderCellContent({
                          companyAsMediator: false,
                          value: value?.value,
                          column: value,
                          itemId: null,
                          path: null,
                          hubspotObjectTypeId: null,
                          type: 'details',
                          associationPath: null,
                          detailsView: null,
                          hoverRow: null,
                          item: item,
                          urlParam: null,
                        })
                      )}
                    </td>
                  </tr>
                );
              }
            })}
        </tbody>
      </table>

      {/* Iframe View Dialog Component */}
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
