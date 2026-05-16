'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { apiRequest } from '@/lib/api'
import { saveAuth, User } from '@/lib/auth'
import ErrorAlert from '@/components/ErrorAlert'
import LoadingSpinner from '@/components/LoadingSpinner'

interface LoginRes { success: boolean; data: { token: string; user: User } }

export default function LoginPage() {
  const router = useRouter()
  const [form, setForm] = useState({ email: '', password: '' })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault(); setError(''); setLoading(true)
    try {
      const res = await apiRequest<LoginRes>('/auth/login', { method: 'POST', body: form })
      saveAuth(res.data.token, res.data.user)
      router.push(res.data.user.role === 'borrower' ? '/borrower' : '/dashboard')
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Login failed')
    } finally { setLoading(false) }
  }

  return (
    <div style={{ minHeight:'100vh', display:'flex', alignItems:'center', justifyContent:'center', background:'#f7f6f2', padding:'1rem' }}>
      <div style={{ width:'100%', maxWidth:'420px' }}>
        <div style={{ textAlign:'center', marginBottom:'2rem' }}>
          <div style={{ width:'56px', height:'56px', background:'#0f766e', borderRadius:'16px', display:'flex', alignItems:'center', justifyContent:'center', margin:'0 auto 1rem', fontSize:'1.5rem', fontWeight:'bold', color:'white' }}>L</div>
          <h1 style={{ fontSize:'1.5rem', fontWeight:'700', color:'#111827' }}>Welcome back</h1>
          <p style={{ color:'#6b7280', marginTop:'0.25rem', fontSize:'0.875rem' }}>Sign in to your LMS account</p>
        </div>
        <div className="card">
          <form onSubmit={handleSubmit} style={{ display:'flex', flexDirection:'column', gap:'1.25rem' }}>
            {error && <ErrorAlert message={error} onClose={() => setError('')} />}
            <div>
              <label style={{ display:'block', fontSize:'0.875rem', fontWeight:'500', color:'#374151', marginBottom:'0.375rem' }}>Email address</label>
              <input type="email" className="input" placeholder="you@example.com" required
                value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} />
            </div>
            <div>
              <label style={{ display:'block', fontSize:'0.875rem', fontWeight:'500', color:'#374151', marginBottom:'0.375rem' }}>Password</label>
              <input type="password" className="input" placeholder="••••••••" required
                value={form.password} onChange={e => setForm({ ...form, password: e.target.value })} />
            </div>
            <button type="submit" className="btn-primary" style={{ width:'100%', justifyContent:'center' }} disabled={loading}>
              {loading ? <><LoadingSpinner size="sm" /> Signing in...</> : 'Sign in'}
            </button>
          </form>
          <div style={{ marginTop:'1.25rem', paddingTop:'1.25rem', borderTop:'1px solid #f3f4f6', textAlign:'center' }}>
            <p style={{ fontSize:'0.875rem', color:'#6b7280' }}>
              New borrower?{' '}
              <Link href="/register" style={{ color:'#0f766e', fontWeight:'600', textDecoration:'none' }}>Create account</Link>
            </p>
          </div>
          <div style={{ marginTop:'1rem', background:'#f9fafb', borderRadius:'0.5rem', padding:'0.75rem' }}>
            <p style={{ fontSize:'0.75rem', color:'#6b7280', fontWeight:'600', marginBottom:'0.5rem' }}>Demo credentials:</p>
            <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'0.25rem', fontSize:'0.75rem', color:'#9ca3af' }}>
              <span>admin@lms.com</span><span>Admin@123</span>
              <span>sanction@lms.com</span><span>Sanction@123</span>
              <span>borrower@lms.com</span><span>Borrower@123</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
