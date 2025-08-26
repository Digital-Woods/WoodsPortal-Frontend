import { createFileRoute, useRouter } from '@tanstack/react-router'
import { formatPath } from '@/utils/DataMigration'
import { addHomeTabOption, hubSpotUserDetails } from '@/data/hubSpotData'

const App = () => {
  const router = useRouter()
  const path = formatPath(hubSpotUserDetails?.sideMenu[0]?.label && !addHomeTabOption ? hubSpotUserDetails?.sideMenu[0]?.label : hubSpotUserDetails?.sideMenu[0]?.tabName)
  router.navigate({ to: `/${path}` });

  return null
}

export default App

export const Route = createFileRoute('/')({
  component: App,
  beforeLoad: () => {
    return {
      layout: "MainLayout",
      requiresAuth: true,
    }
  },
})
