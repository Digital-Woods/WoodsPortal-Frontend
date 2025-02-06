const TrelloCards = ({ path, objectId, id, parentObjectTypeId, parentObjectRowId, permissions, companyAsMediator }) => {
    // const hubspotObjectTypeId = objectId || getParam("objectTypeId")
    //const title = "Ticket"
  
    // const mediatorObjectTypeId = getParam("mediatorObjectTypeId")
    //const mediatorObjectRecordId = getParam("mediatorObjectRecordId")
    // const param =  mediatorObjectTypeId && mediatorObjectRecordId ? `?mediatorObjectTypeId=${mediatorObjectTypeId}&mediatorObjectRecordId=${mediatorObjectRecordId}` : ''
    // const param =  `?parentObjectTypeId=${objectId}&parentObjectRecordId=${id}&isPrimaryCompany=${companyAsMediator}`
  
    // let portalId;
    // if (env.DATA_SOURCE_SET != true) {
    //   portalId = getPortal()?.portalId
    // }
  
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
    
    const dragStart = function(e, dragId, dragType) {
      e.stopPropagation();
      e.dataTransfer.effectAllowed = 'move';
      setDragItem(dragId);
      setDragType(dragType);
    };
    
    const drag = function(e, dragId, dragType) {
      e.stopPropagation();
      setIsDragging(true);
    };
    
    const dragEnd = function(e) {
      setDragItem(null);
      setDragType(null);
      setIsDragging(false);
      setDrop(null);
    };
    
    const onDrop = function(e) {
      e.preventDefault();
      handleDrop({ dragItem, dragType, drop });
      setDragItem(null);
      setDragType(null);
      setIsDragging(false);
      setDrop(null);
    };

    let contextData = {
        draggable, dragItem, dragType, isDragging, dragStart, drag, dragEnd, drop, setDrop, onDrop
    };
    
    return (
        <DragContext.Provider value={ contextData }>
             { typeof children === "function" ? children({ activeItem: dragItem, activeType: dragType, isDragging }) : children }
        </DragContext.Provider>
    );
  };

    // a draggable item
    Drag.DragItem = function({ as, dragId, dragType, ...props }) {
        const { draggable, dragStart, drag, dragEnd, dragItem } = useContext(DragContext);
        
        let Component = as || "div";
        return <Component onDragStart={(e) => dragStart(e, dragId, dragType)} onDrag={drag} draggable={draggable} onDragEnd={dragEnd} {...props} />;
    };
  
    // listens for drags over drop zones
    Drag.DropZone = function({ as, dropId, dropType, remember, children, style, ...props }) {
        const { dragItem, dragType, setDrop, drop, onDrop } = useContext(DragContext);
        
        function handleDragOver(e) {
        if (e.preventDefault) {
            e.preventDefault();
        }
        return false;
        };
        
        function handleLeave() {
        if (!remember) {
            setDrop(null); 
        }
        };
        
        let Component = as || "div";
        return ( 
        <Component onDragEnter={(e) => dragItem && dropType === dragType && setDrop(dropId)} onDragOver={handleDragOver} onDrop={onDrop} {...props}
        className="relative">
            { children }
            { drop === dropId && <div className="absolute inset-[0px]" onDragLeave={handleLeave}></div> }
        </Component>
        );
    };
  
    // if we need multiple dropzones
    Drag.DropZones = function({ dropType, prevId, nextId, split = "y", remember, children, ...props }) {
        const { dragType, isDragging } = useContext(DragContext);
        return (
        <div className="relative" {...props}>
            { children }
            { dragType === dropType && isDragging &&
            <div className="absolute inset-[0px] flex flex-row">
                <Drag.DropZone className="h-full w-full" dropId={prevId}  dropType={dropType} remember={remember} />
                <Drag.DropZone className="h-full w-full" dropId={nextId}  dropType={dropType} remember={remember} />
            </div>
            }
        </div>
        );
    };
  
  // indicates where the drop will go when dragging over a dropzone
  Drag.DropGuide = function({ as, dropId, dropType, ...props }) {
      const { drop, dragType } = useContext(DragContext);
      let Component = as || "div";
      return dragType === dropType && drop === dropId ? <Component {...props} /> : null;
  };







  
    // Trello Cards Starts Here 
    const dummyData = [
        { id: 1, name: "List 1", cards: [ 
          { id: 1, title: "Card 1" },
          { id: 2, title: "Card 2" },
          { id: 3, title: "Card 3" },
          { id: 4, title: "Card 4" },
          { id: 5, title: "Card 5" },
        ] },
        { id: 2, name: "List 2", cards: [ 
          { id: 6, title: "Card 6" },
          { id: 7, title: "Card 7" },
          { id: 8, title: "Card 8" },
        ] }
      ];

      function Card({ title, description = "Drag and drop me!", dragItem }) {
        return (
          <div className={`rounded-lg bg-white border border-gray-300 shadow-sm p-5 m-2${ dragItem ? " rotate-6" : ""}`}>
            <h3 className="font-bold text-lg my-1">{ title }</h3>
            <p>{ description }</p>
          </div>
        );
      };
      
      function List({ name, dragItem, children }) {
        return (
          <div className={`rounded-xl bg-gray-100 p-2 mx-2 my-5 w-80 shrink-0 grow-0 shadow${ dragItem ? " rotate-6" : ""}`}>
            <div className="px-6 py-1">
              <h2 className="font-bold text-xl my-1">{ name }</h2>
            </div>
            { children }
          </div>
        );
      };



      const [data, setData] = React.useState(dummyData);


       // handle a dropped item
        function handleDrop({ dragItem, dragType, drop }) {
            if (dragType === "card") {
                // get the drop position as numbers
                let [newListPosition, newCardPosition] = drop.split("-").map((string) => parseInt(string));
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
                if (newListPosition === oldListPosition && oldCardPosition < newCardPosition) {
                  newCardPosition--; // reduce by one
                }
                // remove the card from the old position
                newData[oldListPosition].cards.splice(oldCardPosition, 1);
                // put it in the new position
                newData[newListPosition].cards.splice(newCardPosition, 0, card);
                // update the state
                setData(newData);
              } else if (dragType === "list") {
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
        }


      return (
        <div className="p-10 flex flex-col h-screen">
          <h1 className="font-semibold text-3xl py-2">Trello-Style Drag & Drop</h1>
          <p>Let's drag some cards around!</p>
          <Drag handleDrop={handleDrop}>
            {({ activeItem, activeType, isDragging }) => (
              <Drag.DropZone className="flex -mx-2 overflow-x-scroll h-full">
                {data.map((list, listPosition) => {
                  return (
                    <React.Fragment key={list.id}>
                      <Drag.DropZone dropId={listPosition} dropType="list" remember={true}>
                        <Drag.DropGuide dropId={listPosition} dropType="list" className="rounded-xl bg-gray-200 h-96 mx-2 my-5 w-80 shrink-0 grow-0" />
                      </Drag.DropZone>
                      <Drag.DropZones className="flex flex-col h-full" prevId={listPosition} nextId={listPosition+1} dropType="list" split="x" remember={true}>
                        <Drag.DragItem dragId={list.id} className={`cursor-pointer ${activeItem === list.id && activeType === "list" && isDragging ? "hidden" : "translate-x-0"}`} dragType="list">
                          <List name={list.name} dragItem={activeItem === list.id && activeType === "list"}>
                            {data[listPosition].cards.map((card, cardPosition) => {
                              return (
                                <Drag.DropZones key={card.id} prevId={`${listPosition}-${cardPosition}`} nextId={`${listPosition}-${cardPosition+1}`} dropType="card" remember={true}>
                                  <Drag.DropGuide dropId={`${listPosition}-${cardPosition}`} className="rounded-lg bg-gray-200 h-24 m-2" dropType="card" />
                                  <Drag.DragItem dragId={card.id} className={`cursor-pointer ${activeItem === card.id && activeType === "card" && isDragging ? "hidden" : "translate-x-0"}`} dragType="card">
                                    <Card title={card.title} dragItem={activeItem === card.id && activeType === "card"} />
                                  </Drag.DragItem>
                                </Drag.DropZones>
                              );
                            })}
                            <Drag.DropZone dropId={`${listPosition}-${data[listPosition].cards.length}`} dropType="card" remember={true}>
                              <Drag.DropGuide dropId={`${listPosition}-${data[listPosition].cards.length}`} className="rounded-lg bg-gray-200 h-24 m-2" dropType="card" />
                            </Drag.DropZone>
                          </List>
                        </Drag.DragItem>
                        <Drag.DropZone dropId={`${listPosition}-${data[listPosition].cards.length}`} className="grow" dropType="card" remember={true} />
                      </Drag.DropZones>
                    </React.Fragment>
                  );
                })}
                <Drag.DropZone dropId={data.length} dropType="list" remember={true}>
                  <Drag.DropGuide dropId={data.length} dropType="list" className="rounded-xl bg-gray-200 h-96 mx-2 my-5 w-80 shrink-0 grow-0" />
                </Drag.DropZone>
              </Drag.DropZone>
            )}
          </Drag>
        </div>
      );
  };
  