import { useRouter } from '@tanstack/react-router'
import { getRouteMenu } from './param'

const setParentRoute = (props: any, search: any) => {
  const router = useRouter()
  const { pathname } = router.state.location
  const routeMenu: any = getRouteMenu(pathname)

  const breadcrumbItems: any = [
    {
      n: routeMenu.title,
      o_t_id: routeMenu.path,
    },
  ]
  return setChildRoute(props, search, breadcrumbItems)
}

const setChildRoute = (props: any, search: any, breadcrumbItems: any) => {
  let breadcrumbs = [...breadcrumbItems]
  let breadcrumbType: string = 'child'
  if (breadcrumbItems.length === 1) {
    breadcrumbType = 'root'
  } else if (breadcrumbItems.length === 2) {
    breadcrumbType = 'root_details'
  }

  //   console.log('breadcrumbItems', breadcrumbItems.length)

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
  //   console.log('breadcrumb', breadcrumbs)
  return generateUrl(props, breadcrumbType, breadcrumbs)
}

const generateUrl = (props: any, breadcrumbType: string, breadcrumbs: any) => {
  const newBase64 = convertToBase64(JSON.stringify(breadcrumbs))

  //   console.log('breadcrumbs', breadcrumbs)

  let url = ''
  if (props?.objectTypeId && props?.recordId) {
    url = `/${props.recordId}/${props.objectTypeId}/${props.recordId}?b=${newBase64}`
  } else {
    url = `/association/${props.objectTypeId}?b=${newBase64}`
  }
  //   console.log('url', url)
  return url
}

const convertToBase64 = (str: any = []) => {
  try {
    return btoa(unescape(encodeURIComponent(str)))
  } catch (err) {
    console.warn('Base64 encode failed:', str, err)
    return ''
  }
}

const decodeToBase64 = (base64: string) => {
  try {
    return JSON.parse(decodeURIComponent(escape(atob(base64))))
  } catch (err) {
    console.warn('Base64 decode failed:', base64, err)
    return ''
  }
}

export const useMakeLink = (props: any) => {
  const router = useRouter()
  const search: any = router.state.location.search

  if (!search.b) {
    return setParentRoute(props, search)
  } else {
    let breadcrumbItems = decodeToBase64(search.b) || []
    return setChildRoute(props, search, breadcrumbItems)
  }
}

export const getParamDetails = () => {
  const router = useRouter()
  const search: any = router.state.location.search
  let breadcrumbs = decodeToBase64(search.b) || []

  let mediatorObjectTypeId = ''
  let mediatorObjectRecordId = ''
  let parentObjectTypeId = ''
  let parentObjectRecordId = ''
  let bParams = ''
  const lastItem = breadcrumbs[breadcrumbs.length - 1]
  const lastItem2 = breadcrumbs[breadcrumbs.length - 2]

  if (breadcrumbs.length > 1) {
    mediatorObjectTypeId = breadcrumbs[1]?.o_t_id || ''
    mediatorObjectRecordId = breadcrumbs[1]?.o_r_id || ''

    if (lastItem && lastItem?.o_r_id) {
      parentObjectTypeId = lastItem2?.o_t_id || ''
      parentObjectRecordId = lastItem2?.o_r_id || ''
      bParams = lastItem?.p || ''
    }
  }

  let paramsObject: any = {}

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

  const queryString = new URLSearchParams(paramsObject as any).toString()

  //   let params = bParams ? `${bParams}&${queryString}` : `?${queryString}`
  let params = bParams ? `?${queryString}` : `?${queryString}`

  if (breadcrumbs.length < 3 && map.get('isPrimaryCompany') != 'true')
    params = ''

  return {
    breadcrumbs,
    paramsObject: { ...paramsObject, params: bParams },
    params,
  }
}

export const getBreadcrumbs = () => {
  const router = useRouter()
  const search: any = router.state.location.search
  let breadcrumbs = decodeToBase64(search.b) || []

  const updated = breadcrumbs.map((breadcrumb: any, index: any) => {
    const bc = convertToBase64(JSON.stringify(breadcrumbs.slice(0, index + 1)))

    if (index === 0) {
      return {
        name: breadcrumb.n,
        path: `/${breadcrumb.o_t_id}`,
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
  })

  if (updated.length < 1) {
    const router = useRouter()
    const { pathname } = router.state.location
    const routeMenu: any = getRouteMenu(pathname)
    return [
      {
        name: routeMenu.title,
        path: routeMenu.path,
      },
    ]
  }
  return updated
}

export const getTableTitle = (
  componentName: string,
  title: string,
  ticketTableTitle: string,
) => {
  const router = useRouter()
  const search: any = router.state.location.search
  let breadcrumbs = decodeToBase64(search.b) || []

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
  let breadcrumbs = decodeToBase64(search.b) || []

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
