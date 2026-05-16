export default function LoadingSpinner({ size = 'md' }: { size?: 'sm' | 'md' | 'lg' }) {
  const px = size === 'sm' ? '16px' : size === 'md' ? '32px' : '48px'
  return (
    <span style={{ display:'inline-block', width:px, height:px, border:'2px solid #e5e7eb', borderTopColor:'#0f766e', borderRadius:'50%', animation:'spin 0.7s linear infinite' }}>
      <style>{`@keyframes spin { to { transform: rotate(360deg) } }`}</style>
    </span>
  )
}
