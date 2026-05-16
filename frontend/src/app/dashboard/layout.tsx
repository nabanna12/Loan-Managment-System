'use client'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import Navbar from '@/components/Navbar'
import { getUser } from '@/lib/auth'

const NAV = [
  { roles:['admin','sales'],       href:'/dashboard/sales',        label:'👥 Sales' },
  { roles:['admin','sanction'],    href:'/dashboard/sanction',     label:'✅ Sanction' },
  { roles:['admin','disbursement'],href:'/dashboard/disbursement', label:'💸 Disbursement' },
  { roles:['admin','collection'],  href:'/dashboard/collection',   label:'📋 Collection' },
]

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const user = getUser()
  const allowed = NAV.filter(n => user && n.roles.includes(user.role))

  return (
    <div style={{ minHeight:'100vh', background:'#f7f6f2' }}>
      <Navbar />
      <div style={{ maxWidth:'1200px', margin:'0 auto', padding:'1.5rem 1rem' }}>
        <div style={{ display:'flex', gap:'1.5rem' }}>
          <aside style={{ width:'200px', flexShrink:0 }}>
            <nav className="card" style={{ padding:'0.75rem', display:'flex', flexDirection:'column', gap:'0.25rem', position:'sticky', top:'80px' }}>
              <p style={{ fontSize:'0.7rem', fontWeight:'600', color:'#9ca3af', textTransform:'uppercase', letterSpacing:'0.05em', padding:'0 0.75rem', marginBottom:'0.5rem' }}>Modules</p>
              {allowed.map(item => (
                <Link key={item.href} href={item.href}
                  style={{ display:'block', padding:'0.625rem 0.75rem', borderRadius:'0.5rem', fontSize:'0.875rem', fontWeight:'500', textDecoration:'none', background: pathname === item.href ? '#0f766e' : 'transparent', color: pathname === item.href ? 'white' : '#4b5563', transition:'all 0.15s' }}>
                  {item.label}
                </Link>
              ))}
            </nav>
          </aside>
          <main style={{ flex:1, minWidth:0 }}>{children}</main>
        </div>
      </div>
    </div>
  )
}
