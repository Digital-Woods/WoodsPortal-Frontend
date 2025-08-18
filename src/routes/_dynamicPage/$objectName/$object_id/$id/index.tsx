import { ApiDetails } from "@/components/ApiDetails";
import { ModuleDetails } from "@/components/ModuleDetails";
import { moduleIframeListOptions } from "@/data/hubSpotData";
import { useBreadcrumb } from "@/state/use-breadcrumb";
import { getParam } from "@/utils/param";
import { createFileRoute } from "@tanstack/react-router"
import { env } from "@/env";

const Details = () => {

  const { objectName: path, object_id: objectId, id } = Route.useParams();

  const { breadcrumbs } = useBreadcrumb();

  const decodeToBase64 = (base64: any) => {
    const decodedStr = atob(base64);
    return decodedStr;
  };

  let breadcrumb = getParam("b");

  let breadcrumbItems = breadcrumb
    ? JSON.parse(decodeToBase64(breadcrumb))
    : breadcrumbs;

  let tabName = breadcrumbItems.length > 0 ? (breadcrumbItems.length > 1 ? breadcrumbItems[breadcrumbItems.length - 2]?.name : breadcrumbItems[0]?.name) : "";
  
  // Find the object in moduleIframeListOptions that matches the objectId

  // const matchedObject = 
  // moduleIframeListOptions.find((item) => item.hubspotObjectTypeId && item.label === objectId && tabName ) || '';

  // const matchedObject = moduleIframeListOptions.find(
  //   (item) => item.hubspotObjectTypeId === objectId && item.label === tabName
  // ) || '';
  
  // // Extract propertyName and showIframe from the matched object
  // const propertyName = matchedObject.propertyName || '';
  // const showIframe = matchedObject.showIframe || false;

  const matchedObject: any = moduleIframeListOptions.find((item: any) => item.hubspotObjectTypeId === objectId && item.label === tabName) || {};
  // const matchedObject = moduleIframeListOptions.find((item) => item.hubspotObjectTypeId === objectId && item.label === tabName) || {};
  // console.log(moduleIframeListOptions,'moduleIframeListOptions');
  // Extract propertyName and showIframe from the matched object
  // const propertyName = matchedObject.properties_value ? matchedObject.properties_value.split(',') : [];
  const propertyName = matchedObject.iframeProperties ? matchedObject.iframeProperties : [];
  const showIframe = matchedObject.showIframe || false;

  return (
    <div className="bg-sidelayoutColor mt-[calc(var(--nav-height)-1px)] dark:bg-dark-300">
    <div className={`bg-cleanWhite dark:bg-dark-200`}>
      {env.VITE_DATA_SOURCE_SET !== true ? (
        <ApiDetails objectId={objectId} path={path} id={id} propertyName={propertyName} showIframe={showIframe} />
      ) : (
        <ModuleDetails objectId={objectId} path={path} id={id} propertyName={propertyName} showIframe={showIframe}  />
      )
      }
    </div>
    </div>
  );
};

export default Details

export const Route = createFileRoute('/_dynamicPage/$objectName/$object_id/$id/')({
  component: Details,
  beforeLoad: () => {
    return {
      layout: "MainLayout",
      requiresAuth: true,
    }
  },
})
