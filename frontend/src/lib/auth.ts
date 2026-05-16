export type UserRole = 'admin' | 'sales' | 'sanction' | 'disbursement' | 'collection' | 'borrower'

export interface User {
  _id: string
  name: string
  email: string
  role: UserRole
}

export function saveAuth(token: string, user: User): void {
  localStorage.setItem('lms_token', token)
  localStorage.setItem('lms_user', JSON.stringify(user))
}

export function getUser(): User | null {
  if (typeof window === 'undefined') return null
  const raw = localStorage.getItem('lms_user')
  if (!raw) return null
  try { return JSON.parse(raw) as User } catch { return null }
}

export function getToken(): string | null {
  if (typeof window === 'undefined') return null
  return localStorage.getItem('lms_token')
}

export function logout(): void {
  localStorage.removeItem('lms_token')
  localStorage.removeItem('lms_user')
}

export function isLoggedIn(): boolean {
  return !!getToken()
}
