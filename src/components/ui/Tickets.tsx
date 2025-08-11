import { env } from "@/env";
import { getParam } from '@/utils/param';
import { getPortal } from '@/data/client/auth-utils';
import { hubId } from '@/defaultData'
import { DynamicComponentView } from '@/components/ui/Table/DynamicComponentView'

export const Tickets = ({
  path,
  objectId,
  id,
  parentObjectTypeId,
  parentObjectRowId,
  permissions,
  companyAsMediator,
  title,
  ticketTableTitle,
}: any) => {
  const hubspotObjectTypeId = "0-5";

  const mediatorObjectTypeId = getParam("mediatorObjectTypeId");
  const mediatorObjectRecordId = getParam("mediatorObjectRecordId");
  // const param =  mediatorObjectTypeId && mediatorObjectRecordId ? `?mediatorObjectTypeId=${mediatorObjectTypeId}&mediatorObjectRecordId=${mediatorObjectRecordId}` : ''
  const param = `?parentObjectTypeId=${objectId}&parentObjectRecordId=${id}&isPrimaryCompany=${companyAsMediator}`;

  let portalId;
  if (env.VITE_DATA_SOURCE_SET != true) {
    portalId = getPortal()?.portalId;
  }

  const detailsUrl = `?parentObjectTypeId=${parentObjectTypeId}&parentObjectRecordId=${parentObjectRowId}&mediatorObjectTypeId=${
    mediatorObjectTypeId ? mediatorObjectTypeId : parentObjectTypeId
  }&mediatorObjectRecordId=${
    mediatorObjectRecordId ? mediatorObjectRecordId : parentObjectRowId
  }&isForm=false&isPrimaryCompany=${companyAsMediator}`;

  const apis = {
    tableAPI: `/api/${hubId}/${portalId}/hubspot-object-data/${
      env.VITE_HUBSPOT_DEFAULT_OBJECT_IDS.tickets
    }?parentObjectTypeId=${parentObjectTypeId}&parentObjectRecordId=${parentObjectRowId}&mediatorObjectTypeId=${
      mediatorObjectTypeId ? mediatorObjectTypeId : parentObjectTypeId
    }&mediatorObjectRecordId=${
      mediatorObjectRecordId ? mediatorObjectRecordId : parentObjectRowId
    }&isPrimaryCompany=${companyAsMediator}`,
    // tableAPI: `/api/${hubId}/${portalId}/hubspot-object-data/${hubspotObjectTypeId}/${id}`,
    stagesAPI: `/api/${hubId}/${portalId}/hubspot-object-pipelines/${env.VITE_HUBSPOT_DEFAULT_OBJECT_IDS.tickets}/`, // concat pipelineId
    formAPI: `/api/${hubId}/${portalId}/hubspot-object-forms/${env.VITE_HUBSPOT_DEFAULT_OBJECT_IDS.tickets}/fields?isPrimaryCompany=${companyAsMediator}&parentObjectTypeId=${parentObjectTypeId}`,
    formDataAPI: `/api/:hubId/:portalId/hubspot-object-data/${
      env.VITE_HUBSPOT_DEFAULT_OBJECT_IDS.tickets
    }/:objectId?parentObjectTypeId=${parentObjectTypeId}&parentObjectRecordId=${parentObjectRowId}&mediatorObjectTypeId=${
      mediatorObjectTypeId ? mediatorObjectTypeId : parentObjectTypeId
    }&mediatorObjectRecordId=${
      mediatorObjectRecordId ? mediatorObjectRecordId : parentObjectRowId
    }&isForm=true&isPrimaryCompany=${companyAsMediator}`,
    createAPI: `/api/${hubId}/${portalId}/hubspot-object-forms/${env.VITE_HUBSPOT_DEFAULT_OBJECT_IDS.tickets}/fields${param}`,
    createExistingAPI: `/api/${hubId}/${portalId}/hubspot-object-forms/:fromObjectTypeId/:fromRecordId/associations/:toObjectTypeId${param}`,
    removeExistingAPI: `/api/${hubId}/${portalId}/hubspot-object-forms/:fromObjectTypeId/:fromRecordId/disassociate/:toObjectTypeId${param}`,
    updateAPI: `/api/${hubId}/${portalId}/hubspot-object-forms/${env.VITE_HUBSPOT_DEFAULT_OBJECT_IDS.tickets}/fields/:formId${param}`, // concat ticketId
  };

  return (
    <DynamicComponentView
      hubspotObjectTypeId={hubspotObjectTypeId}
      path={path}
      ticketTableTitle={ticketTableTitle}
      title={title}
      apis={apis}
      viewName="ticket"
      detailsUrl={detailsUrl}
      componentName="ticket"
      defPermissions={permissions}
      isShowTitle={false}
    />
  );
  // return <div>Ticket 1</div>
};
