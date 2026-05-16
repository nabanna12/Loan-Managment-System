'use client'
import { useEffect, useState } from 'react'
import { apiRequest } from '@/lib/api'
import { formatCurrency, formatDate } from '@/lib/utils'
import ErrorAlert from '@/components/ErrorAlert'
import SuccessAlert from '@/components/SuccessAlert'
import LoadingSpinner from '@/components/LoadingSpinner'

interface Loan {
  _id: string; amount: number; tenure: number; simpleInterest: number; totalRepayment: number; createdAt: string
  userId: { name: string; email: string }
  profile: { fullName: string; pan: string; monthlySalary: number; employmentMode: string; salarySlipUrl: string } | null
}

export default function SanctionPage() {
  const [loans, setLoans] = useState<Loan[]>([])
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [actionId, setActionId] = useState<string|null>(null)
  const [rejectId, setRejectId] = useState<string|null>(null)
  const [reason, setReason] = useState('')

  const fetchLoans = () => apiRequest<{ data: Loan[] }>('/loans/applied').then(r => setLoans(r.data)).catch(e => setError(e.message))
  useEffect(() => { fetchLoans() }, [])

  const act = async (id: string, action: 'approve'|'reject') => {
    if (action==='reject' && !reason.trim()) return setError('Rejection reason required')
    setActionId(id); setError('')
    try {
      await apiRequest(`/loans/${id}/sanction`, { method:'PATCH', body:{ action, rejectionReason:reason } })
      setSuccess(`Loan ${action}d!`); setRejectId(null); setReason(''); fetchLoans()
    } catch (e: unknown) { setError(e instanceof Error ? e.message : 'Failed') }
    finally { setActionId(null) }
  }

  return (
    <div style={{ display:'flex', flexDirection:'column', gap:'1.5rem' }}>
      <div><h1 style={{ fontSize:'1.25rem', fontWeight:'700', color:'#111827' }}>✅ Sanction — Applied Loans</h1><p style={{ fontSize:'0.875rem', color:'#6b7280', marginTop:'0.25rem' }}>Review and approve or reject applications.</p></div>
      {error && <ErrorAlert message={error} onClose={() => setError('')} />}
      {success && <SuccessAlert message={success} />}
      {loans.length === 0 ? <div className="card" style={{ textAlign:'center', padding:'4rem' }}><p style={{ fontSize:'2rem', marginBottom:'0.75rem' }}>📭</p><p style={{ color:'#6b7280' }}>No pending applications.</p></div> :
        loans.map(loan => (
          <div key={loan._id} className="card">
            <div style={{ display:'flex', justifyContent:'space-between', marginBottom:'0.75rem' }}>
              <div><p style={{ fontWeight:'700', fontSize:'1.125rem', color:'#111827' }}>{formatCurrency(loan.amount)}</p><p style={{ fontSize:'0.875rem', color:'#6b7280' }}>{loan.userId?.name} • {loan.userId?.email}</p></div>
              <span style={{ fontSize:'0.75rem', color:'#9ca3af' }}>{formatDate(loan.createdAt)}</span>
            </div>
            <div style={{ display:'grid', gridTemplateColumns:'repeat(4,1fr)', gap:'0.75rem', background:'#f9fafb', padding:'0.75rem', borderRadius:'0.5rem', fontSize:'0.875rem', marginBottom:'0.75rem' }}>
              <div><p style={{ color:'#9ca3af', fontSize:'0.75rem' }}>Tenure</p><p style={{ fontWeight:'500' }}>{loan.tenure} days</p></div>
              <div><p style={{ color:'#9ca3af', fontSize:'0.75rem' }}>Interest</p><p style={{ fontWeight:'500' }}>{formatCurrency(loan.simpleInterest)}</p></div>
              <div><p style={{ color:'#9ca3af', fontSize:'0.75rem' }}>Total</p><p style={{ fontWeight:'500' }}>{formatCurrency(loan.totalRepayment)}</p></div>
              <div><p style={{ color:'#9ca3af', fontSize:'0.75rem' }}>Rate</p><p style={{ fontWeight:'500' }}>12% p.a.</p></div>
            </div>
            {loan.profile && <div style={{ display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:'0.75rem', background:'#eff6ff', padding:'0.75rem', borderRadius:'0.5rem', fontSize:'0.875rem', marginBottom:'0.75rem' }}>
              <div><p style={{ color:'#93c5fd', fontSize:'0.75rem' }}>PAN</p><p style={{ fontWeight:'500', fontFamily:'monospace' }}>{loan.profile.pan}</p></div>
              <div><p style={{ color:'#93c5fd', fontSize:'0.75rem' }}>Employment</p><p style={{ fontWeight:'500' }}>{loan.profile.employmentMode}</p></div>
              {loan.profile.salarySlipUrl && <div><p style={{ color:'#93c5fd', fontSize:'0.75rem' }}>Salary Slip</p><a href={`http://localhost:5000${loan.profile.salarySlipUrl}`} target="_blank" rel="noopener noreferrer" style={{ color:'#0f766e', fontSize:'0.875rem', fontWeight:'500' }}>View</a></div>}
            </div>}
            {rejectId === loan._id ? (
              <div style={{ display:'flex', flexDirection:'column', gap:'0.75rem', marginTop:'0.75rem' }}>
                <textarea className="input" rows={2} placeholder="Enter rejection reason..." value={reason} onChange={e => setReason(e.target.value)} />
                <div style={{ display:'flex', gap:'0.75rem' }}>
                  <button className="btn-secondary" style={{ flex:1 }} onClick={() => { setRejectId(null); setReason('') }}>Cancel</button>
                  <button className="btn-danger" style={{ flex:1, justifyContent:'center' }} onClick={() => act(loan._id, 'reject')} disabled={actionId===loan._id}>
                    {actionId===loan._id ? <LoadingSpinner size="sm" /> : '❌ Confirm Reject'}
                  </button>
                </div>
              </div>
            ) : (
              <div style={{ display:'flex', gap:'0.75rem', marginTop:'0.75rem' }}>
                <button className="btn-danger" style={{ flex:1 }} onClick={() => setRejectId(loan._id)}>❌ Reject</button>
                <button className="btn-primary" style={{ flex:1, justifyContent:'center' }} onClick={() => act(loan._id, 'approve')} disabled={actionId===loan._id}>
                  {actionId===loan._id ? <LoadingSpinner size="sm" /> : '✅ Approve'}
                </button>
              </div>
            )}
          </div>
        ))
      }
    </div>
  )
}
