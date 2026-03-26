import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { User } from '@/types'
import * as authApi from '@/api/auth.api'

interface AuthState {
  user: User | null
  accessToken: string | null
  refreshTokenValue: string | null
  isAuthenticated: boolean
  isLoading: boolean
  login: (email: string, password: string) => Promise<void>
  logout: () => Promise<void>
  setUser: (user: User) => void
  setAccessToken: (token: string) => void
  refreshToken: () => Promise<void>
  initialize: () => Promise<void>
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      accessToken: null,
      refreshTokenValue: null,
      isAuthenticated: false,
      isLoading: false,

      login: async (email, password) => {
        set({ isLoading: true })
        try {
          const data = await authApi.login({ email, password })
          set({
            user: data.user,
            accessToken: data.accessToken,
            refreshTokenValue: data.refreshToken,
            isAuthenticated: true,
          })
        } finally {
          set({ isLoading: false })
        }
      },

      logout: async () => {
        try {
          await authApi.logout()
        } catch {
          // ignore
        }
        set({ user: null, accessToken: null, refreshTokenValue: null, isAuthenticated: false })
      },

      setUser: (user) => set({ user }),

      setAccessToken: (token) => set({ accessToken: token }),

      refreshToken: async () => {
        const { refreshTokenValue } = get()
        if (!refreshTokenValue) throw new Error('No refresh token')
        const data = await authApi.refreshToken(refreshTokenValue)
        set({ accessToken: data.accessToken })
      },

      initialize: async () => {
        const { accessToken } = get()
        if (!accessToken) return
        set({ isLoading: true })
        try {
          const user = await authApi.getMe()
          set({ user, isAuthenticated: true })
        } catch {
          set({ user: null, accessToken: null, refreshTokenValue: null, isAuthenticated: false })
        } finally {
          set({ isLoading: false })
        }
      },
    }),
    {
      name: 'auth-storage',
      partialize: (state) => ({
        accessToken: state.accessToken,
        refreshTokenValue: state.refreshTokenValue,
        user: state.user,
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
)
