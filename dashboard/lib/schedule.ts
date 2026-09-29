import { parseExpression } from 'cron-parser'
import { execSync } from 'child_process'
import path from 'path'
import fs from 'fs'
import scheduleConfig from '@/data/routine-schedule.json'

const REPO_ROOT = path.resolve(process.cwd(), '..')

interface RoutineSchedule {
  name: string
  cronExpression: string
  fireOffsetMin: number
  lastFiredAt?: string
  nextRunAt?: string
}

/**
 * routine API에 등록된 실제 스케줄.
 * agents-config의 cron은 표시용 폴백이고, 이 파일이 신뢰 소스다.
 */
export function getActualSchedule(routineId: string): RoutineSchedule | undefined {
  const map = (scheduleConfig as { routines: Record<string, RoutineSchedule> }).routines
  return map[routineId]
}

export interface FireWindow {
  prevFire: Date   // 직전 실제 발화 예상 시각 (cron tick + offset)
  nextFire: Date   // 다음 실제 발화 예상 시각
}

/** cron + 실측 발화 오프셋으로 실제 발화 윈도우 계산 */
export function getFireWindow(cronExpression: string, fireOffsetMin: number): FireWindow | null {
  try {
    const offsetMs = fireOffsetMin * 60_000
    // 오프셋만큼 시간을 되돌려 평가하면 "tick + offset" 경계가 정확해진다
    const base = new Date(Date.now() - offsetMs)
    const prevTick = parseExpression(cronExpression, { utc: true, currentDate: base }).prev().toDate()
    const nextTick = parseExpression(cronExpression, { utc: true, currentDate: base }).next().toDate()
    return {
      prevFire: new Date(prevTick.getTime() + offsetMs),
      nextFire: new Date(nextTick.getTime() + offsetMs),
    }
  } catch {
    return null
  }
}

// ── git 커밋 ground truth ────────────────────────────────────────
// 루틴(원격/수동)이 push한 런 리포트 커밋 시각 = 실제 완료 시각.
// origin/main 기준이라 로컬 checkout 시점과 무관하게 정확하다.

export interface CommitInfo {
  time: Date
  subject: string
  isManual: boolean  // 대시보드 수동 호출 커밋 — 스케줄 드리프트 판정에서 제외
}

const commitCache = new Map<string, { at: number; value: CommitInfo[] }>()
const COMMIT_CACHE_MS = 60 * 1000

/** prefix 루틴의 최근 런 리포트 커밋들 (최신순 최대 5건, 60초 캐시) */
export function getRecentReportCommits(prefix: string): CommitInfo[] {
  const cached = commitCache.get(prefix)
  if (cached && Date.now() - cached.at < COMMIT_CACHE_MS) return cached.value

  let value: CommitInfo[] = []
  try {
    const out = execSync(
      `git log origin/main -5 --format='%cI|%s' -- 'runs/*-${prefix}*.md'`,
      { cwd: REPO_ROOT, timeout: 10_000, encoding: 'utf-8' }
    ).trim()
    if (out) {
      value = out.split('\n').flatMap(line => {
        const [iso, ...rest] = line.split('|')
        const time = new Date(iso)
        if (isNaN(time.getTime())) return []
        const subject = rest.join('|')
        return [{ time, subject, isManual: subject.includes('(dashboard)') }]
      })
    }
  } catch { /* git 미사용 환경 등 — ground truth 없이 진행 */ }

  commitCache.set(prefix, { at: Date.now(), value })
  return value
}

/** 가장 최근 완료 커밋 (수동 포함 — 완료 시각 용도) */
export function getLatestReportCommit(prefix: string): CommitInfo | null {
  return getRecentReportCommits(prefix)[0] ?? null
}

/** 가장 최근 스케줄(원격) 실행 커밋 — 드리프트 판정 용도 */
export function getLatestScheduledCommit(prefix: string): CommitInfo | null {
  return getRecentReportCommits(prefix).find(c => !c.isManual) ?? null
}

/**
 * 스케줄 드리프트 감지 — 실제 완료 커밋이 예상 발화 윈도우와 동떨어져 있으면
 * routine-schedule.json이 낡았다는 신호다. (예: API에서 cron이 변경됨)
 */
export function detectScheduleDrift(
  cronExpression: string,
  fireOffsetMin: number,
  durationMin: number,
  commitTime: Date | null,
): boolean {
  if (!commitTime) return false
  // 커밋 직전의 예상 발화 시각
  try {
    const offsetMs = fireOffsetMin * 60_000
    const interval = parseExpression(cronExpression, {
      utc: true,
      currentDate: new Date(commitTime.getTime() - offsetMs),
    })
    const fireBefore = new Date(interval.prev().toDate().getTime() + offsetMs)
    const elapsed = commitTime.getTime() - fireBefore.getTime()
    // 발화 후 duration의 3배(+10분)를 넘겨 완료됐다면 스케줄 가정이 틀린 것
    return elapsed > durationMin * 3 * 60_000 + 10 * 60_000
  } catch {
    return false
  }
}

export function getScheduleSyncedAt(): string {
  return (scheduleConfig as { syncedAt: string }).syncedAt
}
