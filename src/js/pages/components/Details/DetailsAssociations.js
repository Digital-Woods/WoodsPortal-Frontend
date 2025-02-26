const DetailsAssociations = ({
  key,
  association,
  isActive,
  parentObjectTypeId,
  parentObjectRowId,
  parentObjectTypeName,
  refetch,
  objectId,
  id,
  companyAsMediator = false,
  urlParam
}) => {
  const mediatorObjectTypeId = getParam("mediatorObjectTypeId");
  const mediatorObjectRecordId = getParam("mediatorObjectRecordId");
  const [permissions, setPermissions] = useState(association.configurations["object"]);
  const [showAddDialog, setShowAddDialog] = useState(false);
  const hubspotObjectTypeId = association.objectTypeId;
  const param = `parentObjectTypeId=${parentObjectTypeId}&parentObjectRecordId=${parentObjectRowId}&mediatorObjectTypeId=${mediatorObjectTypeId || parentObjectTypeId
  }&mediatorObjectRecordId=${mediatorObjectRecordId || parentObjectRowId}&${urlParam.replace(/^\?/, "")}`;
  const portalId = getPortal()?.portalId

  const associationApis = {
    tableAPI: `/api/${hubId}/${portalId}/hubspot-object-data/${hubspotObjectTypeId}${param}`,
    stagesAPI: `/api/${hubId}/${portalId}/hubspot-object-pipelines/${hubspotObjectTypeId}/`, // concat pipelineId
    formAPI: `/api/${hubId}/${portalId}/hubspot-object-forms/${hubspotObjectTypeId}/fields`,
    formDataAPI: `/api/${hubId}/${portalId}/hubspot-object-data/${hubspotObjectTypeId}/:objectId${param + "&isForm=true"}`,
    createAPI: `/api/${hubId}/${portalId}/hubspot-object-forms/${hubspotObjectTypeId}/fields`,
    updateAPI: `/api/${hubId}/${portalId}/hubspot-object-forms/${hubspotObjectTypeId}/fields/:formId${param}`,
  };

  // setPermissions(data.configurations["object"]);
  return (
    <React.Fragment>
      <Accordion
        className="mb-0 rounded-md mb-4 last:mb-0 md:mb-3 !text-rstextcolor"
        isActive={isActive}
      >
        <AccordionSummary>
          <div className="flex items-center justify-between w-full text-sm font-medium">
            {/* <span className="text-secondary">
            <AssociationIcon />
          </span> */}

            <Link
              className="font-bold border-input rounded-md text-xs dark:text-white whitespace-nowrap"
              to={`/association/${association.labels.plural}?parentObjectTypeId=${parentObjectTypeId}&parentObjectRecordId=${parentObjectRowId}&objectTypeName=${association.labels.plural
                }&objectTypeId=${association.objectTypeId
                }&parentObjectTypeName=${parentObjectTypeName}&mediatorObjectTypeId=${mediatorObjectTypeId ? mediatorObjectTypeId : parentObjectTypeId
                }&mediatorObjectRecordId=${mediatorObjectRecordId
                  ? mediatorObjectRecordId
                  : parentObjectRowId
                }&isPrimaryCompany=${companyAsMediator}`}
            >
              <span>
                <span className="text-secondary  hover:underline underline-offset-4  dark:text-white">
                  {association.labels.plural}
                </span>
                <span className="ml-2 px-2 py-1 rounded-md bg-secondary dark:bg-white dark:text-dark-300 text-white text-xs">
                  {association.total}
                </span>
              </span>
            </Link>
            {(permissions?.create) && (
              <div className="text-end cursor-pointer ">
                <Button className='font-semibold text-xs' variant="link" size='link' onClick={() => setShowAddDialog(true)}>
                  <span className="mr-1">
                    <IconPlus className="!w-3 !h-3" />
                  </span>
                  Add
                </Button>
              </div>
            )}
          </div>
        </AccordionSummary>

        <AccordionDetails>
          <div className="flex flex-col py-2">
            {association.total === 0 ? (
              <div className="p-2 dark:bg-[#3e3e3e] bg-rscardbackhround rounded-md text-xs font-semibold dark:text-white">
                See the {association.labels.plural} associated with this record.
              </div>
            ) : (
              association.data &&
              association.data.length > 0 && (
                <div className=" rounded-md  text-rstextcolor dark:text-white">
                  {association.data.map((item, index) => (
                    <div key={index} className="mb-2">
                      <div className="border dark:border-gray-600 p-2 rounded-md bg-rscardbackhround dark:bg-dark-500 overflow-y-auto hide-scrollbar">
                        <table className="!bg-transparent text-rstextcolor">
                          {item &&
                            sortData(item, "associations").map((value, index) => (
                              <tr key={value.key}>
                                <td className="!pr-1 text-xs !px-[2px] odd:!py-2 even:!py-0  text-rstextcolor whitespace-wrap md:w-[90px] w-[80px]  align-center dark:text-white">
                                  {value.label}:
                                </td>
                                <td className="!pl-1 text-xs !px-[2px] odd:!py-2 even:!py-0  text-rstextcolor align-center dark:text-white">
                                  {value?.isEditableField && association?.configurations?.object?.update ? (
                                    <DetailsViewUpdate
                                      renderValue={renderCellContent(
                                        {
                                          companyAsMediator: companyAsMediator,
                                          value: value.value,
                                          column: value,
                                          itemId: item.hs_object_id.value,
                                          path: `/${association.labels.plural}`,
                                          hubspotObjectTypeId: association.objectTypeId,
                                          type: "associations",
                                          associationPath: value.isPrimaryDisplayProperty
                                            ? `/${setParamHash(
                                              replaceQuestionMarkToRegex(
                                                isObject(value.value) &&
                                                  value.value.label
                                                  ? value.value.label
                                                  : value.value
                                              )
                                            )}/${association.objectTypeId}/${item.hs_object_id.value
                                            }?parentObjectTypeId=${parentObjectTypeId}&parentObjectRecordId=${parentObjectRowId}&mediatorObjectTypeId=${mediatorObjectTypeId
                                              ? mediatorObjectTypeId
                                              : parentObjectTypeId
                                            }&mediatorObjectRecordId=${mediatorObjectRecordId
                                              ? mediatorObjectRecordId
                                              : parentObjectRowId
                                            }&isPrimaryCompany=${companyAsMediator}`
                                            : "",
                                          detailsView: null,
                                          hoverRow: null,
                                          item: null,
                                          urlParam: null,
                                        }
                                      )}
                                      value={value}
                                      refetch={refetch}
                                      id={item.hs_object_id.value}
                                      objectId={association.objectTypeId}
                                      item={item}
                                    />
                                  ) : (
                                    renderCellContent(
                                      {
                                        companyAsMediator: companyAsMediator,
                                        value: value.value,
                                        column: value,
                                        itemId: item.hs_object_id.value,
                                        path: `/${association.labels.plural}`,
                                        hubspotObjectTypeId: association.objectTypeId,
                                        type: "associations",
                                        associationPath: value.isPrimaryDisplayProperty
                                          ? `/${setParamHash(
                                            isObject(value.value) &&
                                              value.value.label
                                              ? value.value.label
                                              : value.value
                                          )}/${association.objectTypeId}/${item.hs_object_id.value
                                          }?parentObjectTypeId=${parentObjectTypeId}&parentObjectRecordId=${parentObjectRowId}&mediatorObjectTypeId=${mediatorObjectTypeId
                                            ? mediatorObjectTypeId
                                            : parentObjectTypeId
                                          }&mediatorObjectRecordId=${mediatorObjectRecordId
                                            ? mediatorObjectRecordId
                                            : parentObjectRowId
                                          }&isPrimaryCompany=${companyAsMediator}`
                                          : "",
                                        detailsView: null,
                                        hoverRow: null,
                                        item: null,
                                        urlParam: null,
                                      }
                                    )
                                  )}
                                </td>
                              </tr>
                            ))}
                        </table>
                      </div>
                    </div>
                  ))}
                </div>
              )
            )}
          </div>
          {/* {association.hasMore && */}
          <div className="text-right mb-2">
            <Link
              className="text-secondary hover:underline font-bold border-input rounded-md text-xs dark:text-white whitespace-nowrap"
              to={`/association/${association.labels.plural}?parentObjectTypeId=${parentObjectTypeId}&parentObjectRecordId=${parentObjectRowId}&objectTypeName=${association.labels.plural
                }&objectTypeId=${association.objectTypeId
                }&parentObjectTypeName=${parentObjectTypeName}&mediatorObjectTypeId=${mediatorObjectTypeId ? mediatorObjectTypeId : parentObjectTypeId
                }&mediatorObjectRecordId=${mediatorObjectRecordId
                  ? mediatorObjectRecordId
                  : parentObjectRowId
                }&isPrimaryCompany=${companyAsMediator}`}
            >
              View associated {association.labels.plural}
            </Link>
          </div>
          {/* } */}
        </AccordionDetails>
      </Accordion>
      {showAddDialog && <DashboardTableForm openModal={showAddDialog} setOpenModal={setShowAddDialog} title={association.labels.singular} path={association.labels.plural} portalId={portalId} hubspotObjectTypeId={hubspotObjectTypeId} apis={associationApis} urlParam={param} />}
    </React.Fragment>
  );
};
