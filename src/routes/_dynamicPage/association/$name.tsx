import { createFileRoute, useRouter } from '@tanstack/react-router'
import { env } from "@/env";
import { getQueryParamsFromCurrentUrl, getParam, getRouteMenuByObjectTypeId } from '@/utils/param'
import { getPortal } from '@/data/client/auth-utils'
import { hubId } from '@/data/hubSpotData'
import { DynamicComponentView } from '@/components/ui/Table/DynamicComponentView';

const AssociationComponent = () => {
  const router = useRouter()
  const { search } = router.state.location

  const { name: path } = Route.useParams();

  let showIframe: any = ""
  let propertyName: any = ""

  const param = getQueryParamsFromCurrentUrl();

  let portalId;
  if (env.VITE_DATA_SOURCE_SET != true) {
    portalId = getPortal()?.portalId;
  }
  
  const hubspotObjectTypeId = search?.objectTypeId;

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
      title={null}
      showIframe={showIframe}
      propertyName={propertyName}
      companyAsMediator={null}
      pipeLineId={null}
      specPipeLine={null}
      objectDescription={null}
      apis={apis}
      objectUserProperties={null}
      objectUserPropertiesView={null}
    />
  )
}

export default AssociationComponent

export const Route = createFileRoute('/_dynamicPage/association/$name')({
  component: AssociationComponent,
  beforeLoad: () => {
    return {
      layout: "MainLayout",
      requiresAuth: true,
    }
  },
})
