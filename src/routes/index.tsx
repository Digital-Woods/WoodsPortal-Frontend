import { createFileRoute, useRouter } from '@tanstack/react-router'
import { apiRoutes } from '@/data/hubSpotData'

const App = () => {
  const router = useRouter()
  const path = apiRoutes[0]?.path
  router.navigate({ to: path });
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
