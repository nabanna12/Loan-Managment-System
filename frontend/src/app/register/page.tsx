'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { apiRequest } from '@/lib/api'
import { saveAuth, User } from '@/lib/auth'
import ErrorAlert from '@/components/ErrorAlert'
import LoadingSpinner from '@/components/LoadingSpinner'

interface RegisterRes { success: boolean; data: { token: string; user: User } }

export default function RegisterPage() {
  const router = useRouter()
  const [form, setForm] = useState({ name: '', email: '', password: '', confirmPassword: '' })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault(); setError('')
    if (form.password !== form.confirmPassword) return setError('Passwords do not match')
    setLoading(true)
    try {
      const res = await apiRequest<RegisterRes>('/auth/register', { method: 'POST', body: { name: form.name, email: form.email, password: form.password } })
      saveAuth(res.data.token, res.data.user)
      router.push('/borrower')
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Registration failed')
    } finally { setLoading(false) }
  }

  const F = (label: string, type: string, key: keyof typeof form, ph?: string) => (
    <div key={key}>
      <label style={{ display:'block', fontSize:'0.875rem', fontWeight:'500', color:'#374151', marginBottom:'0.375rem' }}>{label}</label>
      <input type={type} className="input" placeholder={ph} required
        value={form[key]} onChange={e => setForm({ ...form, [key]: e.target.value })} />
    </div>
  )

  return (
    <div style={{ minHeight:'100vh', display:'flex', alignItems:'center', justifyContent:'center', background:'#f7f6f2', padding:'1rem' }}>
      <div style={{ width:'100%', maxWidth:'420px' }}>
        <div style={{ textAlign:'center', marginBottom:'2rem' }}>
          <div style={{ width:'56px', height:'56px', background:'#0f766e', borderRadius:'16px', display:'flex', alignItems:'center', justifyContent:'center', margin:'0 auto 1rem', fontSize:'1.5rem', fontWeight:'bold', color:'white' }}>L</div>
          <h1 style={{ fontSize:'1.5rem', fontWeight:'700', color:'#111827' }}>Create account</h1>
          <p style={{ color:'#6b7280', marginTop:'0.25rem', fontSize:'0.875rem' }}>Start your loan application journey</p>
        </div>
        <div className="card">
          <form onSubmit={handleSubmit} style={{ display:'flex', flexDirection:'column', gap:'1.25rem' }}>
            {error && <ErrorAlert message={error} onClose={() => setError('')} />}
            {F('Full Name', 'text', 'name', 'Your full name')}
            {F('Email', 'email', 'email', 'you@example.com')}
            {F('Password', 'password', 'password', 'Min. 6 characters')}
            {F('Confirm Password', 'password', 'confirmPassword', '••••••••')}
            <button type="submit" className="btn-primary" style={{ width:'100%', justifyContent:'center' }} disabled={loading}>
              {loading ? <><LoadingSpinner size="sm" /> Creating...</> : 'Create account'}
            </button>
          </form>
          <div style={{ marginTop:'1.25rem', paddingTop:'1.25rem', borderTop:'1px solid #f3f4f6', textAlign:'center' }}>
            <p style={{ fontSize:'0.875rem', color:'#6b7280' }}>
              Already have an account?{' '}
              <Link href="/login" style={{ color:'#0f766e', fontWeight:'600', textDecoration:'none' }}>Sign in</Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
