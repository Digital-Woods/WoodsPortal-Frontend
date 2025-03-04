const Breadcrumb = (props) => {
  const { id, title, path, location, match } = props;

  const { routes, setRoutes } = useRoute();

  const { breadcrumbs, setBreadcrumbs } = useBreadcrumb();

  const convertToBase64 = (str = []) => {
    const base64 = btoa(str);
    return base64;
  };

  const decodeToBase64 = (base64) => {
    const decodedStr = atob(base64);
    return decodedStr;
  };

  const getParentObjectUrl = () => {
    const parentObjectUrl = getCookie(env.ASSOCIATION_VIEW_URL_KEY)
    return JSON.parse(parentObjectUrl)
  };
  
  useEffect(() => {
    let item= [];
    if(getParam('parentObjectName')) {
      item.push(getParentObjectUrl())
    }
    item.push({
      name: path === "/association" ? match?.params?.name : title,
      path: `${location?.pathname}${location?.search || ""}`,
      routeName: match?.url,
    });

    // let item = [
    //   {
    //     name: path === "/association" ? match?.params?.name : title,
    //     path: `${location?.pathname}${location?.search || ""}`,
    //     routeName: match?.url,
    //   },
    // ];

    const mRoute = routes.find((route) => route.path === match?.url);

    let breadcrumb = getParam("b");

    let breadcrumbItems = breadcrumb
      ? JSON.parse(decodeToBase64(breadcrumb))
      : breadcrumbs;

    let index = breadcrumbItems.findIndex(
      (breadcrumb) => breadcrumb.routeName === match?.url
    );

    let updatedBreadcrumbs =
      index !== -1 ? breadcrumbItems.slice(0, index + 1) : breadcrumbItems;

    let foundBreadcrumb = updatedBreadcrumbs.find(
      (breadcrumb) => breadcrumb.routeName === match?.url
    );

    if (!foundBreadcrumb) {
      updatedBreadcrumbs = updatedBreadcrumbs
        ? [...updatedBreadcrumbs, ...item]
        : [];
    }

    if (mRoute) {
      const base64 = convertToBase64(JSON.stringify(item));
      setParam("b", base64);
      setBreadcrumbs(item);
    } else {
      const base64 = convertToBase64(JSON.stringify(updatedBreadcrumbs));
      setParam("b", base64);
      setBreadcrumbs(updatedBreadcrumbs);
    }
  }, [routes]);

  return (
    <div className="text-xs">
      <ol className="flex dark:text-white flex-wrap">
        {breadcrumbs.map((breadcrumb, index) => {
          return (
            <li key={index} className="flex items-center">
              <Link
                className={`capitalize hover:underline ${
                  index == 0
                    ? "text-sidelayoutTextColor"
                    : "text-sidelayoutTextColor/90"
                } hover:text-sidelayoutTextColor/90 dark:text-white hover:text-white/90`}
                to={breadcrumb.path}
              >
                {getParamHash(formatCustomObjectLabel(breadcrumb.name))}
              </Link>
              {index < breadcrumbs.length - 1 && (
                <span className="mx-1 text-sidelayoutTextColor dark:text-white">
                  <Chevron transform="rotate(180)" />
                </span>
              )}
            </li>
          );
        })}
      </ol>
    </div>
  );
};
