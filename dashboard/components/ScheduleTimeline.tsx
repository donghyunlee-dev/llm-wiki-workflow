'use client'
import { deriveTeamPhase } from '@/lib/employee-state'
import type { RoutineWithStatus } from '@/types'

interface Props {
  routines: RoutineWithStatus[]
  nowMs: number
}

function formatCountdown(ms: number): string {
  if (ms <= 0) return '곧 시작'
  const h = Math.floor(ms / 3600000)
  const m = Math.floor((ms % 3600000) / 60000)
  const s = Math.floor((ms % 60000) / 1000)
  if (h > 0) return `${h}시간 ${m}분 후`
  if (m > 0) return `${m}분 ${s}초 후`
  return `${s}초 후`
}

function fireTimeKST(nextRunAt: string): string {
  const d = new Date(nextRunAt)
  if (isNaN(d.getTime())) return '-'
  return d.toLocaleTimeString('ko-KR', { timeZone: 'Asia/Seoul', hour: '2-digit', minute: '2-digit' })
}

/** 근무 일정 — 루틴별 다음 실행까지 실시간 카운트다운 */
export default function ScheduleTimeline({ routines, nowMs }: Props) {
  const sorted = [...routines].sort((a, b) =>
    new Date(a.nextRunAt).getTime() - new Date(b.nextRunAt).getTime()
  )

  return (
    <div className="rounded-lg border border-slate-800/80 bg-slate-950/60 px-3 py-3">
      <p className="mb-2 text-[10px] font-semibold uppercase tracking-[0.2em] text-slate-500">
        근무 일정
      </p>
      <ul className="flex flex-col gap-2">
        {sorted.map(r => {
          const ms = new Date(r.nextRunAt).getTime() - nowMs
          const phase = deriveTeamPhase(r, nowMs)
          const isRunning = phase === 'running'
          return (
            <li key={r.id} className="flex items-center justify-between gap-2 text-xs">
              <div className="flex min-w-0 items-center gap-2">
                <span className={`h-1.5 w-1.5 shrink-0 rounded-full
                  ${isRunning ? 'bg-amber-400 animate-pulse' : phase === 'preparing' ? 'bg-yellow-300 animate-pulse' : 'bg-slate-700'}`} />
                <span className="truncate text-slate-300">{r.department}</span>
              </div>
              <span className={`shrink-0 font-mono text-[11px] tabular-nums ${isRunning ? 'text-amber-300' : 'text-slate-500'}`}>
                {isRunning
                  ? (r.runSource === 'remote' ? '원격 근무 중' : '근무 중')
                  : `${fireTimeKST(r.nextRunAt)} · ${formatCountdown(ms)}`}
              </span>
            </li>
          )
        })}
      </ul>
    </div>
  )
}
