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
  const { pathname, searchStr } = router.state.location
  const { routes } = useRoute();
  const { breadcrumbs, setBreadcrumbs } = useBreadcrumb();

  // Encode to Base64
  const convertToBase64 = (str: any = []) => {
    try {
      return btoa(unescape(encodeURIComponent(str)));
    } catch (err) {
      console.warn("Base64 encode failed:", str, err);
      return "";
    }
  };

  // Decode from Base64 safely
  const decodeToBase64 = (base64: string) => {
    try {
      return decodeURIComponent(escape(atob(base64)));
    } catch (err) {
      console.warn("Base64 decode failed:", base64, err);
      return "";
    }
  };

  const getParentObjectUrl = () => {
    try {
      return getCookie(env.VITE_ASSOCIATION_VIEW_URL_KEY);
    } catch {
      return null;
    }
  };

  useEffect(() => {
    let routeMenu = getRouteMenu(pathname)
    const segments = pathname.split('/')

    // decode pathname safely
    let decodePathName: string = pathname;
    try {
      decodePathName = decodeURIComponent(pathname);
    } catch (err) {
      console.warn("Invalid pathname decode:", pathname, err);
    }

    let item: any[] = []

    // Add parent object if exists
    if (getParam('parentObjectName')) {
      try {
        const parentObjectUrl = JSON.parse(getParentObjectUrl() || "{}")
        if (parentObjectUrl) item.push(parentObjectUrl)
      } catch (err) {
        console.warn("Invalid parent object cookie", err);
      }
    }

    // Add current route item
    item.push({
      name: decodePathName.includes('/association')
        ? segments[segments.indexOf('association') + 1] || 'association'
        : segments.length > 1
          ? segments[1]
          : routeMenu?.title,
      path: `${decodePathName}${searchStr || ''}`,
      routeName: decodePathName,
    })

    const mRoute = routes.find((route: any) => route.path === decodePathName)

    // handle breadcrumb param safely
    let breadcrumb = getParam('b')
    let breadcrumbItems = breadcrumbs
    if (breadcrumb) {
      try {
        breadcrumbItems = JSON.parse(decodeToBase64(breadcrumb)) || breadcrumbs
      } catch (err) {
        console.warn("Invalid breadcrumb param:", breadcrumb, err);
      }
    }

    // ensure valid breadcrumbs
    if (!Array.isArray(breadcrumbItems)) breadcrumbItems = []

    let index = breadcrumbItems.findIndex(
      (breadcrumb: any) => breadcrumb?.routeName === decodePathName,
    )

    let updatedBreadcrumbs =
      index !== -1 ? breadcrumbItems.slice(0, index + 1) : breadcrumbItems

    let foundBreadcrumb = updatedBreadcrumbs.find(
      (breadcrumb: any) => breadcrumb?.routeName === decodePathName,
    )

    if (!foundBreadcrumb) {
      updatedBreadcrumbs = updatedBreadcrumbs
        ? [...updatedBreadcrumbs, ...item]
        : []
    }

    const nextBreadcrumbs = mRoute ? item : updatedBreadcrumbs

    if (JSON.stringify(nextBreadcrumbs) !== JSON.stringify(breadcrumbItems)) {
      const newBase64 = convertToBase64(JSON.stringify(nextBreadcrumbs))
      if (newBase64) {
        setParam('b', newBase64)
      }
      setBreadcrumbs(nextBreadcrumbs)
    } else {
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
                className={`capitalize hover:underline ${index == 0
                  ? "!text-[var(--sidebar-text-color)]"
                  : "!text-[var(--sidebar-text-color)] opacity-90"
                  } hover:text-[var(--sidebar-text-color)] opacity-90 dark:!text-white hover:opacity-90`}
                to={breadcrumb?.path}
              >
                {getParamHash(formatCustomObjectLabel(breadcrumb?.name))}
              </Link>
              {index < breadcrumbs.length - 1 && (
                <span className="mx-1 text-[var(--sidebar-text-color)] dark:text-white">
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
