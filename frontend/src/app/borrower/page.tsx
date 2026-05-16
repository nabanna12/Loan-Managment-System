'use client'
import { useEffect, useState } from 'react'
import Link from 'next/link'
import { apiRequest } from '@/lib/api'
import { getUser } from '@/lib/auth'
import { formatCurrency, formatDate, getBadgeClass } from '@/lib/utils'

interface Loan {
  _id: string; amount: number; tenure: number
  totalRepayment: number; totalPaid: number; status: string; createdAt: string; rejectionReason?: string
}

export default function BorrowerPage() {
  const user = getUser()
  const [loans, setLoans] = useState<Loan[]>([])

  useEffect(() => {
    apiRequest<{ data: Loan[] }>('/loans/my').then(r => setLoans(r.data)).catch(() => {})
  }, [])

  return (
    <div style={{ display:'flex', flexDirection:'column', gap:'1.5rem' }}>
      <div>
        <h1 style={{ fontSize:'1.5rem', fontWeight:'700', color:'#111827' }}>Welcome, {user?.name}! 👋</h1>
        <p style={{ color:'#6b7280', fontSize:'0.875rem', marginTop:'0.25rem' }}>Manage your loan applications from here.</p>
      </div>

      <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit, minmax(180px, 1fr))', gap:'1rem' }}>
        {[{ label:'Total', val:loans.length, col:'#0f766e' },{ label:'Active', val:loans.filter(l=>l.status==='DISBURSED').length, col:'#16a34a' },{ label:'Closed', val:loans.filter(l=>l.status==='CLOSED').length, col:'#4b5563' }].map(k => (
          <div className="card" key={k.label} style={{ textAlign:'center' }}>
            <p style={{ fontSize:'2rem', fontWeight:'700', color:k.col }}>{k.val}</p>
            <p style={{ fontSize:'0.875rem', color:'#6b7280', marginTop:'0.25rem' }}>{k.label} Applications</p>
          </div>
        ))}
      </div>

      <div className="card" style={{ borderLeft:'4px solid #0f766e' }}>
        <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center' }}>
          <div>
            <p style={{ fontSize:'0.75rem', color:'#0f766e', fontWeight:'600', textTransform:'uppercase', letterSpacing:'0.05em' }}>Quick Action</p>
            <p style={{ fontWeight:'600', color:'#111827', marginTop:'0.25rem' }}>Start or continue your loan application</p>
          </div>
          <Link href="/borrower/apply" className="btn-primary">Apply Now →</Link>
        </div>
      </div>

      {loans.length > 0 && (
        <div className="card">
          <h2 style={{ fontSize:'1.1rem', fontWeight:'600', color:'#111827', marginBottom:'1rem' }}>Your Loan Applications</h2>
          <div style={{ display:'flex', flexDirection:'column', gap:'1rem' }}>
            {loans.map(loan => (
              <div key={loan._id} style={{ border:'1px solid #f3f4f6', borderRadius:'0.75rem', padding:'1rem' }}>
                <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:'0.75rem' }}>
                  <div style={{ display:'flex', alignItems:'center', gap:'0.75rem' }}>
                    <span style={{ fontSize:'1.125rem', fontWeight:'700', color:'#111827' }}>{formatCurrency(loan.amount)}</span>
                    <span className={getBadgeClass(loan.status)}>{loan.status}</span>
                  </div>
                  <span style={{ fontSize:'0.75rem', color:'#9ca3af' }}>{formatDate(loan.createdAt)}</span>
                </div>
                <div style={{ display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:'0.75rem', fontSize:'0.875rem' }}>
                  <div><p style={{ color:'#9ca3af', fontSize:'0.75rem' }}>Tenure</p><p style={{ fontWeight:'500' }}>{loan.tenure} days</p></div>
                  <div><p style={{ color:'#9ca3af', fontSize:'0.75rem' }}>Total Repayment</p><p style={{ fontWeight:'500' }}>{formatCurrency(loan.totalRepayment)}</p></div>
                  <div><p style={{ color:'#9ca3af', fontSize:'0.75rem' }}>Paid</p><p style={{ fontWeight:'500' }}>{formatCurrency(loan.totalPaid)}</p></div>
                </div>
                {loan.rejectionReason && (
                  <div style={{ marginTop:'0.75rem', background:'#fef2f2', padding:'0.625rem', borderRadius:'0.5rem' }}>
                    <p style={{ fontSize:'0.75rem', color:'#b91c1c' }}>❌ Rejected: {loan.rejectionReason}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
