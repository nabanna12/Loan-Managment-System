'use client'
import { useEffect, useState } from 'react'
import { apiRequest } from '@/lib/api'
import { formatCurrency, formatDate } from '@/lib/utils'
import ErrorAlert from '@/components/ErrorAlert'
import SuccessAlert from '@/components/SuccessAlert'
import LoadingSpinner from '@/components/LoadingSpinner'

interface Loan {
  _id: string; amount: number; tenure: number; totalRepayment: number; totalPaid: number; closedAt?: string; createdAt: string
  userId: { name: string; email: string }
  payments: { amount: number; utr: string; paidAt: string }[]
}
interface CollectionRes {
  disbursedLoans: Loan[]
  closedLoans: Loan[]
  totalCollected: number
  totalOutstanding: number
}

export default function CollectionPage() {
  const [data, setData] = useState<CollectionRes|null>(null)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [openLoan, setOpenLoan] = useState<string|null>(null)
  const [form, setForm] = useState({ amount:'', utr:'' })
  const [loadingId, setLoadingId] = useState<string|null>(null)

  const fetchData = () => apiRequest<{ data: CollectionRes }>('/loans/collection').then(r => setData(r.data)).catch(e => setError(e.message))
  useEffect(() => { fetchData() }, [])

  const recordPayment = async (loanId: string) => {
    if (!form.amount || !form.utr) return setError('Amount and UTR required')
    setLoadingId(loanId); setError('')
    try {
      await apiRequest(`/loans/${loanId}/payment`, { method:'POST', body:{ amount:Number(form.amount), utr:form.utr } })
      setSuccess('Payment recorded! ✅'); setOpenLoan(null); setForm({ amount:'', utr:'' }); fetchData()
    } catch (e: unknown) { setError(e instanceof Error ? e.message : 'Failed') }
    finally { setLoadingId(null) }
  }

  const outstanding = (loan: Loan) => Math.max(0, loan.totalRepayment - loan.totalPaid)

  return (
    <div style={{ display:'flex', flexDirection:'column', gap:'1.5rem' }}>
      <div><h1 style={{ fontSize:'1.25rem', fontWeight:'700', color:'#111827' }}>📋 Collection</h1><p style={{ fontSize:'0.875rem', color:'#6b7280', marginTop:'0.25rem' }}>Record payments and track outstanding balances.</p></div>
      {error && <ErrorAlert message={error} onClose={() => setError('')} />}
      {success && <SuccessAlert message={success} />}
      {data && (
        <>
          <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit, minmax(160px, 1fr))', gap:'1rem' }}>
            <div className="card" style={{ borderTop:'3px solid #16a34a' }}><p style={{ fontSize:'0.75rem', color:'#9ca3af', textTransform:'uppercase', fontWeight:'600' }}>Total Collected</p><p style={{ fontSize:'1.5rem', fontWeight:'700', color:'#16a34a', marginTop:'0.25rem' }}>{formatCurrency(data.totalCollected)}</p></div>
            <div className="card" style={{ borderTop:'3px solid #dc2626' }}><p style={{ fontSize:'0.75rem', color:'#9ca3af', textTransform:'uppercase', fontWeight:'600' }}>Outstanding</p><p style={{ fontSize:'1.5rem', fontWeight:'700', color:'#dc2626', marginTop:'0.25rem' }}>{formatCurrency(data.totalOutstanding)}</p></div>
            <div className="card" style={{ borderTop:'3px solid #0f766e' }}><p style={{ fontSize:'0.75rem', color:'#9ca3af', textTransform:'uppercase', fontWeight:'600' }}>Active Loans</p><p style={{ fontSize:'1.5rem', fontWeight:'700', color:'#0f766e', marginTop:'0.25rem' }}>{data.disbursedLoans.length}</p></div>
            <div className="card" style={{ borderTop:'3px solid #6b7280' }}><p style={{ fontSize:'0.75rem', color:'#9ca3af', textTransform:'uppercase', fontWeight:'600' }}>Closed Loans</p><p style={{ fontSize:'1.5rem', fontWeight:'700', color:'#6b7280', marginTop:'0.25rem' }}>{data.closedLoans.length}</p></div>
          </div>

          {data.disbursedLoans.length > 0 && (
            <div className="card">
              <h2 style={{ fontSize:'1rem', fontWeight:'600', marginBottom:'1rem' }}>Active Loans</h2>
              <div style={{ display:'flex', flexDirection:'column', gap:'1rem' }}>
                {data.disbursedLoans.map(loan => (
                  <div key={loan._id} style={{ border:'1px solid #f3f4f6', borderRadius:'0.75rem', padding:'1rem' }}>
                    <div style={{ display:'flex', justifyContent:'space-between', marginBottom:'0.75rem' }}>
                      <div><p style={{ fontWeight:'600', color:'#111827' }}>{loan.userId?.name}</p><p style={{ fontSize:'0.75rem', color:'#6b7280' }}>{loan.userId?.email}</p></div>
                      <div style={{ textAlign:'right' }}>
                        <p style={{ fontWeight:'700', color:'#111827' }}>{formatCurrency(loan.amount)}</p>
                        <p style={{ fontSize:'0.75rem', color: outstanding(loan)===0 ? '#16a34a' : '#dc2626', fontWeight:'600' }}>Outstanding: {formatCurrency(outstanding(loan))}</p>
                      </div>
                    </div>
                    <div style={{ background:'#f9fafb', borderRadius:'0.5rem', padding:'0.5rem 0.75rem', marginBottom:'0.75rem' }}>
                      <div style={{ display:'flex', justifyContent:'space-between', fontSize:'0.75rem', color:'#6b7280', marginBottom:'0.25rem' }}><span>Repayment progress</span><span>{Math.round((loan.totalPaid/loan.totalRepayment)*100)}%</span></div>
                      <div style={{ background:'#e5e7eb', borderRadius:'9999px', height:'6px' }}>
                        <div style={{ background:'#0f766e', borderRadius:'9999px', height:'6px', width:`${Math.min(100,(loan.totalPaid/loan.totalRepayment)*100)}%`, transition:'width 0.3s' }} />
                      </div>
                    </div>
                    {loan.payments.length > 0 && (
                      <div style={{ marginBottom:'0.75rem' }}>
                        <p style={{ fontSize:'0.75rem', fontWeight:'600', color:'#6b7280', marginBottom:'0.5rem' }}>Payment History</p>
                        {loan.payments.map((p, i) => (
                          <div key={i} style={{ display:'flex', justifyContent:'space-between', fontSize:'0.75rem', color:'#6b7280', padding:'0.25rem 0', borderBottom:'1px solid #f3f4f6' }}>
                            <span>{formatDate(p.paidAt)} • UTR: {p.utr}</span><span style={{ fontWeight:'600', color:'#16a34a' }}>+{formatCurrency(p.amount)}</span>
                          </div>
                        ))}
                      </div>
                    )}
                    {openLoan === loan._id ? (
                      <div style={{ display:'flex', flexDirection:'column', gap:'0.75rem' }}>
                        <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'0.75rem' }}>
                          <div><label style={{ fontSize:'0.75rem', fontWeight:'500', display:'block', marginBottom:'0.25rem' }}>Amount (₹)</label><input className="input" type="number" placeholder="e.g. 5000" value={form.amount} onChange={e => setForm({ ...form, amount:e.target.value })} /></div>
                          <div><label style={{ fontSize:'0.75rem', fontWeight:'500', display:'block', marginBottom:'0.25rem' }}>UTR Number</label><input className="input" placeholder="UTR/Ref no." value={form.utr} onChange={e => setForm({ ...form, utr:e.target.value })} /></div>
                        </div>
                        <div style={{ display:'flex', gap:'0.75rem' }}>
                          <button className="btn-secondary" style={{ flex:1 }} onClick={() => setOpenLoan(null)}>Cancel</button>
                          <button className="btn-primary" style={{ flex:1, justifyContent:'center' }} onClick={() => recordPayment(loan._id)} disabled={loadingId===loan._id}>
                            {loadingId===loan._id ? <><LoadingSpinner size="sm" /> Saving...</> : '💰 Record Payment'}
                          </button>
                        </div>
                      </div>
                    ) : (
                      <button className="btn-primary" style={{ width:'100%', justifyContent:'center' }} onClick={() => setOpenLoan(loan._id)}>+ Record Payment</button>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
        </>
      )}
    </div>
  )
}
