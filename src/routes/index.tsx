import { createFileRoute } from '@tanstack/react-router'
import Home from '@/routes/home'

const App = () => {
  return (
    <Home />
  )
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
