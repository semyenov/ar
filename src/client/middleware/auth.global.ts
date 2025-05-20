import type { Role } from 'better-auth/plugins/access'

import { defu } from 'defu'

type Role = 'admin' | 'guest' | 'user'

type MiddlewareOptions = {
  // roles: Role[]
  /**
   * Only apply auth middleware to guest or user
   */
  only?: 'admin' | 'guest' | 'user'
  /**
   * Redirect authenticated user to this route
   */
  redirectUserTo?: string
  /**
   * Redirect guest to this route
   */
  redirectGuestTo?: string
  redirectAdminTo?: string
} | false

declare module '#app' {
  interface PageMeta {
    auth?: MiddlewareOptions
  }
}

declare module 'vue-router' {
  interface RouteMeta {
    auth?: MiddlewareOptions
  }
}

export default defineNuxtRouteMiddleware(async (to) => {
  // If auth is disabled, skip middleware
  if (to.meta?.auth === false) {
    return
  }
  const { fetchSession, loggedIn, options } = useAuth()

  const { only, redirectAdminTo, redirectGuestTo, redirectUserTo } = defu(to.meta?.auth, options)

  // If guest mode, redirect if authenticated
  // if (only === 'guest' && loggedIn.value) {
  //   // Avoid infinite redirect
  //   if (to.path === redirectUserTo) {
  //     return
  //   }

  //   return navigateTo(redirectUserTo)
  // }

  // If client-side, fetch session between each navigation
  if (import.meta.client) {
    if (!loggedIn.value) {
      return navigateTo('/auth/sign-in')
    }
    const session = await fetchSession()
    if (only === 'guest') {
      return navigateTo(session?.user?.role === 'admin' ? '/admin/dashboard' : '/dashboard')
    }
    if (only === 'admin' && session?.user?.role !== 'admin') {
      return navigateTo('dashboard')
    }
    if (only === 'user' && session?.user?.role !== 'user') {
      return navigateTo('/admin/dashboard')
    }
    // if (session && session.user && session.user.role && !roles.includes(session.user.role as Role)) {
    //   return navigateTo('/sign-in')
    // }
  }
},

  // // If not authenticated, redirect to home
  // if (!loggedIn.value) {
  //   // Avoid infinite redirect
  //   if (to.path === redirectGuestTo) {
  //     return
  //   }

  //   return navigateTo(redirectGuestTo)
  // }
)
