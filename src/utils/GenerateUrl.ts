import { useRouter } from '@tanstack/react-router'
import { getRouteMenu } from './param'
import { compressAuto, decompressAuto, fromB64, toB64 } from './compress'

const buildParentRoute = (props: any, search: any, router: any) => {
  const { pathname } = router.state.location
  const routeMenu: any = getRouteMenu(pathname)

  const breadcrumbItems: any = [
    {
      n: routeMenu.title,
      o_t_id: routeMenu.path,
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
      n: props.name,
      o_t_id: props.objectTypeId,
      o_r_id: props.recordId,
    }

    // ✅ Add params if available
    if (props.params) {
      newCrumb.p = props.params
    }

    breadcrumbs.push(newCrumb)
  } else {
    const lastItem = breadcrumbs[breadcrumbs.length - 1]

    if (lastItem?.o_t_id === props.objectTypeId) {
      const newCrumb: any = {
        n: props.name,
        o_t_id: props.objectTypeId,
        o_r_id: props.recordId,
      }

      // ✅ Add params if available
      if (props.params) {
        newCrumb.p = props.params
      }

      breadcrumbs.push(newCrumb)
    } else {
      breadcrumbs.push({
        n: props?.associationLabel || props?.name,
        o_t_id: props.objectTypeId,
      })

      if (props.recordId) {
        const newCrumb: any = {
          n: props.name,
          o_t_id: props.objectTypeId,
          o_r_id: props.recordId,
        }

        // ✅ Add params if available
        if (props.params) {
          newCrumb.p = props.params
        }

        breadcrumbs.push(newCrumb)
      }
    }
  }
  console.log('breadcrumbs', breadcrumbs)
  return generateUrl(props, breadcrumbType, breadcrumbs)
}

const generateUrl = (props: any, breadcrumbType: string, breadcrumbs: any) => {
  const newBase64 = convertToBase64(JSON.stringify(breadcrumbs))
  console.log('newBase64', newBase64)

    // const rt2 = decompressAuto(fromB64(newBase64));
    // console.log('rt2_1', rt2)

  let url = ''
  if (props?.objectTypeId && props?.recordId) {
    url = `/${props.recordId}/${props.objectTypeId}/${props.recordId}?b=${newBase64}`
  } else {
    url = `/association/${props.objectTypeId}?b=${newBase64}`
  }
  return url
}

const convertToBase64 = (str: any = []) => {
  try {
    return btoa(unescape(encodeURIComponent(str)))
  } catch (err) {
    console.warn('Base64 encode failed:', str, err)
    return ''
  }

  // if(str) {
  //   const b64 = toB64(compressAuto(str));
  //   console.log('b64', b64)
  //   return b64 || '';
  // }
  // return ''
}

const decodeToBase64 = (base64: string) => {
  try {
    return JSON.parse(decodeURIComponent(escape(atob(base64))))
  } catch (err) {
    console.warn('Base64 decode failed:', base64, err)
    return ''
  }
  
  // if(base64) {
  //   const b = base64?.replace(/ /g, "+");
  //   console.log('base64', base64)
  //   console.log('b', b)
  //   const rt2 = decompressAuto(fromB64(b));
  //   console.log('rt2', rt2)
  //   return JSON.parse(rt2) ;
  // }
  // return ''
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
    if (!search.b) {
      return buildParentRoute(props, search, router)   // pure helper
    } else {
      const breadcrumbItems = decodeToBase64(search?.b) || []
      return buildChildRoute(props, search, breadcrumbItems) // pure helper
    }
  }

  return { makeLink }
}

export const getParamDetails = (props?: any) => {
  const router = useRouter()
  const search: any = router.state.location.search
  let breadcrumbs = decodeToBase64(search?.b) || []

  let mediatorObjectTypeId = ''
  let mediatorObjectRecordId = ''
  let parentObjectTypeId = ''
  let parentObjectRecordId = ''
  let bParams = ''
  const lastItem = breadcrumbs[breadcrumbs.length - 1]
  const lastItem2 = breadcrumbs[breadcrumbs.length - 2]
  const lastItem3 = breadcrumbs[breadcrumbs.length - 3]

  // console.log('lastItem', lastItem)
  // console.log('lastItem2', lastItem2)
  // console.log('lastItem3', lastItem3)

  // console.log('breadcrumbs', breadcrumbs)
  if (breadcrumbs.length > 1) {
    if (props?.type === 'ticket') {
      mediatorObjectTypeId = breadcrumbs[1]?.o_t_id || ''
      mediatorObjectRecordId = breadcrumbs[1]?.o_r_id || ''
      parentObjectTypeId = lastItem?.o_t_id || ''
      parentObjectRecordId = lastItem?.o_r_id || ''
      bParams = lastItem?.p || ''
    } else {
      if (breadcrumbs.length > 2) {
        mediatorObjectTypeId = breadcrumbs[1]?.o_t_id || ''
        mediatorObjectRecordId = breadcrumbs[1]?.o_r_id || ''
      }

      if (!lastItem?.o_r_id && breadcrumbs.length > 4) {
        parentObjectTypeId = lastItem2?.o_t_id || ''
        parentObjectRecordId = lastItem2?.o_r_id || ''
        bParams = lastItem?.p || ''
      }

      if (lastItem?.o_r_id && breadcrumbs.length > 4) {
        parentObjectTypeId = lastItem3?.o_t_id || ''
        parentObjectRecordId = lastItem3?.o_r_id || ''
        bParams = lastItem?.p || ''
      }
    }
  }
  let paramsObject: any = {}

  // console.log('props?.type', props?.type)
  // console.log('mediatorObjectTypeId', mediatorObjectTypeId)
  // console.log('mediatorObjectRecordId', mediatorObjectRecordId)
  // console.log('parentObjectTypeId', parentObjectTypeId)
  // console.log('parentObjectRecordId', parentObjectRecordId)

  // if isPrimaryCompany
  const arr = Array.from(new URLSearchParams(lastItem.p))
  const map = new Map(arr)
  if (map.get('isPrimaryCompany') === 'true') {
    paramsObject['isPrimaryCompany'] = true
  } else {
    // if not isPrimaryCompany
    if (parentObjectTypeId && parentObjectRecordId) {
      paramsObject['parentObjectTypeId'] = parentObjectTypeId
      paramsObject['parentObjectRecordId'] = parentObjectRecordId
    }
    if (mediatorObjectTypeId && mediatorObjectRecordId) {
      paramsObject['mediatorObjectTypeId'] = mediatorObjectTypeId
      paramsObject['mediatorObjectRecordId'] = mediatorObjectRecordId
    }
  }

  // console.log('paramsObject', paramsObject)

  const queryString = new URLSearchParams(paramsObject as any).toString()

  //   let params = bParams ? `${bParams}&${queryString}` : `?${queryString}`
  let params = bParams ? `?${queryString}` : `?${queryString}`

  if (breadcrumbs.length < 2 && map.get('isPrimaryCompany') != 'true')
    params = ''

  // console.log('params_1', params)
  return {
    breadcrumbs,
    paramsObject: { ...paramsObject, params: bParams },
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
  const bc = convertToBase64(JSON.stringify(breadcrumbs.slice(0, index + 1)))
  // console.log('breadcrumb', breadcrumb)
  if (index === 0) {
    return {
      name: breadcrumb.n,
      path: `/${breadcrumb?.p || breadcrumb.o_t_id}?b=${bc}`,
    }
  } else if (index === 1) {
    return {
      name: breadcrumb.n,
      path: `/${breadcrumb.o_r_id}/${breadcrumb.o_t_id}/${breadcrumb.o_r_id}?b=${bc}`,
    }
  } else {
    if (breadcrumb.o_t_id && breadcrumb.o_r_id) {
      return {
        name: breadcrumb.n,
        path: `/${breadcrumb.o_r_id}/${breadcrumb.o_t_id}/${breadcrumb.o_r_id}?b=${bc}`,
      }
    } else {
      return {
        name: breadcrumb.n,
        path: `/association/${breadcrumb.o_t_id}?b=${bc}`,
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
        n: routeMenu.title,
        p: routeMenu.path,
      },
    ]
  }

  let associatedtableTitleSingular: any = ''
  let tableTitle: any = ''
  let singularTableTitle: any = ''

  if (breadcrumbs && breadcrumbs.length > 0) {
    const last: any = breadcrumbs[breadcrumbs.length - 1]
    const previous: any = breadcrumbs[breadcrumbs.length - 2]
    const singularLastName = last?.n

    // const lastPath = generatePath(breadcrumbs, last, breadcrumbs.length)
    // const previousPath = generatePath(breadcrumbs, previous, breadcrumbs.length-1)

    // last.path = lastPath?.path
    // previous.path = previousPath?.path

    associatedtableTitleSingular = singularLastName
    if (componentName != 'ticket') {
      tableTitle = previous?.n
        ? { last: last, previous: previous }
        : { last: last }
      singularTableTitle = previous?.n
        ? `${singularLastName} with ${previous?.n}`
        : singularLastName
    } else {
      const ticketTableTitleSingular = ticketTableTitle.endsWith('s')
        ? ticketTableTitle.slice(0, -1)
        : ticketTableTitle
      tableTitle = { last: { name: title } }

      singularTableTitle = previous?.n
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
        n: routeMenu.title,
        p: routeMenu.path,
      },
    ]
  }

  let objectName: any = ''
  let dialogTitle: any = ''

  if (breadcrumbs && breadcrumbs.length > 0) {
    const last: any = breadcrumbs[breadcrumbs.length - 1]
    const lastName = last?.n
    const mTitle = title
    if (type === 'association' && breadcrumbs && breadcrumbs.length > 0) {
      objectName = title
      dialogTitle = `${activeTab == 'addNew' ? `Create a new ${mTitle} for ${nameTrancate(lastName)}` : `Associate an Existing ${mTitle} with ${nameTrancate(lastName)}`}`
    } else {
      const singularLastName = lastName?.endsWith('s')
        ? lastName.slice(0, -1)
        : lastName
      objectName = singularLastName
      dialogTitle = `${activeTab == 'addNew' ? `Create a new ${mTitle.includes('with') ? nameTrancate(mTitle?.replace('with', 'for')) : nameTrancate(mTitle)}` : `Associate an Existing ${nameTrancate(mTitle)}`}`
    }
  }
  return { objectName, dialogTitle }
}

const nameTrancate = (name: any) => {
  return name.length > 30 ? `${name?.slice(0, 30) + '...'}` : name
}

// export const updateLink = (props: any) => {
//   console.log('props', props)

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

//   console.log('lastItem', lastItem)
//   return lastItem
// }

const keyMap: Record<string, string> = {
  sort: 'sort',
  s: 'search',
  fPn: 'filterPropertyName',
  fO: 'filterOperator',
  fV: 'filterValue',
  c: 'cache',
  isPC: 'isPrimaryCompany',
  v: 'view',
  l: 'limit',
  p: 'page',
  aPip: 'activePipeline',
}

export const useUpdateLink = () => {
  const router = useRouter()

  const updateLink = (props: any) => {
    const search: any = router.state.location.search
    let breadcrumbs = decodeToBase64(search?.b) || []

    if (breadcrumbs.length < 1) {
      const { pathname } = router.state.location
      const routeMenu: any = getRouteMenu(pathname)
      breadcrumbs = [
        {
          n: routeMenu?.title,
          p: routeMenu?.path,
        },
      ]
    }

    breadcrumbs[breadcrumbs.length - 1].prm = {...breadcrumbs[breadcrumbs.length - 1].prm, ...props}
    const newBase64 = convertToBase64(JSON.stringify(breadcrumbs))
    updateBParam(router, newBase64)

    // console.log('props', props)
  }

  const filterParams = () => {
    const search: any = router.state.location.search
    let breadcrumbs = decodeToBase64(search?.b) || []
    // console.log('breadcrumbs', breadcrumbs)

    if (breadcrumbs.length < 1) return null
    const lastItem = breadcrumbs[breadcrumbs.length - 1]
    const expandKeys = (obj: Record<string, any>) => {
      return Object.fromEntries(
        Object.entries(obj).map(([key, value]) => [
          keyMap[key] || key, // map if exists, else keep original
          value,
        ]),
      )
    }
    const output = lastItem?.prm ? expandKeys(lastItem?.prm) : null
    // console.log('output', output)
    return output
  }

  return { updateLink, filterParams }
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
