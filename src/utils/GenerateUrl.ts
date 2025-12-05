import { useRouter } from '@tanstack/react-router'
import { getRouteMenu } from './param'
import { encodeObject, decodeObject } from './compress'

const keyMap: Record<string, string> = {
  dp: 'defPermissions',
  n: 'name',
  sort: 'sort',
  o_t_id: 'objectTypeId',
  s: 'search',
  fPn: 'filterPropertyName',
  fO: 'filterOperator',
  fV: 'filterValue',
  c: 'cache',
  isPC: 'isPrimaryCompany',
  v: 'view',
  l: 'limit',
  pt: 'path',
  p: 'page',
  aPip: 'activePipeline',
  aT: 'activeTab',
  cT: 'create',
  dP: 'display',
  dL: 'display_label',
  pId: 'pipeline_id',
}

// ✅ Deep map function
function mapKeysDeep(obj: any, keyMap: Record<string, string>): any {
  if (Array.isArray(obj)) {
    return obj.map((item) => mapKeysDeep(item, keyMap));
  } else if (obj !== null && typeof obj === 'object') {
    return Object.entries(obj).reduce((acc, [key, value]) => {
      const mappedKey = keyMap[key] || key; // rename if matched
      acc[mappedKey] = mapKeysDeep(value, keyMap); // recurse into nested
      return acc;
    }, {} as Record<string, any>);
  }
  return obj;
}

const buildParentRoute = (props: any, search: any, router: any) => {
  const { pathname } = router.state.location
  const routeMenu: any = getRouteMenu(pathname)

  const breadcrumbItems: any = [
    {
      n: routeMenu?.title,
      o_t_id: routeMenu?.path,
    },
  ]
  return buildChildRoute(props, search, breadcrumbItems)
}

const buildChildRoute = (props: any, search: any, breadcrumbItems: any) => {
  let breadcrumbs = [...breadcrumbItems]
  let breadcrumbType: string = 'child'
  if (breadcrumbItems.length === 1) {
    breadcrumbType = 'root'
  } else if (breadcrumbItems.length === 2) {
    breadcrumbType = 'root_details'
  }

  if (breadcrumbType === 'root') {
    const newCrumb: any = {
      n: props?.name,
      o_t_id: props?.objectTypeId,
      o_r_id: props?.recordId,
    }

    // ✅ Add params if available
    // if (props.params) {
    //   newCrumb.p = props.params
    // }

    if(props?.isPC) {
      newCrumb.prm = {
        isPC: props?.isPC
      }
    }

    breadcrumbs.push(newCrumb)
  } else {
    const lastItem = breadcrumbs[breadcrumbs.length - 1]

    if ((props?.objectTypeId != '0-5' && breadcrumbs.length > 2) && (lastItem?.o_t_id === props?.objectTypeId)) { // 1st check for only association ticket object, 2nd check for all associated object
      const newCrumb: any = {
        n: props?.name,
        o_t_id: props?.objectTypeId,
        o_r_id: props?.recordId,
      }

      // ✅ Add params if available
      // if (props.params) {
      //   newCrumb.p = props.params
      // }

      
      if(props?.isPC) {
        newCrumb.prm = {
          isPC: props?.isPC
        }
      }

      breadcrumbs.push(newCrumb)
    } else {
      const lastItem = breadcrumbs[breadcrumbs.length - 1]

      // if associated data have no parent
      const parent: any = {
        n: props?.associationLabel || props?.name,
        o_t_id: props?.objectTypeId,
      }

      if(props?.tableParam) {
        parent.prm = props?.tableParam
      }

      if(props?.defPermissions) {
        parent.dp = props?.defPermissions
      }
      
      if(lastItem?.o_t_id && lastItem?.o_r_id) { // check if last item have no parent
        breadcrumbs.push(parent)  // association list data
      }
      // end

      if (props?.recordId) { // association single data
        const newCrumb: any = {
          n: props?.name,
          o_t_id: props?.objectTypeId,
          o_r_id: props?.recordId,
        }

        // ✅ Add params if available
        // if (props.params) {
        //   newCrumb.p = props.params
        // }

        if(props?.isPC) {
          newCrumb.prm = {
            isPC: props?.isPC
          }
        }

        breadcrumbs.push(newCrumb)
      }
    }
  }
  return generateUrl(props, breadcrumbType, breadcrumbs)
}

const generateUrl = (props: any, breadcrumbType: string, breadcrumbs: any) => {
  const newBase64 = convertToBase64(breadcrumbs)
  let url = ''
  if (props?.objectTypeId && props?.recordId) {
    url = `/${props?.recordId}/${props?.objectTypeId}/${props?.recordId}?b=${newBase64}`
  } else {
    url = `/association/${props?.objectTypeId}?b=${newBase64}`
  }
  return url
}

const convertToBase64 = (str: any = []) => {
  // try {
  //   return btoa(unescape(encodeURIComponent(str)))
  // } catch (err) {
  //   return ''
  // }

  // if(str) {
  //   const b64 = toB64(compressAuto(str));
  //   return b64 || '';
  // }
  // return ''

  return encodeObject(str);
}

const decodeToBase64 = (base64: string) => {
  // try {
  //   return JSON.parse(decodeURIComponent(escape(atob(base64))))
  // } catch (err) {
  //   console.warn('Base64 decode failed:', base64, err)
  //   return ''
  // }
  
  // if(base64) {
  //   const b = base64?.replace(/ /g, "+");
  //   const rt2 = decompressAuto(fromB64(b));
  //   return JSON.parse(rt2) ;
  // }
  // return ''

   try {
    const decoded = decodeObject<any>(base64);
    return decoded
  } catch (err: any) {
    console.warn('Base64 decode failed:', base64, err)
    return ''
  }
}

// export const useMakeLink = (props: any) => {
//   const router = useRouter()
//   const search: any = router.state.location.search

//   if (!search.b) {
//     return setParentRoute(props, search)
//   } else {
//     let breadcrumbItems = decodeToBase64(search.b) || []
//     return setChildRoute(props, search, breadcrumbItems)
//   }
// }

export const useMakeLink = () => {
  const router = useRouter()
  const search: any = router.state.location.search

  const makeLink = (props: any) => {
    if (!search.b || "isPC" in props) {  // check props?.isPC if dashbaord sidebar
      return buildParentRoute(props, search, router)   // pure helper
    } else {
      const breadcrumbItems = decodeToBase64(search?.b) || []
      return buildChildRoute(props, search, breadcrumbItems) // pure helper
    }
  }

  return { makeLink }
}

export const getRouteDetails = () => {
  const router = useRouter();
  const search: any = router.state.location.search;

  const breadcrumbs = decodeToBase64(search?.b) || [];
  const lastItem = breadcrumbs[breadcrumbs.length - 1];
  const mapped = lastItem ? mapKeysDeep(lastItem, keyMap) : null;

  return { routeDetails: mapped };
};

export const getParamDetails = (props?: any, isDetailsPage: boolean = false) => {
  const router = useRouter()
  const search: any = router.state.location.search
  let breadcrumbs = decodeToBase64(search?.b) || []

  let mediatorObjectTypeId = ''
  let mediatorObjectRecordId = ''
  let parentObjectTypeId = ''
  let parentObjectRecordId = ''
  // let bParams = ''
  let lastItem = breadcrumbs[breadcrumbs.length - 1]
  const lastItem2 = breadcrumbs[breadcrumbs.length - 2]
  const lastItem3 = breadcrumbs[breadcrumbs.length - 3]

  if (isDetailsPage === true && lastItem && "prm" in lastItem) { // if details page then dont deent prm key
    delete lastItem.prm;
  }

  if (breadcrumbs.length > 1) {
    if (props?.type === 'ticket' || props?.type === 'association') {
      mediatorObjectTypeId = breadcrumbs[1]?.o_t_id || ''
      mediatorObjectRecordId = breadcrumbs[1]?.o_r_id || ''
      parentObjectTypeId = lastItem?.o_t_id || ''
      parentObjectRecordId = lastItem?.o_r_id || ''
      // bParams = lastItem?.p || ''
    } else {
      if (breadcrumbs.length > 2) {
        mediatorObjectTypeId = breadcrumbs[1]?.o_t_id || ''
        mediatorObjectRecordId = breadcrumbs[1]?.o_r_id || ''
      }

      if (!lastItem?.o_r_id && breadcrumbs.length > 2) {
        parentObjectTypeId = lastItem2?.o_t_id || ''
        parentObjectRecordId = lastItem2?.o_r_id || ''
        // bParams = lastItem?.p || ''
      }

      if (lastItem?.o_r_id && breadcrumbs.length > 2) {
        parentObjectTypeId = lastItem3?.o_t_id || ''
        parentObjectRecordId = lastItem3?.o_r_id || ''
        // bParams = lastItem?.p || ''
      }
      
      if(lastItem2?.o_t_id === '0-5' && !parentObjectTypeId && !parentObjectRecordId) {
        parentObjectTypeId = lastItem2?.o_t_id || ''
        parentObjectRecordId = lastItem2?.o_r_id || ''
      }
     
    }
  }
  let paramsObject: any = {}

  // if isPrimaryCompany
  // const arr = Array.from(new URLSearchParams(lastItem?.p))
  // const map = new Map(arr)
  // if (map.get('isPrimaryCompany') === 'true') {
  //   paramsObject['isPrimaryCompany'] = true
  // } else {
  //   // if not isPrimaryCompany
  //   if (parentObjectTypeId && parentObjectRecordId) {
  //     paramsObject['parentObjectTypeId'] = parentObjectTypeId
  //     paramsObject['parentObjectRecordId'] = parentObjectRecordId
  //   }
  //   if (mediatorObjectTypeId && mediatorObjectRecordId) {
  //     paramsObject['mediatorObjectTypeId'] = mediatorObjectTypeId
  //     paramsObject['mediatorObjectRecordId'] = mediatorObjectRecordId
  //   }
  // }

  if (breadcrumbs[0]?.prm?.isPC || breadcrumbs[1]?.prm?.isPC || lastItem?.prm?.isPC) { // 1st check fot normal object, 2dn & 3rd and check for db associated data
    paramsObject['isPrimaryCompany'] = true
  }


  if (parentObjectTypeId && parentObjectRecordId) {
    paramsObject['parentObjectTypeId'] = parentObjectTypeId
    paramsObject['parentObjectRecordId'] = parentObjectRecordId
  }
  if (mediatorObjectTypeId && mediatorObjectRecordId) {
    paramsObject['mediatorObjectTypeId'] = mediatorObjectTypeId
    paramsObject['mediatorObjectRecordId'] = mediatorObjectRecordId
  }

  const mappedLastItemParam = Object.fromEntries(
    Object.entries(lastItem?.prm || {}).map(([key, value]) => [
      keyMap[key] || key, // use mapped name if exists, else keep original
      value,
    ])
  );

  let queryString = null

  if (props?.type === 'association') {  // if association association then don't need mappedLastItemParam 
    queryString = new URLSearchParams({...paramsObject, ...{cache: false}} as any).toString()
  // } else if (breadcrumbs.length < 2) { // if root path then don't need paramsObject 
  //   paramsObject = {}
  //   queryString = new URLSearchParams({...mappedLastItemParam} as any).toString()
  } else {
    queryString = new URLSearchParams({...paramsObject, ...mappedLastItemParam} as any).toString()
  }




  //   let params = bParams ? `${bParams}&${queryString}` : `?${queryString}`
  let params: any = queryString ? `?${queryString}` : ''

  // if (breadcrumbs.length < 2 && map.get('isPrimaryCompany') != 'true')

  // if (breadcrumbs.length < 2 && !breadcrumbs[0]?.prm?.isPC)
  //   params = ''

  // const mParamsObject: any = {
  //   ...paramsObject,
  //   ...(params ? { params } : {}),
  // };

  return {
    breadcrumbs,
    // paramsObject:  Object.keys(mParamsObject).length === 0 ? null : mParamsObject,
    paramsObject:  paramsObject,
    params,
  }
}

export const getBreadcrumbs = () => {
  const router = useRouter()
  const search: any = router.state.location.search
  
  let breadcrumbs = decodeToBase64(search?.b) || []

  if (!breadcrumbs && breadcrumbs.length < 1) return []

  const updated = breadcrumbs.map((breadcrumb: any, index: any) => {
    return generatePath(breadcrumbs, breadcrumb, index)
  })

  if (updated.length < 1) {
    const router = useRouter()
    const { pathname } = router.state.location
    const routeMenu: any = getRouteMenu(pathname)
    return [
      {
        name: routeMenu?.title,
        path: routeMenu?.path,
      },
    ]
  }
  return updated
}

const generatePath = (breadcrumbs: any, breadcrumb: any, index: any) => {
  const bc = convertToBase64(breadcrumbs.slice(0, index + 1))
  if (index === 0) {
    return {
      name: breadcrumb?.n,
      path: `/${breadcrumb?.pt || breadcrumb?.o_t_id}?b=${bc}`,
    }
  } else if (index === 1) {
    return {
      name: breadcrumb?.n,
      path: `/${breadcrumb?.o_r_id}/${breadcrumb?.o_t_id}/${breadcrumb?.o_r_id}?b=${bc}`,
    }
  } else {
    if (breadcrumb?.o_t_id && breadcrumb?.o_r_id) {
      return {
        name: breadcrumb?.n,
        path: `/${breadcrumb?.o_r_id}/${breadcrumb?.o_t_id}/${breadcrumb?.o_r_id}?b=${bc}`,
      }
    } else {
      return {
        name: breadcrumb?.n,
        path: `/association/${breadcrumb?.o_t_id}?b=${bc}`,
      }
    }
  }
}

export const getTableTitle = (
  componentName: string,
  title: string,
  ticketTableTitle: string,
) => {
  const router = useRouter()
  const search: any = router.state.location.search
  let breadcrumbs = decodeToBase64(search?.b) || []

  if (breadcrumbs.length < 1) {
    const router = useRouter()
    const { pathname } = router.state.location
    const routeMenu: any = getRouteMenu(pathname)

    breadcrumbs = [
      {
        n: routeMenu?.title,
        pt: routeMenu?.path,
      },
    ]
  }

  let associatedtableTitleSingular: any = ''
  let tableTitle: any = ''
  let singularTableTitle: any = ''

  if (breadcrumbs && breadcrumbs.length > 0) {
    const lastItem: any = breadcrumbs[breadcrumbs.length - 1]
    const last: any = lastItem ? generatePath(breadcrumbs, lastItem, breadcrumbs.length - 1) : null
    const previousItem: any = breadcrumbs[breadcrumbs.length - 2]
    const previous: any = previousItem ? generatePath(breadcrumbs, previousItem, breadcrumbs.length - 2) : null
    const singularLastName = last?.name

    associatedtableTitleSingular = singularLastName
    if (componentName != 'ticket') {
      tableTitle = previous?.name
        ? { last: last, previous: previous }
        : { last: last }
      singularTableTitle = previous?.name
        ? `${singularLastName} with ${previous?.name}`
        : singularLastName
    } else {
      const ticketTableTitleSingular = ticketTableTitle.endsWith('s')
        ? ticketTableTitle.slice(0, -1)
        : ticketTableTitle
      tableTitle = { last: { name: title } }

      singularTableTitle = previous?.name
        ? `${ticketTableTitleSingular} with ${singularLastName} `
        : ticketTableTitleSingular
    }
  }
  return { associatedtableTitleSingular, tableTitle, singularTableTitle }
}

export const getFormTitle = (
  type: string,
  title: string,
  activeTab: string,
) => {
  const router = useRouter()
  const search: any = router.state.location.search
  let breadcrumbs = decodeToBase64(search?.b) || []

  if (breadcrumbs.length < 1) {
    const router = useRouter()
    const { pathname } = router.state.location
    const routeMenu: any = getRouteMenu(pathname)
    breadcrumbs = [
      {
        n: routeMenu?.title,
        pt: routeMenu?.path,
      },
    ]
  }

  let objectName: any = ''
  let puralObjectName: any = ''
  let dialogTitle: any = ''

  if (breadcrumbs && breadcrumbs?.length > 0) {
    const last: any = breadcrumbs[breadcrumbs?.length - 1]
    const lastName = last?.n
    const mTitle = title
    if (type === 'association' && breadcrumbs && breadcrumbs?.length > 0) {
      objectName = title
      puralObjectName = title
      dialogTitle = `${activeTab == 'addNew' ? `Create a new ${mTitle} for ${nameTrancate(lastName)}` : `Associate an Existing ${mTitle} with ${nameTrancate(lastName)}`}`
    } else {
      const singularLastName = typeof lastName === 'string' && lastName?.endsWith('s')
        ? lastName.slice(0, -1)
        : lastName
      objectName = singularLastName
      puralObjectName = lastName
      dialogTitle = `${activeTab == 'addNew' ? `Create a new ${mTitle?.includes('with') ? nameTrancate(mTitle?.replace('with', 'for')) : nameTrancate(mTitle)}` : `Associate an Existing ${nameTrancate(mTitle)}`}`
    }
  }
  return { objectName, puralObjectName, dialogTitle }
}

const nameTrancate = (name: any) => {
  return name?.length > 30 ? `${name?.slice(0, 30) + '...'}` : name
}

// export const updateLink = (props: any) => {

//   const router = useRouter()
//   const search: any = router.state.location.search
//   let breadcrumbs = decodeToBase64(search.b) || []

//   if (breadcrumbs.length < 1) {
//     const router = useRouter()
//     const { pathname } = router.state.location
//     const routeMenu: any = getRouteMenu(pathname)
//     breadcrumbs = [
//       {
//         name: routeMenu?.title,
//         path: routeMenu?.path,
//       },
//     ]
//   }

//   const lastItem = breadcrumbs[breadcrumbs.length - 1]

//   return lastItem
// }

export const useUpdateLink = () => {
  const router = useRouter()

  // const updateLink = (props: any, displayName : string = "prm") => {
  //   const search: any = router.state.location.search
  //   let breadcrumbs = decodeToBase64(search?.b) || []

  //   if (breadcrumbs.length < 1) {
  //     const { pathname } = router.state.location
  //     const routeMenu: any = getRouteMenu(pathname)
  //     breadcrumbs = [
  //       {
  //         n: routeMenu?.title,
  //         p: routeMenu?.path,
  //       },
  //     ]
  //   }

  //   if (displayName) {
  //     breadcrumbs[breadcrumbs.length - 1][displayName] = {...breadcrumbs[breadcrumbs.length - 1][displayName], ...props}
  //   } else {
  //     breadcrumbs[breadcrumbs.length - 1] = {...breadcrumbs[breadcrumbs.length - 1], ...props}
  //   }
  //   const newBase64 = convertToBase64(JSON.stringify(breadcrumbs))
  //   updateBParam(router, newBase64)
  // }

  const updateLink = (props: any, displayName: string = "prm") => {
    const search: any = router.state.location.search;
    let breadcrumbs = decodeToBase64(search?.b) || [];

    if (breadcrumbs.length < 1) {
      const { pathname } = router.state.location;
      const routeMenu: any = getRouteMenu(pathname);
      breadcrumbs = [
        {
          n: routeMenu?.title,
          pt: routeMenu?.path,
        },
      ];
    }

    // Get the last breadcrumb
    const lastBreadcrumb = breadcrumbs[breadcrumbs.length - 1];

    // If displayName is provided, apply nested update
    if (displayName) {
      setDeep(lastBreadcrumb, displayName, {
        ...(getDeep(lastBreadcrumb, displayName) || {}),
        ...props,
      });
    } else {
      Object.assign(lastBreadcrumb, props);
    }

    const newBase64 = convertToBase64(breadcrumbs);
    updateBParam(router, newBase64);
  };

  // --- Helpers ---

  function setDeep(obj: any, path: string, value: any) {
    const keys = path.split(".");
    let curr = obj;
    for (let i = 0; i < keys.length - 1; i++) {
      if (!curr[keys[i]] || typeof curr[keys[i]] !== "object") {
        curr[keys[i]] = {};
      }
      curr = curr[keys[i]];
    }
    curr[keys[keys.length - 1]] = value;
  }

  function getDeep(obj: any, path: string) {
    return path.split(".").reduce((acc, key) => acc?.[key], obj);
  }


  // const filterParams = (displayName : string = "prm") => {
  //   const search: any = router.state.location.search
  //   let breadcrumbs = decodeToBase64(search?.b) || []
  //   if (breadcrumbs.length < 1) return null
  //   const lastItem = breadcrumbs[breadcrumbs.length - 1]
  //   const expandKeys = (obj: Record<string, any>) => {
  //     return Object.fromEntries(
  //       Object.entries(obj).map(([key, value]) => [
  //         keyMap[key] || key, // map if exists, else keep original
  //         value,
  //       ]),
  //     )
  //   }
  //   const output = displayName && lastItem[displayName] ? expandKeys(lastItem[displayName]) : lastItem
  //   return output
  // }

  const getLinkParams = (displayName: string = "prm") => { // for API param
    const search: any = router.state.location.search;
    let breadcrumbs = decodeToBase64(search?.b) || [];

    if (breadcrumbs.length < 1) return null;

    const lastItem = breadcrumbs[breadcrumbs.length - 1];

    // Helper to deeply get a nested value
    const getDeep = (obj: any, path: string) => {
      return path.split(".").reduce((acc, key) => acc?.[key], obj);
    };

    // Map keys if needed
    const expandKeys = (obj: Record<string, any>) => {
      return Object.fromEntries(
        Object.entries(obj).map(([key, value]) => [
          keyMap[key] || key, // map if exists, else keep original
          value,
        ])
      );
    };

    // Get nested value if displayName has dots
    const nestedValue = displayName ? getDeep(lastItem, displayName) : null;

    const output = nestedValue ? expandKeys(nestedValue) : null;

    return output;
  };

  const filterParams = (displayName: string = "prm") => { // for select old value
    const search: any = router.state.location.search;
    let breadcrumbs = decodeToBase64(search?.b) || [];

    if (breadcrumbs.length < 1) return null;

    const lastItem = breadcrumbs[breadcrumbs.length - 1];

    // Helper to deeply get a nested value
    const getDeep = (obj: any, path: string) => {
      return path.split(".").reduce((acc, key) => acc?.[key], obj);
    };

    // Map keys if needed
    const expandKeys = (obj: Record<string, any>) => {
      return Object.fromEntries(
        Object.entries(obj).map(([key, value]) => [
          keyMap[key] || key, // map if exists, else keep original
          value,
        ])
      );
    };

    // Get nested value if displayName has dots
    const nestedValue = displayName ? getDeep(lastItem, displayName) : null;

    const output = nestedValue ? expandKeys(nestedValue) : expandKeys(lastItem);

    return output;
  };

  return { updateLink, getLinkParams, filterParams }
}

const updateBParam = (router: any, newValue: string) => {
  const currentSearch = router.state.location.search || {}

  router.navigate({
    to: router.state.location.pathname, // stay on same path
    search: {
      ...currentSearch,
      b: newValue, // add or replace `b`
    },
    replace: true, // don't push new history entry
  })
}

// const updateBParam = (router: any, newValue: string) => {
//     const currentSearch = router.state.location.search || {};

//     // Replace or add `b`
//     const updatedSearch = {
//       ...currentSearch,
//       b: newValue,
//     };

//     router.navigate({
//       to: router.state.location.pathname, // stay on same path
//       search: updatedSearch,              // update query params
//       replace: true,                      // replace history entry
//     });
//   };
