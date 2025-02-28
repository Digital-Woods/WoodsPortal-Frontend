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
  urlParam,
  parentPermissions
}) => {
  const mediatorObjectTypeId = getParam("mediatorObjectTypeId");
  const mediatorObjectRecordId = getParam("mediatorObjectRecordId");
  const [permissions, setPermissions] = useState(association.configurations["object"]);
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const hubspotObjectTypeId = association.objectTypeId;
  const param = `parentObjectTypeId=${parentObjectTypeId}&parentObjectRecordId=${parentObjectRowId}&mediatorObjectTypeId=${ mediatorObjectTypeId ? mediatorObjectTypeId : parentObjectTypeId }&mediatorObjectRecordId=${mediatorObjectRecordId ? mediatorObjectRecordId : parentObjectRowId}&isPrimaryCompany=${companyAsMediator}`;
  const portalId = getPortal()?.portalId

  const associationApis = {
    tableAPI: `/api/${hubId}/${portalId}/hubspot-object-data/${hubspotObjectTypeId}${param}`,
    stagesAPI: `/api/${hubId}/${portalId}/hubspot-object-pipelines/${hubspotObjectTypeId}/`, // concat pipelineId
    formAPI: `/api/${hubId}/${portalId}/hubspot-object-forms/${hubspotObjectTypeId}/fields`,
    formDataAPI: `/api/${hubId}/${portalId}/hubspot-object-data/${hubspotObjectTypeId}/:objectId${param + "&isForm=true"}`,
    createAPI: `/api/${hubId}/${portalId}/hubspot-object-forms/${hubspotObjectTypeId}/fields`,
    updateAPI: `/api/${hubId}/${portalId}/hubspot-object-forms/${hubspotObjectTypeId}/fields/:formId${param}`,
  };
  const toggleContent = () => {
    setIsExpanded((prev) => !prev);
  };

  useEffect(() => {
    setPermissions(association.configurations["object"]);
  }, [association]);

  const viewUrl = `/association/${association.labels.plural}?parentObjectTypeId=${parentObjectTypeId}&parentObjectRecordId=${parentObjectRowId}&objectTypeName=${association.labels.plural
  }&objectTypeId=${association.objectTypeId
  }&parentObjectTypeName=${parentObjectTypeName}&mediatorObjectTypeId=${mediatorObjectTypeId ? mediatorObjectTypeId : parentObjectTypeId
  }&mediatorObjectRecordId=${mediatorObjectRecordId
    ? mediatorObjectRecordId
    : parentObjectRowId
  }&isPrimaryCompany=${companyAsMediator}`

  const setItemAsync = (key, value, days = env.COOKIE_EXPIRE) => {
    return new Promise((resolve) => {
      setCookie(key, value, days);
      resolve();
    });
  };
  setItemAsync(env.ASSOCIATION_VIEW_URL_KEY, JSON.stringify({
    name: association.labels.plural,
    path: viewUrl,
    routeName: `/association/${association.labels.plural}`})
  );

  return (
    <React.Fragment>
      <div
        className="mb-6 px-4 text-rstextcolor bg-rsbackground rounded-lg w-full max-w-md dark:bg-dark-300"
        isActive={isActive}
      >
        <div className="flex items-center justify-between w-full text-sm font-medium py-4">
          {/* <span className="text-secondary">
            <AssociationIcon />
          </span> */}
          <div className="flex items-center gap-x-2">
            <div onClick={toggleContent} className="cursor-pointer ">
              <Tooltip content={isExpanded ? 'Shrink' : 'Expand'}>
                <span className="text-secondary dark:text-white">
                  {isExpanded ? (
                    <Chevron transform="rotate(270)" />
                  ) : (
                    <Chevron transform="rotate(180)" />
                  )}
                </span>
              </Tooltip>
            </div>
            <Link
              className="font-bold border-input rounded-md text-xs dark:text-white whitespace-nowrap"
              // to={`/association/${association.labels.plural}?parentObjectTypeId=${parentObjectTypeId}&parentObjectRecordId=${parentObjectRowId}&objectTypeName=${association.labels.plural
              //   }&objectTypeId=${association.objectTypeId
              //   }&parentObjectTypeName=${parentObjectTypeName}&mediatorObjectTypeId=${mediatorObjectTypeId ? mediatorObjectTypeId : parentObjectTypeId
              //   }&mediatorObjectRecordId=${mediatorObjectRecordId
              //     ? mediatorObjectRecordId
              //     : parentObjectRowId
              //   }&isPrimaryCompany=${companyAsMediator}`}
              to={viewUrl}
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
          </div>

          {(association?.objectTypeId === "0-5"
            ? permissions?.create && parentPermissions?.ticket?.create
            : permissions?.create) && (
              <div className="text-end cursor-pointer">
                <Button
                  className="font-semibold text-xs"
                  variant="link"
                  size="link"
                  onClick={(event) => {
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

        <div className={`flex flex-col space-y-4 transition-all duration-300 ease-in-out ${isExpanded ? "max-h-auto" : "max-h-[344px] overflow-y-auto hide-scrollbar"}`}>
          {association.total === 0 ? (
            <EmptyMessageCard name={association?.labels?.plural} type='col' imgWidth='110px' className='p-4 dark:bg-[#3e3e3e] bg-rscardbackhround rounded-md text-xs font-semibold dark:text-white !mt-0' />
          ) : (
            association.data &&
            association.data.length > 0 && (
              <div className="flex-col flex lg:gap-6 gap-3 rounded-md text-rstextcolor dark:text-white">
                {association.data.map((item, index) => (
                  <div key={index} className="border dark:border-gray-600 p-2 rounded-md bg-rscardbackhround dark:bg-dark-500 overflow-y-auto hide-scrollbar">
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
                                        }&isPrimaryCompany=${companyAsMediator}&parentObjectName=${association.labels.plural}`
                                        : "",
                                      detailsView: true,
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
                                      }&isPrimaryCompany=${companyAsMediator}&parentObjectName=${association.labels.plural}`
                                      : "",
                                    detailsView: true,
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
                ))}
              </div>
            )
          )}
        </div>
        {/* {association.hasMore && */}
        <div className="text-right py-6">
          <Link
            className="text-secondary hover:underline font-bold border-input rounded-md text-xs dark:text-white whitespace-nowrap"
            // to={`/association/${association.labels.plural}?parentObjectTypeId=${parentObjectTypeId}&parentObjectRecordId=${parentObjectRowId}&objectTypeName=${association.labels.plural
            //   }&objectTypeId=${association.objectTypeId
            //   }&parentObjectTypeName=${parentObjectTypeName}&mediatorObjectTypeId=${mediatorObjectTypeId ? mediatorObjectTypeId : parentObjectTypeId
            //   }&mediatorObjectRecordId=${mediatorObjectRecordId
            //     ? mediatorObjectRecordId
            //     : parentObjectRowId
            //   }&isPrimaryCompany=${companyAsMediator}`}
            to={viewUrl}
          >
            View associated {association.labels.plural}
          </Link>
        </div>
        {/* } */}
      </div>
      {showAddDialog && <DashboardTableForm openModal={showAddDialog} setOpenModal={setShowAddDialog} title={association.labels.singular} path={association.labels.plural} portalId={portalId} hubspotObjectTypeId={hubspotObjectTypeId} apis={associationApis} urlParam={param} />}
    </React.Fragment>
  );
};
