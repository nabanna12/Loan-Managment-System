'use client'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { getUser, logout, User } from '@/lib/auth'

export default function Navbar() {
  const [user, setUser] = useState<User | null>(null)
  const router = useRouter()
  useEffect(() => { setUser(getUser()) }, [])

  return (
    <nav style={{ background:'white', borderBottom:'1px solid #f3f4f6', boxShadow:'0 1px 3px rgba(0,0,0,0.05)', position:'sticky', top:0, zIndex:50 }}>
      <div style={{ maxWidth:'1200px', margin:'0 auto', padding:'0 1rem', display:'flex', justifyContent:'space-between', alignItems:'center', height:'64px' }}>
        <div style={{ display:'flex', alignItems:'center', gap:'0.75rem' }}>
          <div style={{ width:'32px', height:'32px', background:'#0f766e', borderRadius:'8px', display:'flex', alignItems:'center', justifyContent:'center', color:'white', fontWeight:'bold' }}>L</div>
          <span style={{ fontWeight:'700', fontSize:'1.1rem', color:'#111827' }}>LMS</span>
        </div>
        {user && (
          <div style={{ display:'flex', alignItems:'center', gap:'1rem' }}>
            <div>
              <p style={{ fontSize:'0.875rem', fontWeight:'600', color:'#111827' }}>{user.name}</p>
              <p style={{ fontSize:'0.75rem', color:'#6b7280', textTransform:'capitalize' }}>{user.role}</p>
            </div>
            <button className="btn-secondary" style={{ padding:'0.375rem 1rem' }} onClick={() => { logout(); router.push('/login') }}>Logout</button>
          </div>
        )}
      </div>
    </nav>
  )
}
