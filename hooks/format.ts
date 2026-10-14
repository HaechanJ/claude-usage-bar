import type { SessionUsage } from 'claude-code'
import type { Usage } from '../types'

const LABELS: Record<string, string> = { five_hour: '5h', seven_day: '7d', spend_limit: 'spend' }

export function toUsage(u: Pick<SessionUsage, 'context' | 'rateLimits' | 'cost'>): Usage | null {
  const meters: Usage['meters'] = []
  if (u.context.percent !== undefined) meters.push({ label: 'ctx', percent: u.context.percent })
  for (const r of u.rateLimits) {
    meters.push({ label: LABELS[r.kind] ?? r.kind, percent: r.percentUsed, resetsAt: r.resetsAt })
  }
  const costUsd = u.cost && u.cost.usd > 0 ? u.cost.usd : undefined
  return meters.length || costUsd !== undefined ? { meters, costUsd } : null
}

export function bar(pct: number, width = 10): { filled: string; empty: string; color: 'success' | 'warning' | 'error' } {
  const p = Math.max(0, Math.min(100, pct))
  const n = Math.round((p / 100) * width)
  return { filled: '█'.repeat(n), empty: '░'.repeat(width - n), color: p < 50 ? 'success' : p < 80 ? 'warning' : 'error' }
}

export function resetTime(iso?: string): string {
  if (!iso) return ''
  const t = new Date(iso)
  if (isNaN(t.getTime())) return ''
  return ` (${String(t.getHours()).padStart(2, '0')}:${String(t.getMinutes()).padStart(2, '0')})`
}
