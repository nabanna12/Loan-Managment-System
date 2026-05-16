export default function SuccessAlert({ message }: { message: string }) {
  if (!message) return null
  return (
    <div style={{ background:'#f0fdf4', border:'1px solid #bbf7d0', color:'#166534', padding:'0.75rem 1rem', borderRadius:'0.5rem', fontSize:'0.875rem' }}>
      {message}
    </div>
  )
}
