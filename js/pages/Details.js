const Details = ({ path, objectId, id }) => {

  console.log(moduleIframeListOptions, 'moduleIframeListOptions');

  // Find the object in moduleIframeListOptions that matches the objectId
  const matchedObject = moduleIframeListOptions.find(
    (item) => item.hubspotObjectTypeId === objectId
  );

  console.log(matchedObject,'matchedObject');

  // Extract propertyName and showIframe from the matched object
  const propertyName = matchedObject.propertyName || null;
  const showIframe = matchedObject.showIframe || false;

  return (
    <div className="bg-sidelayoutColor dark:bg-dark-300">
    <div className="rounded-tl-xl bg-cleanWhite dark:bg-dark-200">
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
