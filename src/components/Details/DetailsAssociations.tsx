import { Chevron } from "@/assets/icons/Chevron";
import { IconPlus } from "@/assets/icons/IconPlus";
import { getPortal } from "@/data/client/auth-utils";
import { hubId } from "@/data/hubSpotData";
import { sortData, renderCellContent, replaceQuestionMarkToRegex, isObject, sanitizeForBase64 } from "@/utils/DataMigration";
import { getParam, setParamHash } from "@/utils/param";
import { Link } from "@tanstack/react-router";
import React, { useState, useEffect } from "react";
import { Button } from "../ui/Button";
import { EmptyMessageCard } from "../ui/EmptyMessageCard";
import { DashboardTableForm } from "../ui/Table/DashboardTableForm";
import { Tooltip } from "../ui/Tooltip";
import { DetailsViewUpdate } from "./DetailsViewUpdate";
import { useMakeLink } from "@/utils/GenerateUrl";

export const DetailsAssociations = ({
  // key,
  association = null,
  isActive,
  parentObjectTypeId,
  parentObjectRowId,
  parentObjectTypeName,
  refetch,
  // objectId,
  // id,
  companyAsMediator = false,
  // urlParam,
  parentPermissions,
  info
}: any) => {
  const [associationData, setAssociationData] = useState<any>(null);
  const mediatorObjectTypeId = getParam("mediatorObjectTypeId");
  const mediatorObjectRecordId = getParam("mediatorObjectRecordId");
  const [permissions, setPermissions] = useState<any>();
  const [showAddDialog, setShowAddDialog] = useState<any>(false);
  const [isExpanded, setIsExpanded] = useState<any>(false);
  const hubspotObjectTypeId = association?.objectTypeId;
  const param = `parentObjectTypeId=${parentObjectTypeId}&parentObjectRecordId=${parentObjectRowId}&mediatorObjectTypeId=${
    mediatorObjectTypeId ? mediatorObjectTypeId : parentObjectTypeId
  }&mediatorObjectRecordId=${
    mediatorObjectRecordId ? mediatorObjectRecordId : parentObjectRowId
  }&isPrimaryCompany=${companyAsMediator}`;
  const portalId = getPortal()?.portalId;
  const [viewUrl, setViewUrl] = useState<any>("");
  const [isUpdating, setIsUpdating] = useState<any>(false);
  const [editRowKey, setEditRowKey] = useState<any>(null);

  const associationApis = {
    tableAPI: `/api/${hubId}/${portalId}/hubspot-object-data/${hubspotObjectTypeId}${param}`,
    stagesAPI: `/api/${hubId}/${portalId}/hubspot-object-pipelines/${hubspotObjectTypeId}/`, // concat pipelineId
    formAPI: `/api/${hubId}/${portalId}/hubspot-object-forms/${hubspotObjectTypeId}/fields?${param}`,
    formDataAPI: `/api/${hubId}/${portalId}/hubspot-object-data/${hubspotObjectTypeId}/:objectId${
      param + "&isForm=true"
    }`,
    createAPI: `/api/${hubId}/${portalId}/hubspot-object-forms/${hubspotObjectTypeId}/fields`,
    createExistingAPI: `/api/${hubId}/${portalId}/hubspot-object-forms/:fromObjectTypeId/:fromRecordId/associations/:toObjectTypeId?${param}`,
    removeExistingAPI: `/api/${hubId}/${portalId}/hubspot-object-forms/:fromObjectTypeId/:fromRecordId/disassociate/:toObjectTypeId?${param}`,
    updateAPI: `/api/${hubId}/${portalId}/hubspot-object-forms/${hubspotObjectTypeId}/fields/:formId${param}`,
  };
  const toggleContent = () => {
    setIsExpanded((prev) => !prev);
  };

  useEffect(() => {
    if(association) {
      const mViewUrl = `/association/${
        association?.labels?.plural
      }?parentObjectTypeId=${parentObjectTypeId}&parentObjectRecordId=${parentObjectRowId}&objectTypeName=${
        association?.labels?.plural
      }&objectTypeId=${
        association?.objectTypeId
      }&parentObjectTypeName=${parentObjectTypeName}&mediatorObjectTypeId=${
        mediatorObjectTypeId ? mediatorObjectTypeId : parentObjectTypeId
      }&mediatorObjectRecordId=${
        mediatorObjectRecordId ? mediatorObjectRecordId : parentObjectRowId
      }&isPrimaryCompany=${companyAsMediator}`;
      
      setViewUrl(mViewUrl);
      setPermissions(association?.configurations.object);
      setAssociationData(association)
    }
  }, [association]);

  // const viewUrl = `/association/${association.labels.plural}?parentObjectTypeId=${parentObjectTypeId}&parentObjectRecordId=${parentObjectRowId}&objectTypeName=${association.labels.plural
  // }&objectTypeId=${association?.objectTypeId
  // }&parentObjectTypeName=${parentObjectTypeName}&mediatorObjectTypeId=${mediatorObjectTypeId ? mediatorObjectTypeId : parentObjectTypeId
  // }&mediatorObjectRecordId=${mediatorObjectRecordId
  //   ? mediatorObjectRecordId
  //   : parentObjectRowId
  // }&isPrimaryCompany=${companyAsMediator}`

  const refetchSetData = (response: any) => {
    if (response?.data?.data) {
      let data: any = associationData;
      let newData = response?.data?.data;
      if (data.data.length > 0) {
        data.data.unshift(newData);
      } else {
        data.data.push(newData); // If empty, just add it
      }

      // Ensure data.data length does not exceed data.limit
      if (data.data.length > data.limit) {
        data.data.pop(); // Remove last object
      }

      data.total += 1;

      setAssociationData(data);
    }
  };

  return (
    <React.Fragment>
      {associationData &&
        <div
          className="mb-6 px-4 !text-[var(--right-tables-text-color)] bg-[var(--right-tables-background-color)] rounded-lg w-full max-w-md dark:bg-dark-300"
          // isActive={isActive}
        >
          <div className="flex items-center justify-between w-full text-sm font-medium py-4">
            {/* <span className="text-secondary">
              <AssociationIcon />
            </span> */}
            <div className="flex items-center gap-x-2">
              <div onClick={toggleContent} className="cursor-pointer ">
                <Tooltip id={"toggleButton"} content={isExpanded ? "Shrink" : "Expand"}>
                  <span className="text-secondary dark:!text-white">
                    {isExpanded ? (
                      <Chevron className="rotate-[270deg] origin-center -webkit-transform" />
                    ) : (
                      <Chevron className="rotate-180 origin-center -webkit-transform" />
                    )}
                  </span>
                </Tooltip>
              </div>
              <Link
                className="font-bold border-input rounded-md text-xs dark:!text-white whitespace-nowrap"
                // to={`/association/${association.labels.plural}?parentObjectTypeId=${parentObjectTypeId}&parentObjectRecordId=${parentObjectRowId}&objectTypeName=${association.labels.plural
                //   }&objectTypeId=${association?.objectTypeId
                //   }&parentObjectTypeName=${parentObjectTypeName}&mediatorObjectTypeId=${mediatorObjectTypeId ? mediatorObjectTypeId : parentObjectTypeId
                //   }&mediatorObjectRecordId=${mediatorObjectRecordId
                //     ? mediatorObjectRecordId
                //     : parentObjectRowId
                //   }&isPrimaryCompany=${companyAsMediator}`}
                to={viewUrl}
              >
                <span>
                  <span className="text-secondary  hover:underline underline-offset-4  dark:!text-white">
                    {associationData?.labels?.plural}
                  </span>
                  <span className="ml-2 px-2 py-1 rounded-md bg-secondary dark:bg-white dark:text-dark-300 text-white text-xs">
                    {associationData?.total}
                  </span>
                </span>
              </Link>
            </div>

            {(associationData?.objectTypeId === "0-5"
              ? permissions?.create && parentPermissions?.ticket?.create
              : permissions?.create) && (
              <div className="text-end cursor-pointer">
                <Button
                  className="font-semibold text-xs"
                  variant="link"
                  size="link"
                  onClick={(event: any) => {
                    event.stopPropagation();
                    setShowAddDialog(true);
                  }}
                >
                  <span className="mr-1">
                    <IconPlus className="!w-3 !h-3" />
                  </span>
                  Add
                </Button>
              </div>
            )}
          </div>

          <div
            className={`flex flex-col space-y-4 transition-all duration-300 ease-in-out ${
              isExpanded
                ? "max-h-auto"
                : "max-h-[344px] overflow-y-auto CUSTOM-hide-scrollbar"
            }`}
          >
            {associationData.total === 0 ? (
              <EmptyMessageCard
                name={associationData?.labels?.plural}
                type="col"
                imgWidth="110px"
                className="p-6 dark:!bg-[#3e3e3e] !bg-[var(--right-tables-card-background-color)] rounded-md text-xs font-semibold dark:!text-white !mt-0"
              />
            ) : (
              associationData.data &&
              associationData.data.length > 0 && (
                <div className="flex-col flex lg:gap-6 gap-3 rounded-md !text-[var(--right-tables-text-color)] dark:!text-white">
                  {associationData.data.map((item: any, index: any) => (
                    <div
                      key={index}
                      className="border dark:border-gray-600 p-2 rounded-md !bg-[var(--right-tables-card-background-color)] dark:!bg-dark-500 overflow-y-auto CUSTOM-hide-scrollbar"
                    >
                      <table className="!bg-transparent !text-[var(--right-tables-text-color)]">
                        <tbody>
                          {item &&
                            sortData(item, "associations").map((value: any, index: any) => (
                            <tr key={index}>
                              <td className="!pr-1 text-xs !px-[2px] odd:!py-2 even:!py-0  !text-[var(--right-tables-text-color)] whitespace-wrap md:w-[90px] w-[80px]  align-center dark:!text-white">
                                {value.label}:
                              </td>
                              <td className="!pl-1 text-xs !px-[2px] odd:!py-2 even:!py-0  !text-[var(--right-tables-text-color)] align-center dark:!text-white">
                                {value?.isEditableField &&
                                associationData?.configurations?.object
                                  ?.update ? (
                                  <DetailsViewUpdate
                                    renderValue={renderCellContent({
                                      companyAsMediator: companyAsMediator,
                                      value: value.value,
                                      column: value,
                                      itemId: item.hs_object_id.value,
                                      associationLabel: associationData?.labels?.plural,
                                      path: `/${associationData?.labels?.plural}`,
                                      hubspotObjectTypeId:
                                        associationData?.objectTypeId,
                                      type: "associations",
                                      associationPath:
                                        value.isPrimaryDisplayProperty
                                          ? `/${setParamHash(
                                              replaceQuestionMarkToRegex(
                                                isObject(value.value) &&
                                                  value.value.label
                                                  ? sanitizeForBase64(value.value.label)
                                                  : sanitizeForBase64(value.value)
                                              )
                                            )}/${associationData?.objectTypeId}/${
                                              item.hs_object_id.value
                                            }?parentObjectTypeId=${parentObjectTypeId}&parentObjectRecordId=${parentObjectRowId}&mediatorObjectTypeId=${
                                              mediatorObjectTypeId
                                                ? mediatorObjectTypeId
                                                : parentObjectTypeId
                                            }&mediatorObjectRecordId=${
                                              mediatorObjectRecordId
                                                ? mediatorObjectRecordId
                                                : parentObjectRowId
                                            }&isPrimaryCompany=${companyAsMediator}&parentObjectName=${
                                              associationData?.labels?.plural
                                            }`
                                          : "",
                                      detailsView: true,
                                      hoverRow: null,
                                      item: null,
                                      urlParam: null,
                                    })}
                                    value={value}
                                    refetch={refetch}
                                    id={item.hs_object_id.value}
                                    objectId={associationData?.objectTypeId}
                                    item={item}
                                    isUpdating={isUpdating}
                                    setIsUpdating={setIsUpdating}
                                    editRowKey={editRowKey}
                                    setEditRowKey={setEditRowKey}
                                  />
                                ) : (
                                  renderCellContent({
                                    companyAsMediator: companyAsMediator,
                                    value: value.value,
                                    column: value,
                                    itemId: item.hs_object_id.value,
                                    associationLabel: associationData?.labels?.plural,
                                    path: `/${associationData?.labels?.plural}`,
                                    hubspotObjectTypeId:
                                      associationData?.objectTypeId,
                                    type: "associations",
                                    associationPath:
                                      value.isPrimaryDisplayProperty
                                        ? `/${setParamHash(
                                            isObject(value.value) &&
                                              value.value.label
                                              ? value.value.label
                                              : value.value
                                          )}/${associationData?.objectTypeId}/${
                                            item.hs_object_id.value
                                          }?parentObjectTypeId=${parentObjectTypeId}&parentObjectRecordId=${parentObjectRowId}&mediatorObjectTypeId=${
                                            mediatorObjectTypeId
                                              ? mediatorObjectTypeId
                                              : parentObjectTypeId
                                          }&mediatorObjectRecordId=${
                                            mediatorObjectRecordId
                                              ? mediatorObjectRecordId
                                              : parentObjectRowId
                                          }&isPrimaryCompany=${companyAsMediator}&parentObjectName=${
                                            associationData?.labels?.plural
                                          }`
                                        : "",
                                    detailsView: true,
                                    hoverRow: null,
                                    item: null,
                                    urlParam: null,
                                  })
                                )}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  ))}
                </div>
              )
            )}
          </div>
          {/* {association.hasMore && */}
          <div className="text-right py-4">
            <Link
              className="text-secondary hover:underline font-bold border-input rounded-md text-xs dark:!text-white whitespace-nowrap"
              // to={`/association/${association.labels.plural}?parentObjectTypeId=${parentObjectTypeId}&parentObjectRecordId=${parentObjectRowId}&objectTypeName=${association.labels.plural
              //   }&objectTypeId=${association?.objectTypeId
              //   }&parentObjectTypeName=${parentObjectTypeName}&mediatorObjectTypeId=${mediatorObjectTypeId ? mediatorObjectTypeId : parentObjectTypeId
              //   }&mediatorObjectRecordId=${mediatorObjectRecordId
              //     ? mediatorObjectRecordId
              //     : parentObjectRowId
              //   }&isPrimaryCompany=${companyAsMediator}`}
              // to={viewUrl}
              to={useMakeLink({name: associationData?.labels?.plural, objectTypeId:association?.objectTypeId, params: `?isPrimaryCompany=${companyAsMediator || false}`})}
            >
              View associated {associationData?.labels?.plural}
            </Link>
          </div>
          {/* } */}
        </div>
      }
      {showAddDialog && (
        <DashboardTableForm
          type="association"
          openModal={showAddDialog}
          setOpenModal={setShowAddDialog}
          title={associationData?.labels?.singular}
          path={associationData?.labels?.plural}
          portalId={portalId}
          hubspotObjectTypeId={hubspotObjectTypeId}
          apis={associationApis}
          urlParam={param}
          refetch={refetchSetData}
          parentObjectTypeId={parentObjectTypeId}
          parentObjectRowId={parentObjectRowId}
          info={info}
          isShowExistingRecord={association?.configurations?.object.existing_record}
        />
      )}
    </React.Fragment>
  );
};
