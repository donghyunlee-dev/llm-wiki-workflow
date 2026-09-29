'use client'
import type { AgentCharacter } from '@/types'
import type { EmployeeState } from '@/lib/employee-state'

interface Props {
  agent: AgentCharacter
  state: EmployeeState
  size?: 'sm' | 'md' | 'lg' | 'xl'
}

const SIZE_CLASS: Record<NonNullable<Props['size']>, string> = {
  sm: 'h-9 w-9',
  md: 'h-12 w-12',
  lg: 'h-16 w-16',
  xl: 'h-28 w-28',
}

/** 상태별 사진 링 + 필터 */
const RING_CLASS: Record<EmployeeState, string> = {
  working: 'ring-2 ring-amber-400 avatar-working',
  standby: 'ring-2 ring-sky-500/60',
  'handed-off': 'ring-2 ring-emerald-500/50',
  preparing: 'ring-2 ring-yellow-400/70 avatar-preparing',
  'just-done': 'ring-2 ring-emerald-400/80',
  resting: 'ring-2 ring-slate-600/60 opacity-85',
  'off-duty': 'ring-2 ring-slate-700/50 grayscale opacity-60',
  error: 'ring-2 ring-red-500/80',
}

/** 우하단 상태 점 */
const DOT_CLASS: Record<EmployeeState, string> = {
  working: 'bg-amber-400 animate-pulse',
  standby: 'bg-sky-400',
  'handed-off': 'bg-emerald-400',
  preparing: 'bg-yellow-300 animate-pulse',
  'just-done': 'bg-emerald-400',
  resting: 'bg-slate-500',
  'off-duty': 'bg-slate-600',
  error: 'bg-red-400',
}

/** 우상단 미니 배지 (이모지) — 상태를 직관적으로 */
const BADGE: Partial<Record<EmployeeState, string>> = {
  'handed-off': '✓',
  'just-done': '✓',
  resting: '☕',
  preparing: '⏰',
}

export default function EmployeeAvatar({ agent, state, size = 'md' }: Props) {
  const badge = BADGE[state]
  return (
    <div className={`relative shrink-0 ${SIZE_CLASS[size]}`}>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={agent.photo}
        alt={`${agent.name} ${agent.rank}`}
        className={`h-full w-full rounded-full object-cover transition-all duration-500 ${RING_CLASS[state]}`}
        draggable={false}
      />
      <span
        className={`absolute bottom-0 right-0 h-[24%] w-[24%] min-h-2 min-w-2 rounded-full border-2 border-slate-950 ${DOT_CLASS[state]}`}
      />
      {badge && size !== 'sm' && (
        <span className="absolute -top-1 -right-1 flex h-[38%] w-[38%] min-h-4 min-w-4 items-center justify-center rounded-full border border-slate-700 bg-slate-900 text-[60%] leading-none">
          {badge}
        </span>
      )}
    </div>
  )
}
