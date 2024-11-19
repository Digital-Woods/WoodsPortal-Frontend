const DetailsAssociations = ({ key, association, isActive, parentObjectTypeId, parentObjectRowId, parentObjectTypeName }) => {
  const mediatorObjectTypeId = getParam("mediatorObjectTypeId")
  const mediatorObjectRecordId = getParam("mediatorObjectRecordId")
  return (
    <Accordion className="mb-0 rounded-none" isActive={isActive}>
      <AccordionSummary>
        <div className="flex items-center gap-x-2 text-sm font-medium">
          <span>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              height="20px"
              viewBox="0 -960 960 960"
              width="20px"
              className="dark:fill-white fill-black"
            >
              <path d="M140-100v-240h120v-160h200v-120H340v-240h280v240H500v120h200v160h120v240H540v-240h120v-120H300v120h120v240H140Zm240-560h200v-160H380v160ZM180-140h200v-160H180v160Zm400 0h200v-160H580v160ZM480-660ZM380-300Zm200 0Z" />
            </svg>
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
            <div className="p-2 dark:bg-[#3e3e3e] rounded-md text-xs font-semibold dark:text-white">
              See the {association.labels.plural} associated with this record.
            </div>
          ) : (
            association.data &&
            association.data.length > 0 && (
              <div className=" rounded-md dark:text-white">
                {association.data.map((item, index) => (
                  <div
                    key={index}
                    className="mb-2"
                  >
                    <div
                      className="border dark:border-gray-600 p-2 rounded-md shadow-sm bg-white dark:bg-dark-500"
                    >
                      <table className="dark:bg-[#3e3e3e]">
                        {item &&
                          sortData(item, 'associations').map((value, index) => (
                            <tr key={value.key}>
                              <td className="pr-1 text-sm whitespace-nowrap align-top dark:text-white">{value.label}:</td>
                              <td className="pl-1 text-sm text-gray-500 align-top dark:text-white">{renderCellContent(
                                value.value, 
                                value, 
                                item.hs_object_id.value, 
                                `/${association.labels.plural}`, 
                                association.objectTypeId, 'associations', 
                                `/${setParamHash(isObject(value.value) ? value.value.label : value.value)}/${association.objectTypeId}/${item.hs_object_id.value}?mediatorObjectTypeId=${mediatorObjectTypeId ? mediatorObjectTypeId : parentObjectTypeId}&mediatorObjectRecordId=${mediatorObjectRecordId ? mediatorObjectRecordId : parentObjectRowId}`)}
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
        {association.hasMore &&
          <div className="text-right mb-2">
            <Link
              className="text-lightblue font-bold border-input rounded-md text-xs dark:text-white whitespace-nowrap"
              to={`/${'association'}?objectTypeName=${association.labels.plural}&objectTypeId=${association.objectTypeId}&parentObjectTypeName=${parentObjectTypeName}&mediatorObjectTypeId=${mediatorObjectTypeId ? mediatorObjectTypeId : parentObjectTypeId}&mediatorObjectRecordId=${mediatorObjectRecordId ? mediatorObjectRecordId : parentObjectRowId}`}
            >
              Show more {association.labels.plural}
            </Link>
          </div>
        }
      </AccordionDetails>
    </Accordion>
  );
};
