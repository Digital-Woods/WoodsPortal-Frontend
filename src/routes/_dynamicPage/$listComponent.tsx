import { createFileRoute } from '@tanstack/react-router'
import { env } from "@/env";
import { getQueryParamsFromCurrentUrl, getParam } from '@/utils/param'
import { getPortal } from '@/data/client/auth-utils'
import { hubId } from '@/defaultData'
import { DynamicComponentView } from '@/components/ui/Table/DynamicComponentView';

const DynamicComponent = () => {

  let hubspotObjectTypeId: any = "2-38796726"
  let path: any = ""
  let title: any = ""
  let showIframe: any = ""
  let propertyName: any = ""
  let companyAsMediator: any = ""
  let pipeLineId: any = ""
  let specPipeLine: any = ""
  let objectDescription: any = ""
  let objectUserProperties: any = ""
  let objectUserPropertiesView: any = ""

  const param = getQueryParamsFromCurrentUrl();

  let portalId;
  if (env.VITE_DATA_SOURCE_SET != true) {
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
  )
}

export default DynamicComponent

export const Route = createFileRoute('/_dynamicPage/$listComponent')({
  component: DynamicComponent,
  beforeLoad: () => {
    return {
      layout: "MainLayout",
      requiresAuth: true,
    }
  },
})
