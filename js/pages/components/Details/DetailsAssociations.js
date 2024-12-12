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
}) => {
  const mediatorObjectTypeId = getParam("mediatorObjectTypeId");
  const mediatorObjectRecordId = getParam("mediatorObjectRecordId");
  return (
    <Accordion className="mb-0 rounded-md mb-4 last:mb-0 md:mb-3" isActive={isActive}>
      <AccordionSummary>
        <div className="flex items-center gap-x-2 text-sm font-medium">
          <span>
            <AssociationIcon />
          </span>
          <span>
            <span className="dark:text-white">{association.labels.plural}</span>
            <span className="ml-2 px-2 py-1 rounded-md bg-lightblue text-white text-xs">
              {association.total}
            </span>
          </span>
        </div>
      </AccordionSummary>

      <AccordionDetails>
        <div className="flex flex-col py-2">
          {association.total === 0 ? (
            <div className="p-2 dark:bg-[#3e3e3e] bg-white rounded-md text-xs font-semibold dark:text-white">
              See the {association.labels.plural} associated with this record.
            </div>
          ) : (
            association.data &&
            association.data.length > 0 && (
              <div className=" rounded-md dark:text-white">
                {association.data.map((item, index) => (
                  <div key={index} className="mb-2">
                    <div className="border dark:border-gray-600 p-2 rounded-md shadow-sm bg-white dark:bg-dark-500 overflow-hidden">
                      <table className="dark:bg-[#3e3e3e] bg-white">
                        {item &&
                          sortData(item, "associations").map((value, index) => (
                            <tr key={value.key}>
                              <td className="pr-1 text-xs !px-[2px] whitespace-wrap md:w-[130px] w-[110px]  align-top dark:text-white">
                                {value.label}:
                              </td>
                              <td className="pl-1 text-xs !px-[2px] text-gray-500 align-top dark:text-white">
                                {value.isEditableField ? (
                                  <DetailsViewUpdate
                                    renderValue={renderCellContent(
                                      value.value,
                                      value,
                                      item.hs_object_id.value,
                                      `/${association.labels.plural}`,
                                      association.objectTypeId,
                                      "associations",
                                      value.isPrimaryDisplayProperty
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
                                        }`
                                        : ""
                                    )}
                                    value={value}
                                    refetch={refetch}
                                    id={item.hs_object_id.value}
                                    objectId={association.objectTypeId}
                                    item={item}
                                  />
                                ) : (
                                  renderCellContent(
                                    value.value,
                                    value,
                                    item.hs_object_id.value,
                                    `/${association.labels.plural}`,
                                    association.objectTypeId,
                                    "associations",
                                    value.isPrimaryDisplayProperty
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
                                      }`
                                      : ""
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
            className="text-lightblue font-bold border-input rounded-md text-xs dark:text-white whitespace-nowrap"
            to={`/${"association"}?parentObjectTypeId=${parentObjectTypeId}&parentObjectRecordId=${parentObjectRowId}&objectTypeName=${association.labels.plural
              }&objectTypeId=${association.objectTypeId
              }&parentObjectTypeName=${parentObjectTypeName}&mediatorObjectTypeId=${mediatorObjectTypeId ? mediatorObjectTypeId : parentObjectTypeId
              }&mediatorObjectRecordId=${mediatorObjectRecordId
                ? mediatorObjectRecordId
                : parentObjectRowId
              }`}
          >
            View associated {association.labels.plural}
          </Link>
        </div>
        {/* } */}
      </AccordionDetails>
    </Accordion>
  );
};
