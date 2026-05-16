'use client'
import Navbar from '@/components/Navbar'

export default function BorrowerLayout({ children }: { children: React.ReactNode }) {
  return (
    <div style={{ minHeight:'100vh', background:'#f7f6f2' }}>
      <Navbar />
      <main style={{ maxWidth:'896px', margin:'0 auto', padding:'2rem 1rem' }}>{children}</main>
    </div>
  )
}
