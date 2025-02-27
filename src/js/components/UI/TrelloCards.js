const TrelloCards = ({ hubspotObjectTypeId, getTrelloCardsData, activeCardData, pipelines, activePipeline, isLoadingPipelines, urlParam, companyAsMediator, handleCardData, currentPage, hasMoreData, stageDataCount }) => {
  // const { sync, setSync } = useSync();
  // const hubspotObjectTypeId = objectId || getParam("objectTypeId")
  //const title = "Ticket"

  // const mediatorObjectTypeId = getParam("mediatorObjectTypeId")
  //const mediatorObjectRecordId = getParam("mediatorObjectRecordId")
  // const param =  mediatorObjectTypeId && mediatorObjectRecordId ? `?mediatorObjectTypeId=${mediatorObjectTypeId}&mediatorObjectRecordId=${mediatorObjectRecordId}` : ''
  // const param =  `?parentObjectTypeId=${objectId}&parentObjectRecordId=${id}&isPrimaryCompany=${companyAsMediator}`

  let portalId;
  if (env.DATA_SOURCE_SET != true) {
    portalId = getPortal()?.portalId
  }

  // const detailsUrl = `?parentObjectTypeId=${parentObjectTypeId}&parentObjectRecordId=${parentObjectRowId}&mediatorObjectTypeId=${mediatorObjectTypeId ? mediatorObjectTypeId : parentObjectTypeId}&mediatorObjectRecordId=${mediatorObjectRecordId ? mediatorObjectRecordId : parentObjectRowId}&isForm=false&isPrimaryCompany=${companyAsMediator}`

  // const apis = {
  //   tableAPI: `/api/${hubId}/${portalId}/hubspot-object-data/${env.HUBSPOT_DEFAULT_OBJECT_IDS.tickets}?parentObjectTypeId=${parentObjectTypeId}&parentObjectRecordId=${parentObjectRowId}&mediatorObjectTypeId=${mediatorObjectTypeId ? mediatorObjectTypeId : parentObjectTypeId}&mediatorObjectRecordId=${mediatorObjectRecordId ? mediatorObjectRecordId : parentObjectRowId}&isPrimaryCompany=${companyAsMediator}`,
  //   stagesAPI: `/api/${hubId}/${portalId}/hubspot-object-pipelines/${env.HUBSPOT_DEFAULT_OBJECT_IDS.tickets}/`, // concat pipelineId
  //   formAPI: `/api/${hubId}/${portalId}/hubspot-object-forms/${env.HUBSPOT_DEFAULT_OBJECT_IDS.tickets}/fields?isPrimaryCompany=${companyAsMediator}`,
  //   formDataAPI: `/api/:hubId/:portalId/hubspot-object-data/${env.HUBSPOT_DEFAULT_OBJECT_IDS.tickets}/:objectId?parentObjectTypeId=${parentObjectTypeId}&parentObjectRecordId=${parentObjectRowId}&mediatorObjectTypeId=${mediatorObjectTypeId ? mediatorObjectTypeId : parentObjectTypeId}&mediatorObjectRecordId=${mediatorObjectRecordId ? mediatorObjectRecordId : parentObjectRowId}&isForm=true&isPrimaryCompany=${companyAsMediator}`,
  //   createAPI: `/api/${hubId}/${portalId}/hubspot-object-forms/${env.HUBSPOT_DEFAULT_OBJECT_IDS.tickets}/fields${param}`,
  //   updateAPI: `/api/${hubId}/${portalId}/hubspot-object-forms/${env.HUBSPOT_DEFAULT_OBJECT_IDS.tickets}/fields/:formId${param}` // concat ticketId
  // }

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
            className={`absolute inset-[0px] flex ${split === "x" ? "flex-row" : "flex-column"
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

  function Card({ title, amount, date, dragItem, cardData }) {
    return (
      <div
        className={`rounded-md bg-white border border-gray-300  dark:border-gray-600 shadow-sm p-3 mx-3 my-2 dark:bg-dark-300 dark:text-white ${dragItem ? " rotate-6" : ""
          }`}
      >
        <Link
          className="my-1 inline-block"
          to={`${title}/${cardData?.hubspotObjectTypeId}/${cardData?.hsObjectId}?isPrimaryCompany=${companyAsMediator || false}/${objectToQueryParams(urlParam)}`}
        >
          <h4 className="dark:text-white  text-secondary font-bold text-xs hover:underline underline-offset-4 inline-block">{title?.substring(0, 30)}</h4>
        </Link>
        {amount && <p className="text-xs line-clamp-2 dark:text-white"><span className="font-bold">Amount: </span>${amount}</p>}
        {date && <p className="text-xs mb-2 dark:text-white"><span className="font-bold">Close Date: </span>{date}</p>}
      </div>
    );
  }

  function List({ name, dragItem, children, count }) {
    return (
      <div
        className={`rounded-xs whitespace-nowrap dark:text-white bg-[#f5f8fa] dark:bg-dark-500 mx-0 my-0 pb-1 w-64 shrink-0 grow-0 ${dragItem ? " rotate-6" : ""
          }`}
      >
        <div className="flex items-center justify-between px-3 py-2 border-b dark:border-b-gray-600 sticky top-0 z-[2] bg-[#f5f8fa] dark:bg-dark-500">
          <h2 className="font-medium text-xs my-1 uppercase text-gray-700 dark:text-white">
            {name}
          </h2>
          <span className="text-sm">
            {count}
          </span>
        </div>
        {children}
      </div>
    );
  }

  /* =============================================================

Main Component Starts Here

=================================================================*/
  const [data, setData] = React.useState([]);
  const [dardData, setCardData] = React.useState();
  // const [pipelines, setPipelines] = useState([]);
  // const [activePipeline, setActivePipeline] = useState();

  // let portalId;
  // if (env.DATA_SOURCE_SET != true) {
  //   portalId = getPortal()?.portalId;
  // }

  // https://app.dev.one.digitalwoods.io/api/

  // https://app.dev.one.digitalwoods.io/api/48745110/335/hubspot-object-pipelines/0-5

  // const {
  //   mutate: getData,
  //   data: tableAPiData,
  //   isLoading,
  // } = useMutation({
  //   mutationKey: ["PipelineData"],
  //   mutationFn: async () => {
  //     return await Client.Deals.pipelines({
  //       API_ENDPOINT: `api/${hubId}/${portalId}/hubspot-object-pipelines/${hubspotObjectTypeId}`,
  //     });
  //   },

  //   onSuccess: (data) => {
  //     setPipelines(data.data);

  //     // Hey Get HERE //
  //     const pipelineSingle = data.data.find(
  //       (pipeline) => pipeline.pipelineId === data.data[0].pipelineId
  //     );
  //     let pipelineData = [];
  //     pipelineSingle.stages.forEach((element, index) => {
  //       pipelineData.push({
  //         id: index + 1,
  //         name: element.label,
  //         ...element,
  //         cards: [],
  //       });
  //     });
  //     setData([])
  //     setData(pipelineData);
  //     // getDealsByPipeline({ pipelineId: pipelineSingle.pipelineId });
  //     getTrelloCardsData({ filterValue: pipelineSingle.pipelineId })
  //     setActivePipeline(pipelineSingle.pipelineId);
  //   },
  //   onError: () => {
  //     setPipelines([]);
  //   },
  // });

  // useEffect(()=>{
  //   setCardData(activeCardData)
  //   console.log(activeCardData,'activeCardData');
  // },[activeCardData])

  // useEffect(()=>{
  //   setCardData(activeCardData)
  //   console.log(activeCardData,'activeCardData');
  // },[currentPage])

  useEffect(() => {
    if (activePipeline) {
      const pipelineSingle = pipelines.find(
        (pipeline) => pipeline.pipelineId === activePipeline
      );
      let pipelineData = [];
      pipelineSingle.stages.forEach((element, index) => {
        pipelineData.push({
          id: index + 1,
          name: element.label,
          count:stageDataCount[element.id] ?? 0,
          ...element,
          cards: [],
        });
      });
      setData(pipelineData);
      // setActivePipeline(pipelineSingle.pipelineId);
      console.log(pipelineData, 'pipelineData');
    }
  }, [activePipeline, stageDataCount]);
  console.log(pipelines, 'pipelines');
  console.log(stageDataCount,'stageDataCount from trello card');
  const loadMore = () => {
    // Trigger loading of more cards by calling the parent function
    handleCardData(currentPage + 1);
    // setItemsPerPage(itemsPerPage * 2);
    // Append data to existing cards
    //   if (hubspotObjectTypeId == "0-3") {
    //     if (activeCardData?.data?.results?.rows.length > 0) {
    //       addDeals(activeCardData?.data?.results?.rows);
    //     }
    //   } else {
    //     if (activeCardData?.data?.results?.rows.length > 0) {
    //       addTickets(activeCardData?.data?.results?.rows);
    //     }
    //   }
  };
  // const { mutate: getDealsByPipeline } = useMutation({
  //   mutationKey: ["DealsDataByPipeline"],
  //   mutationFn: async ({ pipelineId }) => {
  //     return await Client.Deals.pipelineDeals({
  //       // API_ENDPOINT: `api/${hubId}/${portalId}/hubspot-object-data/${hubspotObjectTypeId}?mediatorObjectTypeId=0-1&filterPropertyName=hs_pipeline&filterOperator=eq&filterValue=${pipelineId}&limit=10&sort=-hs_createdate&page=1&cache=false`
  //       API_ENDPOINT: `${API_ENDPOINT}&filterPropertyName=hs_pipeline&filterOperator=eq&filterValue=${pipelineId}&limit=10&sort=-hs_createdate&page=1&cache=${
  //         sync ? false : true
  //       }`,
  //     });
  //   },
  //   onSuccess: (resp) => {
  //     if (hubspotObjectTypeId == "0-3") {
  //       if (resp?.data?.results?.rows.length > 0) {
  //         addDeals(resp?.data?.results?.rows);
  //       }
  //     } else {
  //       if (resp?.data?.results?.rows.length > 0) {
  //         addTickets(resp?.data?.results?.rows);
  //       }
  //     }
  //   },
  //   onError: () => {
  //     // setPipelines([]);
  //   },
  // });

  useEffect(() => {
    activeCardData
    if (activeCardData?.length > 0) {
      if (hubspotObjectTypeId == "0-3") {
        if (activeCardData?.length > 0) {
          addDeals(activeCardData);
        }
      } else {
        if (activeCardData?.length > 0) {
          addTickets(activeCardData);
        }
      }
    } else {
      removeTicketsDeals();
    }
  }, [activeCardData]);

  const { mutate: updateDealsByPipeline } = useMutation({
    mutationKey: ["updateDealsDataByPipeline"],
    mutationFn: async ({ recordId, stageId }) => {
      return await Client.Deals.updatePipelineDeal({
        API_ENDPOINT: `api/${hubId}/${portalId}/hubspot-object-forms/${hubspotObjectTypeId}/properties/${recordId}?${objectToQueryParams(urlParam)}`,
        data:
          hubspotObjectTypeId == "0-3"
            ? { pipeline: activePipeline, dealstage: stageId }
            : { hs_pipeline: activePipeline, hs_pipeline_stage: stageId },
      });
    },
    onSuccess: (resp) => { },
    onError: () => {
      // setPipelines([]);
    },
  });

  const addDeals = (deals) => {
    // return
    setData((prevStages) =>
      prevStages.map((stage) => {
        // Find deals that match the current stage ID
        const matchingDeals = deals.filter(
          (deal) => deal.dealstage?.value === stage.id
        );

        // If there are matching deals, add them to the `cards` array
        if (matchingDeals.length > 0) {
          return {
            ...stage,
            cards: [
              // ...stage.cards,
              ...matchingDeals.map((deal) => ({
                dealName: deal.dealname,
                hsObjectId: deal.hs_object_id,
                id: deal.hs_object_id,
                title: deal.dealname,
                closedate: deal?.closedate ? formatDate(deal.closedate) : "",
                amount: deal.amount || "",
                hubspotObjectTypeId: '0-3'
              })),
            ],
          };
        }
        return {
          ...stage,
          cards: []
        };
      })
    );
  };

  const addTickets = (tickets) => {
    setData((prevStages) =>
      prevStages.map((stage) => {
        // Find deals that match the current stage ID
        const matchingDeals = tickets.filter(
          (deal) => deal.hs_pipeline_stage?.value === stage.id
        );
        // If there are matching deals, add them to the `cards` array
        if (matchingDeals.length > 0) {
          return {
            ...stage,
            cards: [
              // ...stage.cards,
              ...matchingDeals.map((ticket) => ({
                dealName: ticket.subject,
                hsObjectId: ticket.hs_object_id,
                id: ticket.hs_object_id,
                title: ticket.subject,
                closedate: ticket?.closed_date
                  ? formatDate(ticket.closed_date)
                  : "",
                amount: "",
                hubspotObjectTypeId: '0-5'
              })),
            ],
          };
        }
        return {
          ...stage,
          cards: []
        };
      })
    );
  };

  const removeTicketsDeals = () => {
    setData((prevStages) =>
      prevStages.map((stage) => {
        return {
          ...stage,
          cards: []
        };
      })
    );
  };

  // useEffect(() => {
  //   if(sync) getData();
  // }, [sync]);

  // useEffect(() => {
  //   getData();
  // }, []);

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
      // update the state
      setData(newData);
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

  // function mapData(pipeLineId) {
  //   const pipelineSingle = pipelines.find(
  //     (pipeline) => pipeline.pipelineId === pipeLineId
  //   );
  //   let pipelineData = [];
  //   pipelineSingle.stages.forEach((element, index) => {
  //     pipelineData.push({
  //       id: index + 1,
  //       name: element.label,
  //       ...element,
  //       cards: [],
  //     });
  //   });
  //   setData(pipelineData);
  //   // getDealsByPipeline({ pipelineId: pipelineSingle.pipelineId });
  //   // getTrelloCardsData({ filterValue: pipelineSingle.pipelineId })
  //   setActivePipeline(pipelineSingle.pipelineId);
  // }

  return (
    <div className="md:mb-4 mb-3 flex flex-col h-[66vh] overflow-auto relative">
      {/* <h1 className="font-semibold text-3xl py-2">Trello-Style Drag & Drop</h1> */}
      {/* <p>Let's drag some cards around!</p> */}

      {/* Select Pipeline Goes Here */}
      {/* <div className="w-[180px] mb-4">
        <select
          className="w-[180px] text-sm border border-gray-300 rounded px-1 py-1 focus:outline-none focus:ring-2 focus:ring-blue-500"
          value={activePipeline}
          onChange={(e) => mapData(e.target?.value)}
        >
          <option value="">Select an Pipeline</option>
          {pipelines.map((item) => (
            // <p onClick={()=> {setActivePipeline(item); mapData(item);}}>{item.label}</p>
            <option value={item.pipelineId}>{item.label}</option>
          ))}
        </select>
      </div> */}

      {isLoadingPipelines && <div className="loader-line"></div>}

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
                    className={`relative flex flex-col h-full bg-[#f5f8fa] dark:bg-dark-500 border dark:border-gray-600 overflow-y-auto hide-scrollbar
                    ${listPosition === 0 ? 'rounded-s-md border-r-1  border-l-1' : 'border-l-0'} 
                    ${listPosition === data.length - 1 ? 'rounded-e-md' : ''}`}
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
                                className={`cursor-pointer ${activeItem === card.id &&
                                  activeType === "card" &&
                                  isDragging
                                  ? "hidden"
                                  : "translate-x-0"
                                  }`}
                                dragType="card"
                              >
                                <Card
                                  title={card.title}
                                  amount={card?.amount}
                                  date={card?.closedate}
                                  dragItem={
                                    activeItem === card.id &&
                                    activeType === "card"
                                  }
                                  cardData={card}
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
                    {hasMoreData ?
                      <div className="bg-[#f5f8fa] dark:bg-dark-500 flex items-center justify-center p-2 sticky bottom-0">
                        <Button onClick={loadMore} size='sm' >Show more</Button>
                      </div>
                      : null}
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
