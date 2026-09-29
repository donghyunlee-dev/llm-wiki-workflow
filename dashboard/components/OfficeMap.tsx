'use client'
import OfficeRoom from './OfficeRoom'
import { deriveEmployeeState } from '@/lib/employee-state'
import type { RoutineWithStatus } from '@/types'

interface Props {
  routines: RoutineWithStatus[]
  nowMs: number
  selectedAgentId: string | null
  onSelectAgent: (id: string) => void
}

/**
 * AI 오피스 플로어 — 직원 근무 사이클(근무→완료→휴식→출근 준비)이
 * 실제 루틴 스케줄에 맞춰 실시간으로 표시된다.
 */
export default function OfficeMap({ routines, nowMs, selectedAgentId, onSelectAgent }: Props) {
  let working = 0, resting = 0, offDuty = 0
  for (const r of routines) {
    for (const a of r.agents) {
      const s = deriveEmployeeState(r, a, nowMs)
      if (s === 'working') working++
      else if (s === 'resting' || s === 'just-done') resting++
      else if (s === 'off-duty') offDuty++
    }
  }

  return (
    <div className="office-map">
      <div className="mb-4 flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
        <div>
          <p className="dashboard-kicker">Office Floor</p>
          <h2 className="text-lg font-semibold text-white">AI 운영 플로어</h2>
        </div>
        <div className="flex flex-wrap gap-2 text-[11px] text-slate-400">
          <span className={`rounded-md border px-2.5 py-1.5 ${working > 0
            ? 'border-amber-400/30 bg-amber-400/10 text-amber-300'
            : 'border-slate-800 bg-slate-950/70'}`}>
            근무 중 {working}
          </span>
          <span className="rounded-md border border-slate-800 bg-slate-950/70 px-2.5 py-1.5">
            휴식 {resting}
          </span>
          <span className="rounded-md border border-slate-800 bg-slate-950/70 px-2.5 py-1.5">
            자리 비움 {offDuty}
          </span>
        </div>
      </div>

      <div className="grid gap-3 xl:grid-cols-2 2xl:grid-cols-3">
        {routines.map(r => (
          <OfficeRoom
            key={r.id}
            routine={r}
            nowMs={nowMs}
            selectedAgentId={selectedAgentId}
            onSelectAgent={onSelectAgent}
          />
        ))}
      </div>
    </div>
  )
}
