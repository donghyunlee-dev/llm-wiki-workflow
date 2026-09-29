'use client'
import { useEffect } from 'react'
import StatusBadge, { type BadgeTone } from './StatusBadge'
import EmployeeAvatar from './EmployeeAvatar'
import { STATE_LABEL, STATE_DESCRIPTION, type EmployeeState } from '@/lib/employee-state'
import type { AgentCharacter } from '@/types'

interface Props {
  agent: AgentCharacter | null
  state: EmployeeState
  runCount: number
  department?: string
  onClose: () => void
}

const STATE_TONE: Record<EmployeeState, BadgeTone> = {
  working: 'amber',
  standby: 'sky',
  'handed-off': 'emerald',
  preparing: 'yellow',
  'just-done': 'emerald',
  resting: 'slate',
  'off-duty': 'slate',
  error: 'red',
}

function formatModel(model: string): string {
  return model
    .replace('claude-', '')
    .replace(/-(\d+)-(\d+)$/, ' $1.$2')
    .replace(/-\d{8}$/, '')
}

function tenureLabel(joinedAt: string): string {
  const joined = new Date(joinedAt)
  if (isNaN(joined.getTime())) return '-'
  const months = Math.max(0, Math.floor((Date.now() - joined.getTime()) / (30.44 * 24 * 3600 * 1000)))
  const years = Math.floor(months / 12)
  const rest = months % 12
  if (years > 0) return rest > 0 ? `${years}년 ${rest}개월차` : `${years}년차`
  return `${Math.max(1, rest)}개월차`
}

/** 사원증 스타일 직원 프로필 모달 */
export default function AgentDetailModal({ agent, state, runCount, department, onClose }: Props) {
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose() }
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [onClose])

  if (!agent) return null

  const bioText = agent.bio ?? agent.description

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 p-4 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="flex max-h-[82vh] w-full max-w-2xl overflow-hidden rounded-2xl border border-slate-700 bg-slate-950 shadow-2xl"
        onClick={e => e.stopPropagation()}
      >
        {/* 왼쪽 — 사원증 */}
        <div className="flex w-56 shrink-0 flex-col items-center gap-3 border-r border-slate-800 bg-gradient-to-b from-slate-900 to-slate-950 p-6">
          <div className="flex w-full items-center justify-between">
            <span className="text-[10px] font-bold tracking-widest text-emerald-300/80">SFOOD AI</span>
            <span className="text-[9px] text-slate-600">EMPLOYEE</span>
          </div>

          <EmployeeAvatar agent={agent} state={state} size="xl" />

          <div className="text-center">
            <p className="text-base font-bold text-white">
              {agent.name} <span className="text-sm font-medium text-slate-400">{agent.rank}</span>
            </p>
            <p className="mt-0.5 text-xs leading-snug text-slate-400">{agent.role}</p>
            {department && <p className="mt-1 text-[10px] text-slate-600">{department}</p>}
          </div>

          <StatusBadge label={STATE_LABEL[state]} tone={STATE_TONE[state]} />
          <p className="text-center text-[10px] leading-snug text-slate-500">{STATE_DESCRIPTION[state]}</p>

          <div className="mt-auto w-full space-y-1.5 border-t border-slate-800 pt-3 text-[10px]">
            <div className="flex justify-between text-slate-500">
              <span>사번</span><span className="font-mono text-slate-300">{agent.employeeId}</span>
            </div>
            <div className="flex justify-between text-slate-500">
              <span>입사</span><span className="text-slate-300">{agent.joinedAt} ({tenureLabel(agent.joinedAt)})</span>
            </div>
            <div className="flex justify-between text-slate-500">
              <span>엔진</span><span className="font-mono text-slate-300">{formatModel(agent.model)}</span>
            </div>
            <div className="flex justify-between text-slate-500">
              <span>누적 실행</span><span className="text-slate-300">{runCount}회</span>
            </div>
          </div>
        </div>

        {/* 오른쪽 — 상세 */}
        <div className="flex flex-1 flex-col gap-5 overflow-y-auto p-6">
          <div className="flex justify-end">
            <button
              onClick={onClose}
              className="text-xl leading-none text-slate-500 transition-colors hover:text-white"
              aria-label="닫기"
            >
              ✕
            </button>
          </div>

          {agent.tasks && agent.tasks.length > 0 && (
            <div>
              <h3 className="mb-3 text-xs font-semibold uppercase tracking-widest text-slate-300">
                담당 업무
              </h3>
              <ul className="flex flex-col gap-2">
                {agent.tasks.map(task => (
                  <li key={task} className="flex items-start gap-2 text-sm text-slate-200">
                    <span className="mt-0.5 shrink-0 text-slate-500">•</span>
                    <span>{task}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          <div className="border-t border-slate-800 pt-4">
            <h3 className="mb-2 text-xs font-semibold uppercase tracking-widest text-slate-500">
              소개
            </h3>
            <p className="text-sm leading-relaxed text-slate-400">{bioText}</p>
          </div>

          {agent.skills && agent.skills.length > 0 && (
            <div className="border-t border-slate-800 pt-4">
              <h3 className="mb-2 text-xs font-semibold uppercase tracking-widest text-slate-500">
                전문 분야
              </h3>
              <div className="flex flex-wrap gap-1.5">
                {agent.skills.map(skill => (
                  <span key={skill} className="rounded-full bg-slate-800 px-2.5 py-0.5 text-xs text-slate-300">
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
