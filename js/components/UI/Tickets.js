const Tickets = ({ path, objectId, id }) => {
  const hubspotObjectTypeId = objectId
  const title = "Ticket"
  const mediatorObjectTypeId = getParam("mediatorObjectTypeId")
  const mediatorObjectRecordId = getParam("mediatorObjectRecordId")
  const param =  mediatorObjectTypeId && mediatorObjectRecordId ? `?mediatorObjectTypeId=${mediatorObjectTypeId}&mediatorObjectRecordId=${mediatorObjectRecordId}` : ''

  let portalId;
  if (env.DATA_SOURCE_SET != true) {
    portalId = getPortal().portalId
  }

  const apis = {
    tableAPI: `/api/${hubId}/${portalId}/hubspot-object-tickets/${hubspotObjectTypeId}/${id}${param}`,
    formAPI: `/api/${hubId}/${portalId}/hubspot-object-tickets/forms`,
    stagesAPI: `/api/${hubId}/${portalId}/hubspot-object-tickets/stages/`, // concat pipelineId
    createAPI: `/api/${hubId}/${portalId}/hubspot-object-tickets/${hubspotObjectTypeId}/${id}`,
    updateAPI: `/api/${hubId}/${portalId}/hubspot-object-tickets/${hubspotObjectTypeId}/${id}/` // concat ticketId
  }

  return (
    <DashboardTable hubspotObjectTypeId={hubspotObjectTypeId} path={path} title={title} apis={apis} editView={true} />
  );
};
