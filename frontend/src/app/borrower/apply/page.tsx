'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { apiRequest, uploadFile } from '@/lib/api'
import { calculateSI, formatCurrency } from '@/lib/utils'
import ErrorAlert from '@/components/ErrorAlert'
import SuccessAlert from '@/components/SuccessAlert'
import LoadingSpinner from '@/components/LoadingSpinner'

export default function ApplyPage() {
  const router = useRouter()
  const [step, setStep] = useState(0)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [loading, setLoading] = useState(false)
  const [personal, setPersonal] = useState({ fullName:'', pan:'', dateOfBirth:'', monthlySalary:'', employmentMode:'Salaried' })
  const [file, setFile] = useState<File|null>(null)
  const [amount, setAmount] = useState(100000)
  const [tenure, setTenure] = useState(180)
  const { si, total } = calculateSI(amount, tenure)

  const submitPersonal = async (e: React.FormEvent) => {
    e.preventDefault(); setLoading(true); setError(''); setSuccess('')
    try {
      const res = await apiRequest<{ data: { breStatus: string; failReasons?: string[] } }>('/profile/submit', {
        method:'POST', body:{ ...personal, monthlySalary:Number(personal.monthlySalary) }
      })
      if (res.data.breStatus === 'passed') { setSuccess('Eligibility check passed! ✅'); setStep(1) }
      else setError((res.data.failReasons || []).join(' | ') || 'Eligibility check failed')
    } catch (err: unknown) { setError(err instanceof Error ? err.message : 'Failed') }
    finally { setLoading(false) }
  }

  const submitUpload = async () => {
    if (!file) return setError('Please select a file')
    setLoading(true); setError(''); setSuccess('')
    try {
      const fd = new FormData(); fd.append('salarySlip', file)
      await uploadFile('/profile/upload-salary-slip', fd)
      setSuccess('Salary slip uploaded! ✅'); setStep(2)
    } catch (err: unknown) { setError(err instanceof Error ? err.message : 'Upload failed') }
    finally { setLoading(false) }
  }

  const submitLoan = async () => {
    setLoading(true); setError(''); setSuccess('')
    try {
      await apiRequest('/loans/apply', { method:'POST', body:{ amount, tenure } })
      setSuccess('Loan applied successfully! 🎉')
      setTimeout(() => router.push('/borrower'), 1800)
    } catch (err: unknown) { setError(err instanceof Error ? err.message : 'Application failed') }
    finally { setLoading(false) }
  }

  const steps = ['Personal Details', 'Salary Slip', 'Loan Config']

  return (
    <div style={{ maxWidth:'640px', margin:'0 auto', display:'flex', flexDirection:'column', gap:'1.5rem' }}>
      <div>
        <h1 style={{ fontSize:'1.5rem', fontWeight:'700', color:'#111827' }}>Loan Application</h1>
        <p style={{ color:'#6b7280', fontSize:'0.875rem', marginTop:'0.25rem' }}>Complete all steps to apply for a loan.</p>
      </div>

      {/* Progress bar */}
      <div className="card" style={{ display:'flex', alignItems:'center', justifyContent:'space-between' }}>
        {steps.map((label, i) => (
          <div key={i} style={{ display:'flex', alignItems:'center', flex: i < steps.length-1 ? 1 : 0 }}>
            <div style={{ display:'flex', flexDirection:'column', alignItems:'center' }}>
              <div style={{ width:'32px', height:'32px', borderRadius:'50%', display:'flex', alignItems:'center', justifyContent:'center', fontSize:'0.875rem', fontWeight:'600', background: i < step ? '#0f766e' : i === step ? '#0f766e' : '#f3f4f6', color: i <= step ? 'white' : '#9ca3af', boxShadow: i === step ? '0 0 0 4px #ccfbf1' : 'none' }}>
                {i < step ? '✓' : i + 1}
              </div>
              <span style={{ fontSize:'0.7rem', marginTop:'0.375rem', fontWeight:'500', color: i === step ? '#0f766e' : '#9ca3af', whiteSpace:'nowrap' }}>{label}</span>
            </div>
            {i < steps.length - 1 && <div style={{ flex:1, height:'2px', background: i < step ? '#0f766e' : '#e5e7eb', margin:'0 0.5rem', marginBottom:'1.2rem' }} />}
          </div>
        ))}
      </div>

      {error && <ErrorAlert message={error} onClose={() => setError('')} />}
      {success && <SuccessAlert message={success} />}

      {step === 0 && (
        <div className="card">
          <h2 style={{ fontSize:'1.1rem', fontWeight:'600', marginBottom:'1.25rem' }}>Step 1: Personal Details</h2>
          <form onSubmit={submitPersonal} style={{ display:'flex', flexDirection:'column', gap:'1rem' }}>
            <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'1rem' }}>
              <div><label style={{ display:'block', fontSize:'0.875rem', fontWeight:'500', marginBottom:'0.375rem' }}>Full Name</label><input className="input" required placeholder="As per PAN" value={personal.fullName} onChange={e => setPersonal({ ...personal, fullName: e.target.value })} /></div>
              <div><label style={{ display:'block', fontSize:'0.875rem', fontWeight:'500', marginBottom:'0.375rem' }}>PAN Number</label><input className="input" required placeholder="ABCDE1234F" value={personal.pan} onChange={e => setPersonal({ ...personal, pan: e.target.value.toUpperCase() })} /></div>
              <div><label style={{ display:'block', fontSize:'0.875rem', fontWeight:'500', marginBottom:'0.375rem' }}>Date of Birth</label><input type="date" className="input" required value={personal.dateOfBirth} onChange={e => setPersonal({ ...personal, dateOfBirth: e.target.value })} /><p style={{ fontSize:'0.75rem', color:'#9ca3af', marginTop:'0.25rem' }}>Age 23–50 required</p></div>
              <div><label style={{ display:'block', fontSize:'0.875rem', fontWeight:'500', marginBottom:'0.375rem' }}>Monthly Salary (₹)</label><input type="number" className="input" required placeholder="e.g. 50000" value={personal.monthlySalary} onChange={e => setPersonal({ ...personal, monthlySalary: e.target.value })} /><p style={{ fontSize:'0.75rem', color:'#9ca3af', marginTop:'0.25rem' }}>Min ₹25,000</p></div>
            </div>
            <div><label style={{ display:'block', fontSize:'0.875rem', fontWeight:'500', marginBottom:'0.375rem' }}>Employment Mode</label>
              <select className="input" value={personal.employmentMode} onChange={e => setPersonal({ ...personal, employmentMode: e.target.value })}>
                <option>Salaried</option><option>Self-Employed</option><option>Unemployed</option>
              </select>
            </div>
            <button type="submit" className="btn-primary" style={{ width:'100%', justifyContent:'center' }} disabled={loading}>
              {loading ? <><LoadingSpinner size="sm" /> Checking eligibility...</> : 'Check Eligibility & Continue →'}
            </button>
          </form>
        </div>
      )}

      {step === 1 && (
        <div className="card">
          <h2 style={{ fontSize:'1.1rem', fontWeight:'600', marginBottom:'0.5rem' }}>Step 2: Upload Salary Slip</h2>
          <p style={{ fontSize:'0.875rem', color:'#6b7280', marginBottom:'1.25rem' }}>Accepted: PDF, JPG, PNG (max 5 MB)</p>
          <label style={{ display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', width:'100%', height:'160px', border:'2px dashed #d1d5db', borderRadius:'0.75rem', cursor:'pointer', transition:'border-color 0.2s' }}>
            <span style={{ fontSize:'2rem', marginBottom:'0.5rem' }}>📁</span>
            <span style={{ fontSize:'0.875rem', color: file ? '#0f766e' : '#6b7280', fontWeight: file ? '600' : '400' }}>{file ? file.name : 'Click to upload salary slip'}</span>
            <input type="file" style={{ display:'none' }} accept=".pdf,.jpg,.jpeg,.png" onChange={e => { if(e.target.files?.[0]) setFile(e.target.files[0]) }} />
          </label>
          <div style={{ display:'flex', gap:'0.75rem', marginTop:'1rem' }}>
            <button className="btn-secondary" style={{ flex:1 }} onClick={() => setStep(0)}>← Back</button>
            <button className="btn-primary" style={{ flex:1, justifyContent:'center' }} onClick={submitUpload} disabled={!file||loading}>
              {loading ? <><LoadingSpinner size="sm" /> Uploading...</> : 'Upload & Continue →'}
            </button>
          </div>
        </div>
      )}

      {step === 2 && (
        <div className="card">
          <h2 style={{ fontSize:'1.1rem', fontWeight:'600', marginBottom:'1.25rem' }}>Step 3: Configure Loan</h2>
          <div style={{ display:'flex', flexDirection:'column', gap:'1.5rem' }}>
            <div>
              <div style={{ display:'flex', justifyContent:'space-between', marginBottom:'0.5rem' }}>
                <label style={{ fontSize:'0.875rem', fontWeight:'500' }}>Loan Amount</label>
                <span style={{ color:'#0f766e', fontWeight:'700', fontSize:'1.1rem' }}>{formatCurrency(amount)}</span>
              </div>
              <input type="range" min="50000" max="500000" step="10000" value={amount}
                onChange={e => setAmount(Number(e.target.value))}
                style={{ width:'100%', accentColor:'#0f766e' }} />
              <div style={{ display:'flex', justifyContent:'space-between', fontSize:'0.75rem', color:'#9ca3af', marginTop:'0.25rem' }}><span>₹50,000</span><span>₹5,00,000</span></div>
            </div>
            <div>
              <div style={{ display:'flex', justifyContent:'space-between', marginBottom:'0.5rem' }}>
                <label style={{ fontSize:'0.875rem', fontWeight:'500' }}>Tenure</label>
                <span style={{ color:'#0f766e', fontWeight:'700', fontSize:'1.1rem' }}>{tenure} days</span>
              </div>
              <input type="range" min="30" max="365" step="5" value={tenure}
                onChange={e => setTenure(Number(e.target.value))}
                style={{ width:'100%', accentColor:'#0f766e' }} />
              <div style={{ display:'flex', justifyContent:'space-between', fontSize:'0.75rem', color:'#9ca3af', marginTop:'0.25rem' }}><span>30 days</span><span>365 days</span></div>
            </div>
            <div style={{ background:'#0f766e', color:'white', borderRadius:'0.75rem', padding:'1.25rem' }}>
              <p style={{ fontSize:'0.875rem', marginBottom:'0.75rem', opacity:0.8 }}>📊 Live Loan Summary (12% p.a.)</p>
              <div style={{ display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:'1rem' }}>
                <div><p style={{ fontSize:'0.75rem', opacity:0.7 }}>Principal</p><p style={{ fontWeight:'700', fontSize:'1rem' }}>{formatCurrency(amount)}</p></div>
                <div><p style={{ fontSize:'0.75rem', opacity:0.7 }}>Interest (SI)</p><p style={{ fontWeight:'700', fontSize:'1rem' }}>{formatCurrency(si)}</p></div>
                <div><p style={{ fontSize:'0.75rem', opacity:0.7 }}>Total Repayment</p><p style={{ fontWeight:'700', fontSize:'1rem' }}>{formatCurrency(total)}</p></div>
              </div>
              <p style={{ fontSize:'0.7rem', opacity:0.6, marginTop:'0.75rem' }}>SI = P × R × T ÷ (365 × 100)</p>
            </div>
            <div style={{ display:'flex', gap:'0.75rem' }}>
              <button className="btn-secondary" style={{ flex:1 }} onClick={() => setStep(1)}>← Back</button>
              <button className="btn-primary" style={{ flex:1, justifyContent:'center' }} onClick={submitLoan} disabled={loading}>
                {loading ? <><LoadingSpinner size="sm" /> Submitting...</> : '🚀 Submit Application'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
