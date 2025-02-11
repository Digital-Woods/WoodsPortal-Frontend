const Details = ({ path, objectId, id }) => {

  // Find the object in moduleIframeListOptions that matches the objectId
  const matchedObject = 
  moduleIframeListOptions.find((item) => item.hubspotObjectTypeId === objectId) || '';
  // Extract propertyName and showIframe from the matched object
  const propertyName = matchedObject.propertyName || '';
  const showIframe = matchedObject.showIframe || false;
  const { isLargeScreen } = useResponsive();


  return (
    <div className="bg-sidelayoutColor mt-[calc(var(--nav-height)-1px)] dark:bg-dark-300">
    <div className={`bg-cleanWhite dark:bg-dark-200`}>
      {env.DATA_SOURCE_SET !== true ? (
        <ApiDetails objectId={objectId} path={path} id={id} propertyName={propertyName} showIframe={showIframe} />
      ) : (
        <ModuleDetails objectId={objectId} path={path} id={id} propertyName={propertyName} showIframe={showIframe}  />
      )
      }
    </div>
    </div>
  );
};
