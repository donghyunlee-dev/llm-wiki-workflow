'use client'
import AgentStatCard from './AgentStatCard'
import StatusBadge, { type BadgeTone } from './StatusBadge'
import { deriveEmployeeState, deriveTeamPhase, TEAM_PHASE_LABEL, type TeamPhase } from '@/lib/employee-state'
import type { RoutineWithStatus } from '@/types'

interface Props {
  routines: RoutineWithStatus[]
  nowMs: number
  onOpenModal: (agentId: string) => void
  onRun: (prefix: string) => void
  onOpenReport: (filename: string) => void
  runningSet: Set<string>
}

const PHASE_TONE: Record<TeamPhase, BadgeTone> = {
  running: 'amber',
  'just-done': 'emerald',
  resting: 'slate',
  preparing: 'yellow',
  'off-duty': 'slate',
  error: 'red',
}

export default function AgentSidebar({ routines, nowMs, onOpenModal, onRun, onOpenReport, runningSet }: Props) {
  return (
    <div className="flex flex-col gap-3 px-3 pb-4">
      {routines.map(routine => {
        const phase = deriveTeamPhase(routine, nowMs)
        const isRunning = runningSet.has(routine.runReportPrefix) || phase === 'running'
        return (
          <section key={routine.id} className="rounded-lg border border-slate-800/80 bg-slate-950/60">
            <div className="flex items-start justify-between gap-3 border-b border-slate-800/70 px-3 py-3">
              <div className="min-w-0">
                <span className="block truncate text-xs font-semibold uppercase tracking-wide text-slate-300">
                  {routine.department}
                </span>
                <span className="mt-1 block truncate text-[11px] text-slate-600">
                  다음 근무 {routine.nextRunLabel}
                </span>
              </div>
              <div className="flex shrink-0 flex-wrap justify-end gap-1.5">
                <StatusBadge label={TEAM_PHASE_LABEL[phase]} tone={PHASE_TONE[phase]} />
                {routine.hasLocalReport && routine.latestRun?.filename && (
                  <button
                    onClick={() => onOpenReport(routine.latestRun!.filename)}
                    className="rounded-md border border-slate-700/70 bg-slate-800/55 px-2 py-1 text-[10px] font-semibold text-slate-400 transition-all hover:bg-slate-800 hover:text-slate-100"
                    title="최근 실행 리포트 보기"
                  >
                    리포트
                  </button>
                )}
                <button
                  onClick={() => onRun(routine.runReportPrefix)}
                  disabled={isRunning}
                  className={`rounded-md px-2 py-1 text-[10px] font-semibold transition-all
                    ${isRunning
                      ? 'cursor-not-allowed bg-slate-800 text-slate-600'
                      : 'border border-amber-400/30 bg-amber-400/10 text-amber-300 hover:bg-amber-400/20'
                    }`}
                  title={isRunning ? '근무 중...' : '수동 호출 (완료 후 GitHub 자동 반영)'}
                >
                  {isRunning ? '근무중' : '호출'}
                </button>
              </div>
            </div>
            <div className="grid grid-cols-1 gap-2 p-3 2xl:grid-cols-2">
              {routine.agents.map(agent => (
                <AgentStatCard
                  key={agent.id}
                  agent={agent}
                  state={deriveEmployeeState(routine, agent, nowMs)}
                  onClick={() => onOpenModal(agent.id)}
                />
              ))}
            </div>
          </section>
        )
      })}
    </div>
  )
}
