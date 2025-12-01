import { createFileRoute, useRouter } from '@tanstack/react-router'
import { env } from "@/env";
import { getQueryParamsFromCurrentUrl, getParam, getRouteMenu } from '@/utils/param'
import { getPortal } from '@/data/client/auth-utils'
import { hubId } from '@/data/hubSpotData'
import { DynamicComponentView } from '@/components/ui/Table/DynamicComponentView';
import { useEffect } from 'react';
import Dashboard from '../../components/ui/dashboard/dashboard';
import NotFound from '@/components/Layouts/404';

const ListComponent = () => {
  const { listComponent: path } = Route.useParams();
  const router = useRouter()
  const { pathname } = router.state.location

  useEffect(() => {
  }, [path, pathname]) // rerun when param or pathname changes

  const routeMenu: any = getRouteMenu(pathname)

  // check if homaepage
  if(!routeMenu) { 
    return <NotFound/>
  }

  if(routeMenu?.homeCardsView){
    return <Dashboard key={path} />
  }

  let { hubspotObjectTypeId, title, pipeLineId, companyAsMediator, specPipeLine, objectDescription, objectUserProperties, objectUserPropertiesView}: any = routeMenu
  let showIframe: any = ""
  let propertyName: any = ""

  const param = getQueryParamsFromCurrentUrl();

  let portalId;
  if (env.VITE_DATA_SOURCE_SET != true) {
    portalId = getPortal()?.portalId;
  }
  
  hubspotObjectTypeId = hubspotObjectTypeId || getParam("objectTypeId");

  const apis = {
    // tableAPI: `/api/${hubId}/${portalId}/hubspot-object-data/${hubspotObjectTypeId}${param}`,
    tableAPI: `/api/${hubId}/${portalId}/hubspot-object-data/${hubspotObjectTypeId}`,
    stagesAPI: `/api/${hubId}/${portalId}/hubspot-object-pipelines/${hubspotObjectTypeId}/`, // concat pipelineId
    // formAPI: `/api/${hubId}/${portalId}/hubspot-object-forms/${hubspotObjectTypeId}/fields${param}`,
    formAPI: `/api/${hubId}/${portalId}/hubspot-object-forms/${hubspotObjectTypeId}/fields`,
    // formDataAPI: `/api/:hubId/:portalId/hubspot-object-data/${hubspotObjectTypeId}/:objectId${
    //   param ? param + "&isForm=true" : "?isForm=true"
    // }`,
    // createAPI: `/api/${hubId}/${portalId}/hubspot-object-forms/${hubspotObjectTypeId}/fields${param}`,
    createAPI: `/api/${hubId}/${portalId}/hubspot-object-forms/${hubspotObjectTypeId}/fields`,
    // createExistingAPI: `/api/${hubId}/${portalId}/hubspot-object-forms/:fromObjectTypeId/:fromRecordId/associations/:toObjectTypeId${param}`,
    createExistingAPI: `/api/${hubId}/${portalId}/hubspot-object-forms/:fromObjectTypeId/:fromRecordId/associations/:toObjectTypeId`,
    // removeExistingAPI: `/api/${hubId}/${portalId}/hubspot-object-forms/:fromObjectTypeId/:fromRecordId/disassociate/:toObjectTypeId${param}`,
    removeExistingAPI: `/api/${hubId}/${portalId}/hubspot-object-forms/:fromObjectTypeId/:fromRecordId/disassociate/:toObjectTypeId`,
    // updateAPI: `/api/${hubId}/${portalId}/hubspot-object-forms/${hubspotObjectTypeId}/fields/:formId${param}`, // concat ticketId
  };

  return (
    <DynamicComponentView
      key={path}
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

export default ListComponent

export const Route = createFileRoute('/_dynamicPage/$listComponent')({
  component: ListComponent,
  beforeLoad: () => {
    return {
      layout: "MainLayout",
      requiresAuth: true,
    }
  },
})

