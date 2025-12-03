import axios from 'axios'

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api'

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
})

// Add token to requests if available
if (typeof window !== 'undefined') {
  const token = localStorage.getItem('token')
  if (token) {
    api.defaults.headers.common['Authorization'] = `Bearer ${token}`
  }
}

// Posts API
export const postsApi = {
  getAll: (params?: any) => api.get('/posts', { params }),
  getById: (id: string) => api.get(`/posts/${id}`),
  create: (data: any) => api.post('/posts', data),
  update: (id: string, data: any) => api.put(`/posts/${id}`, data),
  delete: (id: string) => api.delete(`/posts/${id}`),
}

// Comments API
export const commentsApi = {
  getByPostId: (postId: string, params?: any) => 
    api.get(`/comments/post/${postId}`, { params }),
  create: (data: any) => api.post('/comments', data),
  update: (id: string, data: any) => api.put(`/comments/${id}`, data),
  delete: (id: string) => api.delete(`/comments/${id}`),
}

// Votes API
export const votesApi = {
  vote: (data: any) => api.post('/votes', data),
  getBatch: (targets: any[]) => api.post('/votes/batch', { targets }),
}

// Reports API
export const reportsApi = {
  create: (data: any) => api.post('/reports', data),
  getMyReports: () => api.get('/reports/my-reports'),
}

// Auth API
export const authApi = {
  getAnonymousToken: () => api.post('/auth/anonymous'),
  getMe: () => api.get('/auth/me'),
}

// Stats API
export const statsApi = {
  getStats: () => api.get('/stats'),
  getTrending: (hours?: number) => api.get('/stats/trending', { params: { hours } }),
}

export default api
