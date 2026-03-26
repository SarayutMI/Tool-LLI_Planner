import api from './axios'
import type { AuthResponse, User } from '@/types'

export const register = (data: { name: string; email: string; password: string }) =>
  api.post<AuthResponse>('/auth/register', data).then((r) => r.data)

export const login = (data: { email: string; password: string }) =>
  api.post<AuthResponse>('/auth/login', data).then((r) => r.data)

export const logout = () => api.post('/auth/logout').then((r) => r.data)

export const refreshToken = (token: string) =>
  api.post<{ accessToken: string }>('/auth/refresh', { refreshToken: token }).then((r) => r.data)

export const getMe = () => api.get<User>('/auth/me').then((r) => r.data)
