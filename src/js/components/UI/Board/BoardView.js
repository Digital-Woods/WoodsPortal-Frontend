const BoardView = ({
  hubspotObjectTypeId,
  activeCardData,
  // activePipeline,
  isLoadingPipelines,
  urlParam,
  companyAsMediator,
  getData,
  // setAfter,
  // currentPage,
  // setCurrentPage,
  // setItemsPerPage,
  // itemsPerPage,
  isLoading,
  path,
  viewName,
  detailsView,
  detailsUrl
}) => {

  const {
    setPage,
    setAfter,
    limit,
    setLimit,
    selectedPipeline
  } = useTable();


  // console.log('TrelloCards', true)
  const { gridData: data, setGridData: setData } = useTable();

  let portalId;
  if (env.DATA_SOURCE_SET != true) {
    portalId = getPortal()?.portalId;
  }

  //Declaring
  const DragContext = createContext();

  // drag context component
  function Drag({ draggable = true, handleDrop, children }) {
    const [dragType, setDragType] = useState(null); // if multiple types of drag item
    const [dragItem, setDragItem] = useState(null); // the item being dragged
    const [isDragging, setIsDragging] = useState(null);
    const [drop, setDrop] = useState(null); // the active dropzone

    useEffect(() => {
      if (dragItem) {
        document.body.style.cursor = "grabbing";
      } else {
        document.body.style.cursor = "default";
      }
    }, [dragItem]);

    const dragStart = function (e, dragId, dragType) {
      e.stopPropagation();
      e.dataTransfer.effectAllowed = "move";
      setDragItem(dragId);
      setDragType(dragType);
    };

    const drag = function (e, dragId, dragType) {
      e.stopPropagation();
      setIsDragging(true);
    };

    const dragEnd = function (e) {
      setDragItem(null);
      setDragType(null);
      setIsDragging(false);
      setDrop(null);
    };

    const onDrop = function (e) {
      e.preventDefault();
      handleDrop({ dragItem, dragType, drop });
      setDragItem(null);
      setDragType(null);
      setIsDragging(false);
      setDrop(null);
    };

    let contextData = {
      draggable,
      dragItem,
      dragType,
      isDragging,
      dragStart,
      drag,
      dragEnd,
      drop,
      setDrop,
      onDrop,
    };

    return (
      <DragContext.Provider value={contextData}>
        {typeof children === "function"
          ? children({ activeItem: dragItem, activeType: dragType, isDragging })
          : children}
      </DragContext.Provider>
    );
  }

  // a draggable item
  Drag.DragItem = function ({ as, dragId, dragType, ...props }) {
    const { draggable, dragStart, drag, dragEnd, dragItem } =
      useContext(DragContext);

    let Component = as || "div";
    return (
      <Component
        onDragStart={(e) => dragStart(e, dragId, dragType)}
        onDrag={drag}
        draggable={draggable}
        onDragEnd={dragEnd}
        {...props}
      />
    );
  };

  // listens for drags over drop zones
  Drag.DropZone = function ({
    as,
    dropId,
    dropType,
    remember,
    children,
    style,
    ...props
  }) {
    const { dragItem, dragType, setDrop, drop, onDrop } =
      useContext(DragContext);

    function handleDragOver(e) {
      if (e.preventDefault) {
        e.preventDefault();
      }
      return false;
    }

    function handleLeave() {
      if (!remember) {
        setDrop(null);
      }
    }

    let Component = as || "div";
    return (
      <Component
        onDragEnter={(e) =>
          dragItem && dropType === dragType && setDrop(dropId)
        }
        onDragOver={handleDragOver}
        onDrop={onDrop}
        {...props}
      >
        {children}
        {drop === dropId && (
          <div className="absolute inset-[0px]" onDragLeave={handleLeave}></div>
        )}
      </Component>
    );
  };

  // if we need multiple dropzones
  Drag.DropZones = function ({
    dropType,
    prevId,
    nextId,
    split = "y",
    remember,
    children,
    ...props
  }) {
    const { dragType, isDragging } = useContext(DragContext);
    return (
      <div {...props}>
        {children}
        {dragType === dropType && isDragging && (
          <div
            className={`absolute inset-[0px] flex ${
              split === "x" ? "flex-row" : "flex-column"
            }`}
          >
            <Drag.DropZone
              dropId={prevId}
              className="w-full h-full"
              dropType={dropType}
              remember={remember}
            />
            <Drag.DropZone
              dropId={nextId}
              className="w-full h-full"
              dropType={dropType}
              remember={remember}
            />
          </div>
        )}
      </div>
    );
  };

  // indicates where the drop will go when dragging over a dropzone
  Drag.DropGuide = function ({ as, dropId, dropType, ...props }) {
    const { drop, dragType } = useContext(DragContext);
    let Component = as || "div";
    return dragType === dropType && drop === dropId ? (
      <Component {...props} />
    ) : null;
  };

  // Trello Cards Starts Here

  function Card({ dragItem, item, columns }) {
    const mUrlParam = Object.fromEntries(
      Object.entries(urlParam || {}).filter(([key]) => key !== "cache" && key !== "limit")
    );
    const mediatorObjectTypeId = getParam("mediatorObjectTypeId");
    const mediatorObjectRecordId = getParam("mediatorObjectRecordId");
    const objectTypeId = getParam("objectTypeId");
    const isPrimaryCompany = getParam("isPrimaryCompany");
    const parentObjectTypeId = getParam("parentObjectTypeId");
    const parentObjectRecordId = getParam("parentObjectRecordId");
    return (
      <div
        className={`text-sm rounded-md bg-white border border-gray-300  dark:border-gray-600 shadow-sm p-3 mx-3 my-2 dark:bg-dark-300 dark:text-white ${
          dragItem ? " rotate-6" : ""
        }`}
      >
        {columns.map((column) => (
          <div>
            {renderCellContent({
              companyAsMediator: companyAsMediator,
              value: item[column.key],
              column: column,
              itemId: item?.hs_object_id,
              path: path == "/association" ? `/${getParam("objectTypeName")}` : item[column.key],
              hubspotObjectTypeId: path == "/association" ? getParam("objectTypeId") : hubspotObjectTypeId,
              type: "list",
              associationPath: viewName === "ticket" ? `/${item[column.key]}/${env.HUBSPOT_DEFAULT_OBJECT_IDS.tickets}/${item.hs_object_id}${detailsUrl}` : (path == "/association" ? `/${item[column.key]}/${objectTypeId}/${item.hs_object_id}?parentObjectTypeId=${parentObjectTypeId}&parentObjectRecordId=${parentObjectRecordId}&mediatorObjectTypeId=${mediatorObjectTypeId}&mediatorObjectRecordId=${mediatorObjectRecordId}&isPrimaryCompany=${isPrimaryCompany}` : ""),
              detailsView: detailsView,
              hoverRow: null,
              item: item,
              urlParam: toQueryString(mUrlParam),
            })}
          </div>
        ))}
      </div>
    );
  }

  function List({ name, dragItem, children, count }) {
    return (
      <div
        className={`w-[280px] rounded-xs whitespace-nowrap dark:text-white bg-[#f5f8fa] dark:bg-dark-500 mx-0 my-0 pb-1 shrink-0 grow-0 ${
          dragItem ? " rotate-6" : ""
        }`}
      >
        <div className="flex items-center justify-between px-3 py-2 border-b dark:border-b-gray-600 sticky top-0 z-[2] bg-[#f5f8fa] dark:bg-dark-500">
          <h2 className="font-medium text-xs my-1 uppercase text-gray-700 dark:text-white">
            {name}
          </h2>
          <span className="text-sm">{count}</span>
        </div>
        {children}
      </div>
    );
  }

  /* =============================================================

Main Component Starts Here

=================================================================*/

  const handlePageChange = async (mLimit) => {
    await setPage(1);
    await setLimit(mLimit);
    await setAfter((1 - 1) * limit);
    await getData();
  };

  useEffect(() => {
    if (activeCardData?.total > 0) {
      if (hubspotObjectTypeId == "0-3") {
        if (activeCardData?.results?.length > 0) {
          setData("deals", activeCardData?.results);
        }
      } else {
        if (activeCardData?.results?.length > 0) {
          setData("tickets", activeCardData?.results);
        }
      }
    } else {
      removeTicketsDeals();
    }
  }, [activeCardData, isLoading]);

  const { mutate: updateDealsByPipeline } = useMutation({
    mutationKey: ["updateDealsDataByPipeline"],
    mutationFn: async ({ recordId, stageId }) => {
      return await Client.Deals.updatePipelineDeal({
        API_ENDPOINT: `api/${hubId}/${portalId}/hubspot-object-forms/${hubspotObjectTypeId}/properties/${recordId}?${objectToQueryParams(
          urlParam
        )}`,
        data:
          hubspotObjectTypeId == "0-3"
            ? { pipeline: selectedPipeline, dealstage: stageId }
            : { hs_pipeline: selectedPipeline, hs_pipeline_stage: stageId },
      });
    },
    onSuccess: (resp) => {
      // getData({
      //   cache: false,
      // })
    },
    onError: () => {
      // setPipelines([]);
    },
  });

  const removeTicketsDeals = () => {
    setData("reset", []);
  };

  // handle a dropped item
  function handleDrop({ dragItem, dragType, drop }) {
    if (dragType === "card") {
      // get the drop position as numbers
      let [newListPosition, newCardPosition] = drop
        .split("-")
        .map((string) => parseInt(string));
      let stageId = data[newListPosition].id;
      let recordId = dragItem;

      // create a copy for the new data
      let newData = structuredClone(data); // deep clone
      // find the current positions
      let oldCardPosition;
      let oldListPosition = data.findIndex((list) => {
        oldCardPosition = list.cards.findIndex((card) => card.id === dragItem);
        return oldCardPosition >= 0;
      });
      // get the card
      let card = data[oldListPosition].cards[oldCardPosition];
      // if same array and current position before drop reduce drop position by one
      if (
        newListPosition === oldListPosition &&
        oldCardPosition < newCardPosition
      ) {
        newCardPosition--; // reduce by one
      }
      // remove the card from the old position
      newData[oldListPosition].cards.splice(oldCardPosition, 1);
      // put it in the new position
      newData[newListPosition].cards.splice(newCardPosition, 0, card);
      newData[oldListPosition].count -= 1;
      newData[newListPosition].count += 1;
      newData[newListPosition].data.results.columns = newData[oldListPosition].data.results.columns;
      // update the state
      setData("directly", newData);
      // Calling Update API
      updateDealsByPipeline({ recordId, stageId });
    }
    /*
              else if (dragType === "list") {
                let newListPosition = drop;
                let oldListPosition = data.findIndex((list) => list.id === dragItem);
                // create a copy for the new data
                let newData = structuredClone(data); // deep clone
                // get the list
                let list = data[oldListPosition];
                // if current position before drop reduce drop position by one
                if (oldListPosition < newListPosition) {
                  newListPosition--; // reduce by one
                }
                // remove list from the old position
                newData.splice(oldListPosition, 1);
                // put it in the new position
                newData.splice(newListPosition, 0, list);
                // update the state
                setData(newData);
              }
            */

    //   updateDealsByPipeline(dragItem,activePipeline)
  }

  return (
    <div className="md:mb-4 mb-3 flex flex-col h-[66vh] overflow-auto relative">
      <Drag handleDrop={handleDrop}>
        {({ activeItem, activeType, isDragging }) => (
          <Drag.DropZone className="flex overflow-x-auto flex-1 self-start">
            {data.map((list, listPosition) => {
              return (
                <React.Fragment key={list.id}>
                  <Drag.DropZone
                    dropId={listPosition}
                    dropType="list"
                    remember={true}
                  >
                    <Drag.DropGuide
                      dropId={listPosition}
                      dropType="list"
                      className="rounded-md bg-gray-200 dark:bg-dark-300 h-96 mx-2 my-5 w-64 shrink-0 grow-0"
                    />
                  </Drag.DropZone>
                  <Drag.DropZones
                    className={`min-w-[280px] relative flex flex-col h-full bg-[#f5f8fa] dark:bg-dark-500 border dark:border-gray-600 overflow-y-auto hide-scrollbar
                    ${
                      listPosition === 0
                        ? "rounded-s-md border-r-1  border-l-1"
                        : "border-l-0"
                    } 
                    ${listPosition === data.length - 1 ? "rounded-e-md" : ""}`}
                    prevId={listPosition}
                    nextId={listPosition + 1}
                    dropType="list"
                    split="x"
                    remember={true}
                  >
                    <Drag.DragItem
                      // dragId={list.id}
                      // className={`cursor-pointer ${
                      //   activeItem === list.id &&
                      //   activeType === "list" &&
                      //   isDragging
                      //     ? "hidden"
                      //     : "translate-x-0"
                      // }`}
                      dragType="list"
                    >
                      <List
                        count={list.count || 0}
                        name={list.name}
                        dragItem={
                          activeItem === list.id && activeType === "list"
                        }
                      >
                        {data[listPosition].cards.map((card, cardPosition) => {
                          return (
                            <Drag.DropZones
                              className="relative"
                              key={card.id}
                              prevId={`${listPosition}-${cardPosition}`}
                              nextId={`${listPosition}-${cardPosition + 1}`}
                              dropType="card"
                              remember={true}
                            >
                              <Drag.DropGuide
                                dropId={`${listPosition}-${cardPosition}`}
                                className="rounded-md bg-gray-200 dark:bg-dark-300 h-24 m-2"
                                dropType="card"
                              />
                              <Drag.DragItem
                                dragId={card.id}
                                className={`cursor-pointer ${
                                  activeItem === card.id &&
                                  activeType === "card" &&
                                  isDragging
                                    ? "hidden"
                                    : "translate-x-0"
                                }`}
                                dragType="card"
                              >
                                <Card
                                  dragItem={
                                    activeItem === card?.id &&
                                    activeType === "card"
                                  }
                                  item={card}
                                  columns={list?.data?.results?.columns || []}
                                />
                              </Drag.DragItem>
                            </Drag.DropZones>
                          );
                        })}
                        <Drag.DropZone
                          dropId={`${listPosition}-${data[listPosition].cards.length}`}
                          dropType="card"
                          remember={true}
                        >
                          <Drag.DropGuide
                            dropId={`${listPosition}-${data[listPosition].cards.length}`}
                            className="rounded-md bg-gray-200 dark:bg-dark-300 h-24 m-2"
                            dropType="card"
                          />
                        </Drag.DropZone>
                      </List>
                    </Drag.DragItem>
                    <Drag.DropZone
                      dropId={`${listPosition}-${data[listPosition].cards.length}`}
                      className="grow"
                      dropType="card"
                      remember={true}
                    />
                    {data[listPosition]?.data?.hasMore ? (
                      <div className="bg-[#f5f8fa] dark:bg-dark-500 flex items-center justify-center p-2 sticky bottom-0">
                        <Button
                          onClick={() => handlePageChange(limit + 10)}
                          size="sm"
                          isLoading={isLoading}
                        >
                          Show more
                        </Button>
                      </div>
                    ) : null}
                  </Drag.DropZones>
                </React.Fragment>
              );
            })}
            <Drag.DropZone dropId={data.length} dropType="list" remember={true}>
              <Drag.DropGuide
                dropId={data.length}
                dropType="list"
                className="rounded-md bg-gray-200 dark:bg-dark-300 h-96 mx-2 my-5 w-64 shrink-0 grow-0 bg-"
              />
            </Drag.DropZone>
          </Drag.DropZone>
        )}
      </Drag>
    </div>
  );
};
