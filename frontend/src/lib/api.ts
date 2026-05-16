const BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api'

function getToken(): string | null {
  if (typeof window === 'undefined') return null
  return localStorage.getItem('lms_token')
}

interface RequestOptions {
  method?: string
  body?: unknown
  headers?: Record<string, string>
}

export async function apiRequest<T = unknown>(endpoint: string, options: RequestOptions = {}): Promise<T> {
  const { method = 'GET', body, headers = {} } = options
  const token = getToken()
  const reqHeaders: Record<string, string> = { 'Content-Type': 'application/json', ...headers }
  if (token) reqHeaders['Authorization'] = `Bearer ${token}`

  const res = await fetch(`${BASE_URL}${endpoint}`, {
    method,
    headers: reqHeaders,
    body: body ? JSON.stringify(body) : undefined,
  })

  const data = await res.json()
  if (!res.ok) throw new Error(data.message || 'Something went wrong')
  return data
}

export async function uploadFile(endpoint: string, formData: FormData): Promise<unknown> {
  const token = getToken()
  const headers: Record<string, string> = {}
  if (token) headers['Authorization'] = `Bearer ${token}`
  const res = await fetch(`${BASE_URL}${endpoint}`, { method: 'POST', headers, body: formData })
  const data = await res.json()
  if (!res.ok) throw new Error(data.message || 'Upload failed')
  return data
}
