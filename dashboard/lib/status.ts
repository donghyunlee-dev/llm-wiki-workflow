import { parseExpression } from 'cron-parser'
import type { AgentStatus, RunReport } from '@/types'

export function deriveStatus(latestRun: RunReport | null): AgentStatus {
  if (!latestRun) return 'idle'
  const todayKST = new Date().toLocaleDateString('en-CA', { timeZone: 'Asia/Seoul' })
  return latestRun.date === todayKST ? 'completed' : 'idle'
}

export function getNextRunDate(cronExpression: string): Date | null {
  try {
    const interval = parseExpression(cronExpression, { utc: true })
    return interval.next().toDate()
  } catch {
    return null
  }
}

export function getNextRunLabel(cronExpression: string): string {
  const next = getNextRunDate(cronExpression)
  if (!next) return '-'
  const ms = next.getTime() - Date.now()
  if (ms < 0) return '곧 실행'
  const hours = Math.floor(ms / 3600000)
  const minutes = Math.floor((ms % 3600000) / 60000)
  if (hours > 0) return `${hours}시간 ${minutes}분 후`
  return `${minutes}분 후`
}

