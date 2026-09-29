'use client'
import { useEffect, useState, useCallback } from 'react'
import dynamic from 'next/dynamic'
import OfficeMap from '@/components/OfficeMap'

// Three.js 씬은 클라이언트 전용 — SSR 제외
const Office3D = dynamic(() => import('@/components/three/Office3D'), {
  ssr: false,
  loading: () => (
    <div className="flex h-[420px] items-center justify-center text-sm text-slate-600">
      3D 오피스 로딩 중...
    </div>
  ),
})
import AgentSidebar from '@/components/AgentSidebar'
import AgentDetailModal from '@/components/AgentDetailModal'
import MarkdownModal from '@/components/MarkdownModal'
import ScheduleTimeline from '@/components/ScheduleTimeline'
import ActivityFeed from '@/components/ActivityFeed'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import { deriveEmployeeState, deriveTeamPhase, formatElapsed, type EmployeeState } from '@/lib/employee-state'
import type { AgentCharacter, DashboardData, RoutineWithStatus } from '@/types'

const REFRESH_INTERVAL_MS = 60 * 1000          // 평시 1분 — 원격 근무 윈도우 진입을 놓치지 않도록
const RUNNING_POLL_MS = 3 * 1000               // 실행 중 3초

/** 히어로 라이브 상황 문장 */
function liveStatusSentence(routines: RoutineWithStatus[], nowMs: number): string {
  const running = routines.filter(r => deriveTeamPhase(r, nowMs) === 'running')
  if (running.length > 0) {
    const parts = running.map(r => {
      const elapsed = r.runStartedAt ? formatElapsed(nowMs - new Date(r.runStartedAt).getTime()) : ''
      const step = r.currentStep !== undefined ? `${r.currentStep}/${r.totalSteps} 단계` : '진행 중'
      return `${r.department} ${step}${elapsed ? ` · ${elapsed} 경과` : ''}`
    })
    return `지금 근무 중 — ${parts.join(' / ')}`
  }

  const preparing = routines.filter(r => deriveTeamPhase(r, nowMs) === 'preparing')
  if (preparing.length > 0) {
    return `${preparing.map(r => r.department).join(', ')} 출근 준비 중 — 곧 근무가 시작됩니다`
  }

  // 다음 근무가 가장 가까운 팀
  const next = [...routines].sort((a, b) =>
    new Date(a.nextRunAt).getTime() - new Date(b.nextRunAt).getTime()
  )[0]
  if (next) {
    const ms = new Date(next.nextRunAt).getTime() - nowMs
    const m = Math.max(1, Math.floor(ms / 60000))
    const label = m >= 60 ? `${Math.floor(m / 60)}시간 ${m % 60}분` : `${m}분`
    return `전원 휴식 또는 대기 — 다음 근무는 ${next.department}, ${label} 후 시작됩니다`
  }
  return '근무 일정이 없습니다'
}

export default function DashboardPage() {
  const [data, setData] = useState<DashboardData | null>(null)
  const [nowMs, setNowMs] = useState(() => Date.now())
  const [selectedAgentId, setSelectedAgentId] = useState<string | null>(null)
  const [modalAgentId, setModalAgentId] = useState<string | null>(null)
  const [selectedReport, setSelectedReport] = useState<string | null>(null)
  const [syncing, setSyncing] = useState(false)
  const [syncMsg, setSyncMsg] = useState<string | null>(null)
  const [fetchError, setFetchError] = useState(false)
  const [runningSet, setRunningSet] = useState<Set<string>>(new Set())
  const [runMsg, setRunMsg] = useState<string | null>(null)

  // 중앙 1초 시계 — 모든 카운트다운·경과 시간·상태 전이의 단일 기준
  useEffect(() => {
    const id = setInterval(() => setNowMs(Date.now()), 1000)
    return () => clearInterval(id)
  }, [])

  const fetchData = useCallback(() => {
    fetch('/api/dashboard')
      .then(r => r.json())
      .then((json: DashboardData) => { setData(json); setFetchError(false) })
      .catch(() => setFetchError(true))
  }, [])

  const anyRunning = runningSet.size > 0 || (data?.routines.some(r => r.status === 'running') ?? false)

  // 실행 중(로컬·원격)일 때 빠른 폴링, 평시 1분 폴링
  useEffect(() => {
    fetchData()
    const interval = anyRunning ? RUNNING_POLL_MS : REFRESH_INTERVAL_MS
    const id = setInterval(fetchData, interval)
    return () => clearInterval(id)
  }, [fetchData, anyRunning])

  // 실행 중인 루틴마다 lock 파일 폴링 (수동 호출 추적)
  useEffect(() => {
    if (runningSet.size === 0) return
    const id = setInterval(async () => {
      const completed: string[] = []
      await Promise.all(Array.from(runningSet).map(async prefix => {
        const res = await fetch(`/api/routines/run?prefix=${prefix}`).catch(() => null)
        if (!res) return
        const json = await res.json()
        if (!json.running) completed.push(prefix)
      }))
      if (completed.length > 0) {
        setRunningSet(prev => { const next = new Set(prev); completed.forEach(p => next.delete(p)); return next })
        setRunMsg('업무 완료 — 리포트가 GitHub에 반영되었습니다')
        fetchData()
        setTimeout(() => setRunMsg(null), 6000)
      }
    }, RUNNING_POLL_MS)
    return () => clearInterval(id)
  }, [runningSet, fetchData])

  async function handleRun(prefix: string) {
    if (runningSet.has(prefix)) return
    setRunningSet(prev => new Set(prev).add(prefix))
    setRunMsg(null)
    try {
      const res = await fetch('/api/routines/run', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ prefix }) })
      const json = await res.json()
      if (json.success) {
        fetchData()  // lock 파일 생성 직후 즉시 갱신
      } else {
        setRunningSet(prev => { const next = new Set(prev); next.delete(prefix); return next })
        setRunMsg(json.message)
        setTimeout(() => setRunMsg(null), 5000)
      }
    } catch {
      setRunningSet(prev => { const next = new Set(prev); next.delete(prefix); return next })
      setRunMsg('실행 요청 실패')
      setTimeout(() => setRunMsg(null), 5000)
    }
  }

  async function handleSync() {
    setSyncing(true)
    setSyncMsg(null)
    try {
      const res = await fetch('/api/sync', { method: 'POST' })
      const json = await res.json()
      setSyncMsg(json.message)
      if (json.success) fetchData()
    } finally {
      setSyncing(false)
      setTimeout(() => setSyncMsg(null), 5000)
    }
  }

  // 모달 직원 데이터 조회
  let modalAgent: AgentCharacter | null = null
  let modalState: EmployeeState = 'off-duty'
  let modalRunCount = 0
  let modalDepartment: string | undefined
  if (modalAgentId && data) {
    for (const r of data.routines) {
      const found = r.agents.find(a => a.id === modalAgentId)
      if (found) {
        modalAgent = found
        modalState = deriveEmployeeState(r, found, nowMs)
        modalRunCount = r.runCount
        modalDepartment = r.department
        break
      }
    }
  }

  const deptCount = data?.routines.length ?? 0
  const agentCount = data?.routines.reduce((s, r) => s + r.agents.length, 0) ?? 0
  const workingCount = data?.routines.reduce((sum, r) =>
    sum + r.agents.filter(a => deriveEmployeeState(r, a, nowMs) === 'working').length, 0) ?? 0

  const todayKST = new Date(nowMs).toLocaleDateString('en-CA', { timeZone: 'Asia/Seoul' })
  const todayDoneCount = data?.activities.filter(a => a.date === todayKST).length ?? 0
  const liveSentence = data ? liveStatusSentence(data.routines, nowMs) : ''

  return (
    <div className="app-shell flex min-h-screen flex-col">
      <Header
        syncing={syncing}
        syncMsg={syncMsg}
        lastSyncedAt={data?.lastSyncedAt ?? null}
        onSync={handleSync}
      />

      <main className="flex-1 px-4 py-5 sm:px-6 lg:min-h-0 lg:overflow-hidden">
        <div className="mx-auto flex h-full max-w-[1680px] flex-col gap-4">
          <section className="dashboard-hero">
            <div className="min-w-0">
              <p className="dashboard-kicker">SFOOD AI Office — Live</p>
              <h1 className="mt-1 text-xl font-semibold text-white sm:text-2xl">
                {liveSentence || 'AI 오피스 현황을 불러오는 중...'}
              </h1>
              <p className="mt-2 max-w-3xl text-sm leading-6 text-slate-400">
                AI 직원 {agentCount}명이 근무 일정에 맞춰 자동 출근합니다.
                필요하면 수동으로 호출할 수 있고, 모든 업무 리포트는 GitHub에 기록됩니다.
              </p>
            </div>
            <div className="dashboard-metrics" aria-label="대시보드 요약">
              <div>
                <span className="metric-label">근무 중</span>
                <strong className={workingCount > 0 ? 'text-amber-300' : ''}>{workingCount}명</strong>
              </div>
              <div>
                <span className="metric-label">오늘 완료 업무</span>
                <strong className={todayDoneCount > 0 ? 'text-emerald-300' : ''}>{todayDoneCount}건</strong>
              </div>
              <div>
                <span className="metric-label">누적 리포트</span>
                <strong>{data?.activities.length ?? 0}</strong>
              </div>
            </div>
          </section>

          <div className="dashboard-workspace">
            <div className="min-w-0 flex-1 overflow-y-auto rounded-lg border border-slate-800/80 bg-slate-950/35 p-3 sm:p-4">
              {!data && !fetchError && (
                <p className="text-sm text-slate-500">데이터 로딩 중...</p>
              )}
              {fetchError && (
                <p className="text-sm text-red-400">데이터를 불러오지 못했습니다. 잠시 후 다시 시도합니다.</p>
              )}
              {data && (
                <OfficeMap
                  routines={data.routines}
                  nowMs={nowMs}
                  selectedAgentId={selectedAgentId}
                  onSelectAgent={id => setSelectedAgentId(prev => prev === id ? null : id)}
                />
              )}

              {data && (
                <section className="mt-5">
                  <div className="mb-3 flex items-end justify-between gap-3">
                    <div>
                      <p className="dashboard-kicker">3D Office — Live</p>
                      <h2 className="text-lg font-semibold text-white">사무실 3D 뷰</h2>
                    </div>
                    <span className="text-[11px] text-slate-600">
                      드래그 회전 · 휠 줌 · 직원 클릭 시 사원증
                    </span>
                  </div>
                  <Office3D
                    routines={data.routines}
                    nowMs={nowMs}
                    onSelectAgent={setModalAgentId}
                  />
                </section>
              )}
            </div>

            <aside className="sidebar-panel">
              <div className="sidebar-title">
                <div>
                  <p className="dashboard-kicker">Control Deck</p>
                  <h2 className="text-sm font-semibold text-white">팀 운영 패널</h2>
                </div>
                <span className="rounded-md border border-slate-700 px-2 py-1 text-[11px] text-slate-400">
                  {agentCount}명 재직
                </span>
              </div>
              {runMsg && (
                <div className="mx-3 mb-3 rounded-md border border-amber-500/25 bg-amber-500/10 px-3 py-2 text-center text-xs text-amber-300">
                  {runMsg}
                </div>
              )}
              {data?.scheduleDrift && (
                <div className="mx-3 mb-3 rounded-md border border-red-500/25 bg-red-500/10 px-3 py-2 text-center text-[11px] text-red-300">
                  ⚠ 실제 실행 기록이 예상 스케줄과 어긋납니다 — 루틴 스케줄 재동기화가 필요합니다
                  <span className="mt-0.5 block text-[9px] text-red-400/60">
                    마지막 동기화: {new Date(data.scheduleSyncedAt).toLocaleString('ko-KR', { timeZone: 'Asia/Seoul', month: 'numeric', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>
              )}
              {data && (
                <div className="flex flex-col gap-3 px-3 pb-3">
                  <ScheduleTimeline routines={data.routines} nowMs={nowMs} />
                </div>
              )}
              {data && (
                <AgentSidebar
                  routines={data.routines}
                  nowMs={nowMs}
                  onOpenModal={setModalAgentId}
                  onRun={handleRun}
                  onOpenReport={setSelectedReport}
                  runningSet={runningSet}
                />
              )}
              {data && data.activities.length > 0 && (
                <div className="flex flex-col gap-3 px-3 pb-4">
                  <ActivityFeed
                    activities={data.activities}
                    onOpenReport={setSelectedReport}
                  />
                </div>
              )}
            </aside>
          </div>
        </div>
      </main>

      <Footer deptCount={deptCount} agentCount={agentCount} />

      <MarkdownModal
        filename={selectedReport}
        onClose={() => setSelectedReport(null)}
      />

      <AgentDetailModal
        agent={modalAgent}
        state={modalState}
        runCount={modalRunCount}
        department={modalDepartment}
        onClose={() => setModalAgentId(null)}
      />
    </div>
  )
}
