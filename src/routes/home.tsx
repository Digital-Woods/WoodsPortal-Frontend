import { createFileRoute } from '@tanstack/react-router'
import { removeAllCookies } from '@/data/client/auth-utils'
import { useRouter } from '@tanstack/react-router'
import { Routes } from '@/config/routes';

const Home = () => {
  const router = useRouter();
  const logOut = () => {
    removeAllCookies()
    router.history.replace(Routes.login)
  }
  return (
    <>
      Welcome Home
    </>
  )
}

export default Home

export const Route = createFileRoute('/home')({
  component: Home,
  beforeLoad: () => {
    return {
      layout: "MainLayout",
      requiresAuth: true,
    }
  },
})
