import { createFileRoute, useRouter } from '@tanstack/react-router'
import { env } from "@/env";
import { getQueryParamsFromCurrentUrl, getParam, getRouteMenuByObjectTypeId } from '@/utils/param'
import { getPortal } from '@/data/client/auth-utils'
import { hubId } from '@/data/hubSpotData'
import { DynamicComponentView } from '@/components/ui/Table/DynamicComponentView';
import { getParamDetails } from '@/utils/GenerateUrl';
import { useTable } from '@/state/use-table';

const AssociationComponent = () => {
  const router = useRouter()
  const { search }: any = router.state.location

  const { name: path } = Route.useParams();

  let showIframe: any = ""
  let propertyName: any = ""

  let portalId;
  if (env.VITE_DATA_SOURCE_SET != true) {
    portalId = getPortal()?.portalId;
  }

  const { 
    tableUniqueId
  }: any = useTable();
  
  const { name } = Route.useParams()

  const hubspotObjectTypeId = name;
  const title = search?.objectTypeName;

  const {params} = getParamDetails()

  const apis = {
    // tableAPI: `/api/${hubId}/${portalId}/hubspot-object-data/${hubspotObjectTypeId}${params}`,
    tableAPI: `/api/${hubId}/${portalId}/hubspot-object-data/${hubspotObjectTypeId}`,
    stagesAPI: `/api/${hubId}/${portalId}/hubspot-object-pipelines/${hubspotObjectTypeId}/`, // concat pipelineId
    // formAPI: `/api/${hubId}/${portalId}/hubspot-object-forms/${hubspotObjectTypeId}/fields${params}`,
    formAPI: `/api/${hubId}/${portalId}/hubspot-object-forms/${hubspotObjectTypeId}/fields`,
    // formDataAPI: `/api/:hubId/:portalId/hubspot-object-data/${hubspotObjectTypeId}/:objectId${
    //   params ? params + "&isForm=true" : "?isForm=true"
    // }`,
    // createAPI: `/api/${hubId}/${portalId}/hubspot-object-forms/${hubspotObjectTypeId}/fields${params}`,
    createAPI: `/api/${hubId}/${portalId}/hubspot-object-forms/${hubspotObjectTypeId}/fields`,
    // createExistingAPI: `/api/${hubId}/${portalId}/hubspot-object-forms/:fromObjectTypeId/:fromRecordId/associations/:toObjectTypeId${params}`,
    createExistingAPI: `/api/${hubId}/${portalId}/hubspot-object-forms/:fromObjectTypeId/:fromRecordId/associations/:toObjectTypeId`,
    // removeExistingAPI: `/api/${hubId}/${portalId}/hubspot-object-forms/:fromObjectTypeId/:fromRecordId/disassociate/:toObjectTypeId${params}`,
    removeExistingAPI: `/api/${hubId}/${portalId}/hubspot-object-forms/:fromObjectTypeId/:fromRecordId/disassociate/:toObjectTypeId`,
    // updateAPI: `/api/${hubId}/${portalId}/hubspot-object-forms/${hubspotObjectTypeId}/fields/:formId${params}`, // concat ticketId
  };

  return (
    <DynamicComponentView
      hubspotObjectTypeId={hubspotObjectTypeId}
      key={tableUniqueId}
      path={tableUniqueId}
      title={title}
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
