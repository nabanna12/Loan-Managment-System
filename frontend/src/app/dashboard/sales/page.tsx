'use client'
import { useEffect, useState } from 'react'
import { apiRequest } from '@/lib/api'
import { formatDate } from '@/lib/utils'
import ErrorAlert from '@/components/ErrorAlert'

interface Lead {
  user: { _id: string; name: string; email: string; createdAt: string }
  profile: { monthlySalary: number; employmentMode: string; breStatus: string } | null
}

export default function SalesPage() {
  const [leads, setLeads] = useState<Lead[]>([])
  const [error, setError] = useState('')

  useEffect(() => {
    apiRequest<{ data: Lead[] }>('/loans/leads').then(r => setLeads(r.data)).catch(e => setError(e.message))
  }, [])

  return (
    <div style={{ display:'flex', flexDirection:'column', gap:'1.5rem' }}>
      <div>
        <h1 style={{ fontSize:'1.25rem', fontWeight:'700', color:'#111827' }}>👥 Sales — Leads</h1>
        <p style={{ fontSize:'0.875rem', color:'#6b7280', marginTop:'0.25rem' }}>Borrowers who registered but haven&apos;t applied yet.</p>
      </div>
      {error && <ErrorAlert message={error} />}
      {leads.length === 0 ? (
        <div className="card" style={{ textAlign:'center', padding:'4rem 1rem' }}>
          <p style={{ fontSize:'2.5rem', marginBottom:'0.75rem' }}>🎉</p>
          <p style={{ color:'#6b7280' }}>No pending leads. All borrowers have applied!</p>
        </div>
      ) : (
        leads.map((lead, i) => (
          <div key={i} className="card">
            <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start' }}>
              <div style={{ display:'flex', gap:'0.75rem', alignItems:'center' }}>
                <div style={{ width:'40px', height:'40px', background:'#ccfbf1', borderRadius:'50%', display:'flex', alignItems:'center', justifyContent:'center', color:'#0f766e', fontWeight:'700' }}>{lead.user.name[0]}</div>
                <div>
                  <p style={{ fontWeight:'600', color:'#111827' }}>{lead.user.name}</p>
                  <p style={{ fontSize:'0.875rem', color:'#6b7280' }}>{lead.user.email}</p>
                </div>
              </div>
              <span style={{ fontSize:'0.75rem', color:'#9ca3af' }}>Joined {formatDate(lead.user.createdAt)}</span>
            </div>
            {lead.profile ? (
              <div style={{ marginTop:'1rem', background:'#f9fafb', borderRadius:'0.5rem', padding:'0.75rem', display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:'0.75rem', fontSize:'0.875rem' }}>
                <div><p style={{ color:'#9ca3af', fontSize:'0.75rem' }}>Employment</p><p style={{ fontWeight:'500' }}>{lead.profile.employmentMode}</p></div>
                <div><p style={{ color:'#9ca3af', fontSize:'0.75rem' }}>Salary</p><p style={{ fontWeight:'500' }}>₹{lead.profile.monthlySalary?.toLocaleString('en-IN')}</p></div>
                <div><p style={{ color:'#9ca3af', fontSize:'0.75rem' }}>BRE</p>
                  <span style={{ fontSize:'0.75rem', fontWeight:'600', padding:'0.2rem 0.5rem', borderRadius:'9999px', background: lead.profile.breStatus==='passed' ? '#dcfce7' : '#fee2e2', color: lead.profile.breStatus==='passed' ? '#166534' : '#b91c1c' }}>{lead.profile.breStatus}</span>
                </div>
              </div>
            ) : <p style={{ marginTop:'0.75rem', fontSize:'0.75rem', color:'#9ca3af', background:'#f9fafb', padding:'0.5rem', borderRadius:'0.5rem' }}>⚠️ Profile not submitted</p>}
          </div>
        ))
      )}
    </div>
  )
}
