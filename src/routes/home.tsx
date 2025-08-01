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
      <div className="text-center">
        Main Layout
      </div>
      <div className="text-center">
        <button onClick={() => logOut()}>Logout</button>
      </div>
    </>
  )
}

export default Home

export const Route = createFileRoute('/home')({
  component: Home,
  beforeLoad: () => {
    return {
      layout: "AuthLayout",
      requiresAuth: true,
    }
  },
})
