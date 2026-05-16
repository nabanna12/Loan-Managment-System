'use client'
import { useEffect, useState } from 'react'
import { apiRequest } from '@/lib/api'
import { formatCurrency, formatDate } from '@/lib/utils'
import ErrorAlert from '@/components/ErrorAlert'
import SuccessAlert from '@/components/SuccessAlert'
import LoadingSpinner from '@/components/LoadingSpinner'

interface Loan {
  _id: string; amount: number; tenure: number; totalRepayment: number; createdAt: string
  userId: { name: string; email: string }
}

export default function DisbursementPage() {
  const [loans, setLoans] = useState<Loan[]>([])
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [actionId, setActionId] = useState<string|null>(null)

  const fetchLoans = () => apiRequest<{ data: Loan[] }>('/loans/sanctioned').then(r => setLoans(r.data)).catch(e => setError(e.message))
  useEffect(() => { fetchLoans() }, [])

  const disburse = async (id: string) => {
    setActionId(id); setError('')
    try {
      await apiRequest(`/loans/${id}/disburse`, { method:'PATCH' })
      setSuccess('Loan disbursed! 💸'); fetchLoans()
    } catch (e: unknown) { setError(e instanceof Error ? e.message : 'Failed') }
    finally { setActionId(null) }
  }

  return (
    <div style={{ display:'flex', flexDirection:'column', gap:'1.5rem' }}>
      <div><h1 style={{ fontSize:'1.25rem', fontWeight:'700', color:'#111827' }}>💸 Disbursement</h1><p style={{ fontSize:'0.875rem', color:'#6b7280', marginTop:'0.25rem' }}>Disburse sanctioned loans to borrowers.</p></div>
      {error && <ErrorAlert message={error} onClose={() => setError('')} />}
      {success && <SuccessAlert message={success} />}
      {loans.length === 0 ? <div className="card" style={{ textAlign:'center', padding:'4rem' }}><p style={{ fontSize:'2rem', marginBottom:'0.75rem' }}>📭</p><p style={{ color:'#6b7280' }}>No sanctioned loans pending disbursement.</p></div> :
        loans.map(loan => (
          <div key={loan._id} className="card">
            <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center' }}>
              <div>
                <p style={{ fontWeight:'700', fontSize:'1.125rem', color:'#111827' }}>{formatCurrency(loan.amount)}</p>
                <p style={{ fontSize:'0.875rem', color:'#6b7280' }}>{loan.userId?.name} • {formatDate(loan.createdAt)}</p>
                <p style={{ fontSize:'0.875rem', color:'#6b7280' }}>Total Repayment: {formatCurrency(loan.totalRepayment)} • {loan.tenure} days</p>
              </div>
              <button className="btn-primary" onClick={() => disburse(loan._id)} disabled={actionId===loan._id}>
                {actionId===loan._id ? <><LoadingSpinner size="sm" /> Processing...</> : '💸 Disburse'}
              </button>
            </div>
          </div>
        ))
      }
    </div>
  )
}
