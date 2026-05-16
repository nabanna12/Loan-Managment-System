'use client'
import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { getUser, isLoggedIn } from '@/lib/auth'

export default function HomePage() {
  const router = useRouter()
  useEffect(() => {
    if (!isLoggedIn()) { router.push('/login'); return }
    const user = getUser()
    if (!user) { router.push('/login'); return }
    if (user.role === 'borrower') router.push('/borrower')
    else router.push('/dashboard')
  }, [router])
  return (
    <div style={{ minHeight:'100vh', display:'flex', alignItems:'center', justifyContent:'center', color:'#6b7280' }}>
      Loading...
    </div>
  )
}
