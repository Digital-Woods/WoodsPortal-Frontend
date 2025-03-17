const Details = ({ path, objectId, id, title }) => {
  const { breadcrumbs } = useBreadcrumb();

  const decodeToBase64 = (base64) => {
    const decodedStr = atob(base64);
    return decodedStr;
  };

  let breadcrumb = getParam("b");

  let breadcrumbItems = breadcrumb
    ? JSON.parse(decodeToBase64(breadcrumb))
    : breadcrumbs;
  let tabName = breadcrumbItems.length > 1 ? breadcrumbItems[breadcrumbItems.length - 2].name : breadcrumbItems[0].name;
  
  // Find the object in moduleIframeListOptions that matches the objectId

  // const matchedObject = 
  // moduleIframeListOptions.find((item) => item.hubspotObjectTypeId && item.label === objectId && tabName ) || '';

  // const matchedObject = moduleIframeListOptions.find(
  //   (item) => item.hubspotObjectTypeId === objectId && item.label === tabName
  // ) || '';
  
  // // Extract propertyName and showIframe from the matched object
  // const propertyName = matchedObject.propertyName || '';
  // const showIframe = matchedObject.showIframe || false;

  const matchedObject = moduleIframeListOptions.find(
    (item) => item.hubspotObjectTypeId === objectId && item.label === tabName
  ) || {};
  
  // Extract propertyName and showIframe from the matched object
  const propertyName = matchedObject.propertyName ? matchedObject.propertyName.split(',') : [];
  const showIframe = matchedObject.showIframe || false;

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
