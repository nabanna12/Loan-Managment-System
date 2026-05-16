export default function ErrorAlert({ message, onClose }: { message: string; onClose?: () => void }) {
  if (!message) return null
  return (
    <div style={{ background:'#fef2f2', border:'1px solid #fecaca', color:'#b91c1c', padding:'0.75rem 1rem', borderRadius:'0.5rem', display:'flex', gap:'0.75rem', alignItems:'flex-start' }}>
      <p style={{ fontSize:'0.875rem', flex:1 }}>{message}</p>
      {onClose && <button onClick={onClose} style={{ color:'#ef4444', background:'none', border:'none', cursor:'pointer', marginLeft:'0.5rem' }}>✕</button>}
    </div>
  )
}
