const DetailsAssociations = ({ association }) => {
  return (
    <Accordion className="mb-0 rounded-none">
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
            {association.label}
            <span className="ml-2 px-2 py-1 rounded-md bg-lightblue text-white text-xs">
              {association.count}
            </span>
          </span>
        </div>
      </AccordionSummary>

      <AccordionDetails>
        <div className="flex flex-col py-2">
          {association.count === 0 ? (
            <div className="p-2 dark:bg-dark-300 bg-white rounded-md text-xs font-semibold dark:text-white">
              See the Equipment associated with this record.
            </div>
          ) : (
            association.list &&
            association.list.length > 0 && (
              <div className="px-2 dark:bg-dark-300 bg-white rounded-md dark:text-white">
                {association.list.map((item, index) => (
                  <div
                    key={index}
                    className="mb-2 border dark:border-gray-600 p-2 rounded-md shadow-sm bg-white dark:bg-dark-500"
                  >
                    {sortData(item, "associations", association.label).map((row) => (
                      <div key={row.name} className="py-2 flex">
                        <div className="text-xs font-semibold w-[100px]">
                          {row.label}:
                        </div>
                        <div className="text-xs text-gray-500 flex-1">
                          {renderCellContent(
                            item[row.name],
                            item.id,
                            `/${association.featureName}`
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                ))}
              </div>
            )
          )}
        </div>
      </AccordionDetails>
    </Accordion>
  );
};