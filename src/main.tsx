import { StrictMode } from 'react'
import ReactDOM from 'react-dom/client'
import { RouterProvider, createRouter, createHashHistory  } from '@tanstack/react-router'

import * as TanStackQueryProvider from './integrations/tanstack-query/root-provider.tsx'

// Import the generated route tree
import { routeTree } from './routeTree.gen'

// import './assets/css/main.css'
import reportWebVitals from './reportWebVitals.ts'

import { initAuthBootstrap } from '@/data/client/http-client'

import isPrefix from '../scripts/tailwind/prefix.env.js'
// ✅ wait for CSS before continuing
async function loadCss() {
  if (isPrefix(import.meta.env.MODE)) {
    return import('./assets/css/main.prod.css')
  } else {
    return import('./assets/css/main.dev.css')
  }
}

// Create a new router instance
const router = createRouter({
  routeTree,
  context: {
    ...TanStackQueryProvider.getContext(),
  },
  history: createHashHistory(),
  defaultPreload: 'intent',
  scrollRestoration: true,
  defaultStructuralSharing: true,
  defaultPreloadStaleTime: 0,
})

// Register the router instance for type safety
declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router
  }
}

const setupRefreshToken = async () => {
  try {
    await initAuthBootstrap()
  } catch {}
}

async function bootstrap() {
  await setupRefreshToken()
  await loadCss()
  await import('./assets/css/style.css')
  await import('./assets/css/override.style.css')
  
  // Render the app
  const rootElement = document.getElementById('app')
  if (rootElement && !rootElement.innerHTML) {
    const root = ReactDOM.createRoot(rootElement)
    root.render(
        <StrictMode>
          <TanStackQueryProvider.Provider>
            <RouterProvider router={router} />
          </TanStackQueryProvider.Provider>
        </StrictMode>
    )
  }

  // If you want to start measuring performance in your app, pass a function
  // to log results (for example: reportWebVitals(console.log))
  // or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
  reportWebVitals()

}

bootstrap()