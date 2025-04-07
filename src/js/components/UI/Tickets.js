const Tickets = ({ path, objectId, id, parentObjectTypeId, parentObjectRowId, permissions, companyAsMediator, title, setTotalRecord}) => {
  const hubspotObjectTypeId = '0-5'; 

  const mediatorObjectTypeId = getParam("mediatorObjectTypeId")
  const mediatorObjectRecordId = getParam("mediatorObjectRecordId")
  // const param =  mediatorObjectTypeId && mediatorObjectRecordId ? `?mediatorObjectTypeId=${mediatorObjectTypeId}&mediatorObjectRecordId=${mediatorObjectRecordId}` : ''
  const param = `?parentObjectTypeId=${objectId}&parentObjectRecordId=${id}&isPrimaryCompany=${companyAsMediator}`

  let portalId;
  if (env.DATA_SOURCE_SET != true) {
    portalId = getPortal()?.portalId
  }

  const detailsUrl = `?parentObjectTypeId=${parentObjectTypeId}&parentObjectRecordId=${parentObjectRowId}&mediatorObjectTypeId=${mediatorObjectTypeId ? mediatorObjectTypeId : parentObjectTypeId}&mediatorObjectRecordId=${mediatorObjectRecordId ? mediatorObjectRecordId : parentObjectRowId}&isForm=false&isPrimaryCompany=${companyAsMediator}`

  const apis = {
    tableAPI: `/api/${hubId}/${portalId}/hubspot-object-data/${env.HUBSPOT_DEFAULT_OBJECT_IDS.tickets}?parentObjectTypeId=${parentObjectTypeId}&parentObjectRecordId=${parentObjectRowId}&mediatorObjectTypeId=${mediatorObjectTypeId ? mediatorObjectTypeId : parentObjectTypeId}&mediatorObjectRecordId=${mediatorObjectRecordId ? mediatorObjectRecordId : parentObjectRowId}&isPrimaryCompany=${companyAsMediator}`,
    // tableAPI: `/api/${hubId}/${portalId}/hubspot-object-data/${hubspotObjectTypeId}/${id}`,
    stagesAPI: `/api/${hubId}/${portalId}/hubspot-object-pipelines/${env.HUBSPOT_DEFAULT_OBJECT_IDS.tickets}/`, // concat pipelineId
    formAPI: `/api/${hubId}/${portalId}/hubspot-object-forms/${env.HUBSPOT_DEFAULT_OBJECT_IDS.tickets}/fields?isPrimaryCompany=${companyAsMediator}`,
    formDataAPI: `/api/:hubId/:portalId/hubspot-object-data/${env.HUBSPOT_DEFAULT_OBJECT_IDS.tickets}/:objectId?parentObjectTypeId=${parentObjectTypeId}&parentObjectRecordId=${parentObjectRowId}&mediatorObjectTypeId=${mediatorObjectTypeId ? mediatorObjectTypeId : parentObjectTypeId}&mediatorObjectRecordId=${mediatorObjectRecordId ? mediatorObjectRecordId : parentObjectRowId}&isForm=true&isPrimaryCompany=${companyAsMediator}`,
    createAPI: `/api/${hubId}/${portalId}/hubspot-object-forms/${env.HUBSPOT_DEFAULT_OBJECT_IDS.tickets}/fields${param}`,
    updateAPI: `/api/${hubId}/${portalId}/hubspot-object-forms/${env.HUBSPOT_DEFAULT_OBJECT_IDS.tickets}/fields/:formId${param}` // concat ticketId
  }

  return (
    <DashboardTable
      hubspotObjectTypeId={hubspotObjectTypeId}
      path={path}
      title={title}
      apis={apis}
      viewName='ticket'
      detailsUrl={detailsUrl}
      componentName="ticket"
      defPermissions={permissions}
      setTotalRecord={setTotalRecord}
    />
  );
};
