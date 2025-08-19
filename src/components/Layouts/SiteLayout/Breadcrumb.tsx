import { useEffect } from 'react';
import { env } from "@/env";
import { useRoute } from '@/state/use-route';
import { Link } from '@/components/ui/link';
import { getCookie } from '@/utils/cookie';
import { getParam, setParam, getParamHash, getRouteMenu } from '@/utils/param';
import { Chevron } from '@/assets/icons/Chevron';
import { formatCustomObjectLabel } from '@/utils/DataMigration';
import { useBreadcrumb } from '@/state/use-breadcrumb';
import { useRouter } from '@tanstack/react-router'

export const Breadcrumb = (props: any) => {
  const router = useRouter()
  const location = router.state.location
  const { pathname, searchStr, hash } = router.state.location
  // const { id, title, path, match } = props;

  // console.log("title", title)

  const { routes, setRoutes } = useRoute();

  const { breadcrumbs, setBreadcrumbs } = useBreadcrumb();

  const convertToBase64 = (str: any = []) => {
    const base64 = btoa(str);
    return base64;
  };

  const decodeToBase64 = (base64: any) => {
    const decodedStr = atob(base64);
    return decodedStr;
  };

  const getParentObjectUrl = () => {
    const parentObjectUrl = getCookie(env.VITE_ASSOCIATION_VIEW_URL_KEY)
    return parentObjectUrl
  };
  
 useEffect(() => {
  console.log(true)
  let routeMenu = getRouteMenu(pathname)
  const segments = pathname.split('/')

  let item: any[] = []
  if (getParam('parentObjectName')) {
    item.push(getParentObjectUrl())
  }
  item.push({
    name:
      pathname === '/association'
        ? pathname
        : segments.length > 1
        ? segments[1]
        : routeMenu?.title,
    path: `${pathname}${searchStr || ''}`,
    routeName: pathname,
  })

  const mRoute = routes.find((route: any) => route.path === pathname)

  let breadcrumb = getParam('b')
  let breadcrumbItems = breadcrumb
    ? JSON.parse(decodeToBase64(breadcrumb))
    : breadcrumbs

  let index = breadcrumbItems.findIndex(
    (breadcrumb: any) => breadcrumb?.routeName === pathname,
  )

  let updatedBreadcrumbs =
    index !== -1 ? breadcrumbItems.slice(0, index + 1) : breadcrumbItems

  let foundBreadcrumb = updatedBreadcrumbs.find(
    (breadcrumb: any) => breadcrumb?.routeName === pathname,
  )

  if (!foundBreadcrumb) {
    updatedBreadcrumbs = updatedBreadcrumbs
      ? [...updatedBreadcrumbs, ...item]
      : []
  }

  const nextBreadcrumbs = mRoute ? item : updatedBreadcrumbs

  // ✅ Compare JSON instead of Base64
  if (JSON.stringify(nextBreadcrumbs) !== JSON.stringify(breadcrumbItems)) {
    const newBase64 = convertToBase64(JSON.stringify(nextBreadcrumbs))
    setParam('b', newBase64)
    setBreadcrumbs(nextBreadcrumbs)
  }
}, [routes, location.pathname])

  return (
    <div className="text-xs">
      <ol className="flex dark:text-white flex-wrap">
        {breadcrumbs.map((breadcrumb: any, index: any) => {
          return (
            <li key={index} className="flex items-center">
              <Link
                className={`capitalize hover:underline ${
                  index == 0
                    ? "text-sidelayoutTextColor"
                    : "text-sidelayoutTextColor/90"
                } hover:text-sidelayoutTextColor/90 dark:text-white hover:text-white/90`}
                to={breadcrumb?.path}
              >
                {getParamHash(formatCustomObjectLabel(breadcrumb?.name))}
              </Link>
              {index < breadcrumbs.length - 1 && (
                <span className="mx-1 text-sidelayoutTextColor dark:text-white">
                  <Chevron className="rotate-180 origin-center -webkit-transform" />
                </span>
              )}
            </li>
          );
        })}
      </ol>
    </div>
  );
};
