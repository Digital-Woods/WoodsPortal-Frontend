const Tickets = ({ path, objectId, id }) => {
  const hubspotObjectTypeId = objectId || getParam("objectTypeId")
  const title = "Ticket"

  const objectTypeId = getParam("objectTypeId")
  const mediatorObjectTypeId = getParam("mediatorObjectTypeId")
  const mediatorObjectRecordId = getParam("mediatorObjectRecordId")
  const param =  mediatorObjectTypeId && mediatorObjectRecordId ? `?mediatorObjectTypeId=${mediatorObjectTypeId}&mediatorObjectRecordId=${mediatorObjectRecordId}` : ''

  let portalId;
  if (env.DATA_SOURCE_SET != true) {
    portalId = getPortal().portalId
  }

  const apis = {
    tableAPI: `/api/${hubId}/${portalId}/hubspot-object-tickets/${hubspotObjectTypeId}/${id}${param}`,
    stagesAPI: `/api/${hubId}/${portalId}/hubspot-object-pipelines/${hubspotObjectTypeId}/`, // concat pipelineId
    formAPI: `/api/${hubId}/${portalId}/hubspot-object-forms/${env.HUBSPOT_DEFAULT_OBJECT_IDS.tickets}/fields`,
    createAPI: `/api/${hubId}/${portalId}/hubspot-object-forms/${hubspotObjectTypeId}/fields`,
    updateAPI: `/api/${hubId}/${portalId}/hubspot-object-forms/${hubspotObjectTypeId}/fields/:formId` // concat ticketId
  }

  return (
    <DashboardTable hubspotObjectTypeId={hubspotObjectTypeId} path={path} title={title} apis={apis} editView={true} />
  );
};
