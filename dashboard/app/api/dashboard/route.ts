import { NextResponse } from 'next/server'
import { getRoutines } from '@/lib/routines'
import { getAllRunReports, getRunsByPrefix } from '@/lib/runs'
import { deriveStatus } from '@/lib/status'
import {
  getActualSchedule, getFireWindow, getLatestReportCommit, getLatestScheduledCommit,
  detectScheduleDrift, getScheduleSyncedAt,
} from '@/lib/schedule'
import type { ActivityItem, AgentStatus, DashboardData, RoutineWithStatus, RunReportSummary } from '@/types'
import { spawn } from 'child_process'
import path from 'path'
import fs from 'fs'

const REPO_ROOT = path.resolve(process.cwd(), '..')
const TMP_DIR = path.join(REPO_ROOT, 'tmp')
const SYNC_IDLE_MS = 5 * 60 * 1000      // 평시 5분
const SYNC_ACTIVE_MS = 60 * 1000        // 실행 윈도우 중 1분 — 완료 커밋을 빨리 감지

// 모듈 레벨 스로틀 — 백그라운드 git 동기화
let lastAutoSyncAt = 0

function triggerBackgroundSync(active: boolean) {
  const now = Date.now()
  const interval = active ? SYNC_ACTIVE_MS : SYNC_IDLE_MS
  if (now - lastAutoSyncAt < interval) return
  lastAutoSyncAt = now
  const child = spawn('sh', ['-c',
    'git fetch origin && git checkout origin/main -- runs/ 2>/dev/null; git checkout origin/main -- skills/confluence-guide-maintainer/wiki-targets.md 2>/dev/null; true'
  ], { cwd: REPO_ROOT, detached: true, stdio: 'ignore' })
  child.unref()
}

function isProcessAlive(pid: number): boolean {
  try { process.kill(pid, 0); return true } catch { return false }
}

/** 로컬 lock 정보 — running 여부와 시작 시각 */
function getLocalRun(prefix: string): { running: boolean; startedAt?: string } {
  const file = path.join(TMP_DIR, `running-${prefix}.lock`)
  if (!fs.existsSync(file)) return { running: false }
  try {
    const data = JSON.parse(fs.readFileSync(file, 'utf-8'))
    if (data.pid && !isProcessAlive(data.pid)) {
      fs.unlinkSync(file)
      return { running: false }
    }
    return { running: true, startedAt: data.startedAt }
  } catch {
    return { running: true }
  }
}

function getLocalCurrentStep(prefix: string): number | undefined {
  const stepFile = path.join(TMP_DIR, `step-${prefix}.json`)
  try {
    const parsed = JSON.parse(fs.readFileSync(stepFile, 'utf8'))
    return typeof parsed.step === 'number' ? parsed.step : undefined
  } catch {
    return undefined
  }
}

function extractReportTitle(content: string, filename: string): string {
  const heading = content.match(/^#\s+(.+)$/m)
  return heading?.[1]?.trim() ?? filename.replace(/\.md$/, '')
}

export async function GET() {
  const routines = getRoutines()
  const todayKST = new Date().toLocaleDateString('en-CA', { timeZone: 'Asia/Seoul' })
  const nowMs = Date.now()

  const prefixToDept = new Map(routines.map(r => [r.runReportPrefix, r.department]))

  const activities: ActivityItem[] = getAllRunReports().slice(0, 10).map(r => {
    const prefixMatch = r.filename.match(/^\d{4}-\d{2}-\d{2}-([a-z-]+?)(?:-remote)?\.md$/)
    const rawPrefix = prefixMatch?.[1] ?? ''
    const basePrefix = [...prefixToDept.keys()].find(p => rawPrefix.startsWith(p)) ?? rawPrefix
    return {
      date: r.date,
      filename: r.filename,
      department: prefixToDept.get(basePrefix) ?? basePrefix,
      prefix: basePrefix,
      title: extractReportTitle(r.content, r.filename),
    }
  })

  let anyDrift = false
  let anyActiveWindow = false

  const mapped = routines.map((routine): RoutineWithStatus => {
    const runs = getRunsByPrefix(routine.runReportPrefix)
    const localRun = runs[0] ?? null
    const hasLocalReport = localRun !== null
    const totalSteps = Math.max(1, ...routine.agents.map(a => a.pipelineStep ?? 1))
    const durationMin = routine.expectedDurationMin ?? 15

    // ── 실제 스케줄 (routine API 동기화 값) — 없으면 config cron 폴백 ──
    const actual = getActualSchedule(routine.id)
    const cron = actual?.cronExpression ?? routine.cronExpression
    const offsetMin = actual?.fireOffsetMin ?? 0
    const window = getFireWindow(cron, offsetMin)

    // ── git 커밋 ground truth: 마지막 완료 시각 (수동 호출 포함) ──
    const lastCommit = getLatestReportCommit(routine.runReportPrefix)
    const lastCompletedMs = lastCommit ? lastCommit.time.getTime() : NaN

    // 드리프트: 스케줄(원격) 실행 커밋만으로 판정 — 수동 호출은 제외
    const lastScheduled = getLatestScheduledCommit(routine.runReportPrefix)
    if (detectScheduleDrift(cron, offsetMin, durationMin, lastScheduled?.time ?? null)) {
      anyDrift = true
    }

    // ── 실행 판정 ──
    const local = getLocalRun(routine.runReportPrefix)

    // 원격: 발화 윈도우 안 + 이번 윈도우 완료 커밋이 아직 없음
    let remoteRunning = false
    let remoteProgress = 0
    if (!local.running && window) {
      const sinceFire = nowMs - window.prevFire.getTime()
      const inWindow = sinceFire >= 0 && sinceFire <= durationMin * 60_000
      const reportArrived = !isNaN(lastCompletedMs) && lastCompletedMs >= window.prevFire.getTime()
      remoteRunning = inWindow && !reportArrived
      if (remoteRunning) remoteProgress = sinceFire / (durationMin * 60_000)
      if (inWindow) anyActiveWindow = true
    }
    const running = local.running || remoteRunning
    if (local.running) anyActiveWindow = true

    let currentStep: number | undefined
    if (local.running) {
      currentStep = getLocalCurrentStep(routine.runReportPrefix)
    } else if (remoteRunning) {
      currentStep = Math.min(totalSteps, Math.floor(remoteProgress * totalSteps) + 1)
    }

    const runStartedAt = local.running
      ? local.startedAt
      : remoteRunning ? window?.prevFire.toISOString() : undefined

    let latestRun: RunReportSummary | null = null
    let status: AgentStatus = running ? 'running' : 'idle'

    if (localRun) {
      latestRun = {
        date: localRun.date,
        filename: localRun.filename,
        preview: localRun.content.slice(0, 300),
      }
      status = running ? 'running' : deriveStatus(localRun)
    } else if (routine.lastFiredAt) {
      const lastFiredDate = routine.lastFiredAt.slice(0, 10)
      latestRun = {
        date: lastFiredDate,
        filename: '',
        preview: '외부 루틴 — 로컬 리포트 없음',
      }
      if (!running) status = lastFiredDate === todayKST ? 'completed' : 'idle'
    }

    // lastCompletedAt: 커밋 시각(정확) 우선, 오늘 자 커밋만 의미 있음
    const lastCompletedAt = !isNaN(lastCompletedMs) ? lastCommit!.time.toISOString() : undefined

    const nextFire = window?.nextFire
    const nextRunLabel = nextFire
      ? (() => {
          const ms = nextFire.getTime() - nowMs
          if (ms < 0) return '곧 실행'
          const h = Math.floor(ms / 3600000)
          const m = Math.floor((ms % 3600000) / 60000)
          return h > 0 ? `${h}시간 ${m}분 후` : `${m}분 후`
        })()
      : '-'

    return {
      ...routine,
      cronExpression: cron,  // 실제 스케줄로 교체해 클라이언트에 전달
      status,
      latestRun,
      nextRunAt: nextFire?.toISOString() ?? '',
      nextRunLabel,
      runCount: runs.length,
      hasLocalReport,
      currentStep,
      totalSteps,
      runSource: running ? (local.running ? 'local' : 'remote') : undefined,
      runStartedAt,
      lastCompletedAt,
    }
  })

  // 실행 윈도우 중에는 1분, 평시 5분 주기로 git 동기화
  triggerBackgroundSync(anyActiveWindow)

  const data: DashboardData = {
    routines: mapped,
    activities,
    scheduleDrift: anyDrift,
    scheduleSyncedAt: getScheduleSyncedAt(),
    serverNow: new Date().toISOString(),
    lastSyncedAt: new Date().toISOString(),
  }

  return NextResponse.json(data)
}
