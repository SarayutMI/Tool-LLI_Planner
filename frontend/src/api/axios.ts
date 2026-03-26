import axios from 'axios'

const api = axios.create({
  baseURL: '/api',
  headers: { 'Content-Type': 'application/json' },
})

api.interceptors.request.use(async (config) => {
  const { useAuthStore } = await import('@/store/authStore')
  const token = useAuthStore.getState().accessToken
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

let isRefreshing = false
let refreshQueue: Array<(token: string) => void> = []

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config
    if (error.response?.status === 401 && !originalRequest._retry) {
      if (isRefreshing) {
        return new Promise((resolve) => {
          refreshQueue.push((token) => {
            originalRequest.headers.Authorization = `Bearer ${token}`
            resolve(api(originalRequest))
          })
        })
      }
      originalRequest._retry = true
      isRefreshing = true
      try {
        const { useAuthStore } = await import('@/store/authStore')
        await useAuthStore.getState().refreshToken()
        const newToken = useAuthStore.getState().accessToken
        if (newToken) {
          refreshQueue.forEach((cb) => cb(newToken))
          refreshQueue = []
          originalRequest.headers.Authorization = `Bearer ${newToken}`
          return api(originalRequest)
        }
      } catch {
        const { useAuthStore } = await import('@/store/authStore')
        useAuthStore.getState().logout()
        refreshQueue = []
      } finally {
        isRefreshing = false
      }
    }
    return Promise.reject(error)
  }
)

export default api
