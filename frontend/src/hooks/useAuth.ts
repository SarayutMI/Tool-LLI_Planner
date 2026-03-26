import { useAuthStore } from '@/store/authStore'

export function useAuth() {
  const user = useAuthStore((s) => s.user)
  const accessToken = useAuthStore((s) => s.accessToken)
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated)
  const isLoading = useAuthStore((s) => s.isLoading)
  const login = useAuthStore((s) => s.login)
  const logout = useAuthStore((s) => s.logout)
  const initialize = useAuthStore((s) => s.initialize)
  const setUser = useAuthStore((s) => s.setUser)

  return { user, accessToken, isAuthenticated, isLoading, login, logout, initialize, setUser }
}
