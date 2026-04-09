import axios from 'axios'

const STORAGE_KEYS = {
  token: 'spms_token',
  currentUser: 'spms_current_user',
}

function normalizeUser(raw) {
  if (!raw || typeof raw !== 'object') return null
  const user = raw.user && typeof raw.user === 'object' ? raw.user : raw
  const role = user.role ? String(user.role).toUpperCase() : null
  return {
    ...user,
    role,
  }
}

function safeJsonParse(value, fallback) {
  try {
    if (!value) return fallback
    return JSON.parse(value)
  } catch {
    return fallback
  }
}

const api = axios.create({
  baseURL: 'https://spms-backend-fqlg.onrender.com/api',
})

api.interceptors.request.use((config) => {
  const token = localStorage.getItem(STORAGE_KEYS.token)
  if (token) {
    config.headers = config.headers || {}
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

export function register({ name, email, password, role }) {
  return api.post('/auth/register', { name, email, password, role })
}

export function login({ email, password }) {
  return api.post('/auth/login', { email, password }).then((res) => {
    const token = res?.data?.token || res?.data?.user?.token || null
    const user = normalizeUser(res?.data?.user || res?.data || null)

    if (token) {
      localStorage.setItem(STORAGE_KEYS.token, token)
    }
    if (user) {
      localStorage.setItem(STORAGE_KEYS.currentUser, JSON.stringify(user))
    }
    return res
  })
}

export function logout() {
  localStorage.removeItem(STORAGE_KEYS.token)
  localStorage.removeItem(STORAGE_KEYS.currentUser)
}

export function getToken() {
  return localStorage.getItem(STORAGE_KEYS.token)
}

export function getCurrentUser() {
  const raw = localStorage.getItem(STORAGE_KEYS.currentUser)
  const parsed = safeJsonParse(raw, null)
  return normalizeUser(parsed)
}

export async function getProjects() {
  const res = await api.get('/projects')
  if (Array.isArray(res?.data?.projects)) return res.data.projects
  if (Array.isArray(res?.data)) return res.data
  return []
}

export async function getProjectById(id) {
  const res = await api.get(`/projects/${id}`)
  return res?.data?.project || res?.data || null
}

export async function createProject(payload) {
  const res = await api.post('/projects', payload)
  return res?.data?.project || res?.data || null
}

export async function updateProject(id, payload) {
  const res = await api.put(`/projects/${id}`, payload)
  return res?.data?.project || res?.data || null
}

export async function deleteProject(id) {
  await api.delete(`/projects/${id}`)
}

export async function getReviews() {
  const res = await api.get('/reviews')
  if (Array.isArray(res?.data?.reviews)) return res.data.reviews
  if (Array.isArray(res?.data)) return res.data
  return []
}

export async function createReview(projectId, payload) {
  const res = await api.post(`/projects/${projectId}/reviews`, payload)
  return res?.data?.review || res?.data || null
}

