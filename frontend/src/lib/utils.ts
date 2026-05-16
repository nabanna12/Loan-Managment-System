export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 2 }).format(amount)
}

export function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })
}

export function calculateSI(principal: number, tenure: number, rate = 12) {
  const si = (principal * rate * tenure) / (365 * 100)
  const total = principal + si
  return { si: Math.round(si * 100) / 100, total: Math.round(total * 100) / 100 }
}

export function getBadgeClass(status: string): string {
  const map: Record<string, string> = {
    APPLIED: 'badge-applied',
    SANCTIONED: 'badge-sanctioned',
    DISBURSED: 'badge-disbursed',
    CLOSED: 'badge-closed',
    REJECTED: 'badge-rejected',
  }
  return map[status] || 'badge-applied'
}
