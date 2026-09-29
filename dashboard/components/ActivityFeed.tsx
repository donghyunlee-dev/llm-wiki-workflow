'use client'
import type { ActivityItem } from '@/types'

interface Props {
  activities: ActivityItem[]
  onOpenReport: (filename: string) => void
}

/** 최근 업무 리포트 피드 — 클릭하면 리포트 전문을 연다 */
export default function ActivityFeed({ activities, onOpenReport }: Props) {
  if (activities.length === 0) return null

  return (
    <div className="rounded-lg border border-slate-800/80 bg-slate-950/60 px-3 py-3">
      <p className="mb-2 text-[10px] font-semibold uppercase tracking-[0.2em] text-slate-500">
        최근 업무 기록
      </p>
      <ul className="flex flex-col">
        {activities.map(a => (
          <li key={a.filename}>
            <button
              onClick={() => onOpenReport(a.filename)}
              className="flex w-full items-baseline gap-2 rounded px-1.5 py-1.5 text-left transition-colors hover:bg-slate-800/60"
            >
              <span className="shrink-0 font-mono text-[10px] tabular-nums text-slate-600">{a.date.slice(5)}</span>
              <span className="min-w-0 flex-1 truncate text-[11px] text-slate-400">{a.title}</span>
              <span className="shrink-0 text-[9px] text-slate-600">{a.department}</span>
            </button>
          </li>
        ))}
      </ul>
    </div>
  )
}
