const DynamicComponent = ({
  hubspotObjectTypeId,
  path,
  title,
  showIframe,
  propertyName,
  companyAsMediator,
  pipeLineId,
  specPipeLine,
  objectDescription,
  objectUserProperties,
  objectUserPropertiesView
}) => {
  const param = getQueryParamsFromCurrentUrl();

  let portalId;
  if (env.DATA_SOURCE_SET != true) {
    portalId = getPortal()?.portalId;
  }
  hubspotObjectTypeId = hubspotObjectTypeId || getParam("objectTypeId");

  const apis = {
    tableAPI: `/api/${hubId}/${portalId}/hubspot-object-data/${hubspotObjectTypeId}${param}`,
    stagesAPI: `/api/${hubId}/${portalId}/hubspot-object-pipelines/${hubspotObjectTypeId}/`, // concat pipelineId
    formAPI: `/api/${hubId}/${portalId}/hubspot-object-forms/${hubspotObjectTypeId}/fields${param}`,
    formDataAPI: `/api/:hubId/:portalId/hubspot-object-data/${hubspotObjectTypeId}/:objectId${
      param ? param + "&isForm=true" : "?isForm=true"
    }`,
    createAPI: `/api/${hubId}/${portalId}/hubspot-object-forms/${hubspotObjectTypeId}/fields${param}`,
    createExistingAPI: `/api/${hubId}/${portalId}/hubspot-object-forms/:fromObjectTypeId/:fromRecordId/associations/:toObjectTypeId${param}`,
    removeExistingAPI: `/api/${hubId}/${portalId}/hubspot-object-forms/:fromObjectTypeId/:fromRecordId/disassociate/:toObjectTypeId${param}`,
    updateAPI: `/api/${hubId}/${portalId}/hubspot-object-forms/${hubspotObjectTypeId}/fields/:formId${param}`, // concat ticketId
  };

  return (
    <DynamicComponentView
      hubspotObjectTypeId={hubspotObjectTypeId}
      path={path}
      title={title}
      showIframe={showIframe}
      propertyName={propertyName}
      companyAsMediator={companyAsMediator}
      pipeLineId={pipeLineId}
      specPipeLine={specPipeLine}
      objectDescription={objectDescription}
      apis={apis}
      objectUserProperties={objectUserProperties}
      objectUserPropertiesView={objectUserPropertiesView}
    />
  );
};