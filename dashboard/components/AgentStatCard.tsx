'use client'
import EmployeeAvatar from './EmployeeAvatar'
import { STATE_LABEL, type EmployeeState } from '@/lib/employee-state'
import type { AgentCharacter } from '@/types'

interface Props {
  agent: AgentCharacter
  state: EmployeeState
  onClick: () => void
}

const STATE_TEXT: Record<EmployeeState, string> = {
  working: 'text-amber-300',
  standby: 'text-sky-400',
  'handed-off': 'text-emerald-400/90',
  preparing: 'text-yellow-300',
  'just-done': 'text-emerald-400',
  resting: 'text-slate-500',
  'off-duty': 'text-slate-600',
  error: 'text-red-400',
}

/** 직원 미니 카드 — 사진, 이름·직급, 직무, 현재 상태 */
export default function AgentStatCard({ agent, state, onClick }: Props) {
  return (
    <div
      data-testid="agent-card"
      onClick={onClick}
      className="flex w-full cursor-pointer items-center gap-2.5 rounded-lg border border-slate-800/80 bg-slate-900/70 p-2 transition-all duration-200 hover:-translate-y-0.5 hover:border-slate-700 hover:bg-slate-800/70"
    >
      <EmployeeAvatar agent={agent} state={state} size="sm" />
      <div className="min-w-0 flex-1">
        <p className="truncate text-xs font-semibold text-white">
          {agent.name} <span className="font-normal text-slate-500">{agent.rank}</span>
        </p>
        <p className="mt-0.5 truncate text-[10px] leading-snug text-slate-500">{agent.role}</p>
      </div>
      <span className={`shrink-0 text-[9px] font-semibold ${STATE_TEXT[state]}`}>
        {STATE_LABEL[state]}
      </span>
    </div>
  )
}
