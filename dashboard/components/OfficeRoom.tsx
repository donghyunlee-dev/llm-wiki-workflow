'use client'
import { useEffect, useState } from 'react'
import EmployeeAvatar from './EmployeeAvatar'
import {
  deriveEmployeeState, deriveTeamPhase, formatElapsed,
  STATE_LABEL, STATE_DESCRIPTION, TEAM_PHASE_LABEL,
  type EmployeeState, type TeamPhase,
} from '@/lib/employee-state'
import type { AgentCharacter, RoutineWithStatus } from '@/types'

interface Props {
  routine: RoutineWithStatus
  nowMs: number
  selectedAgentId: string | null
  onSelectAgent: (id: string) => void
}

/** 상태 칩 색상 (직원 이름 아래) */
const STATE_CHIP: Record<EmployeeState, string> = {
  working: 'text-amber-300',
  standby: 'text-sky-400',
  'handed-off': 'text-emerald-400/90',
  preparing: 'text-yellow-300',
  'just-done': 'text-emerald-400',
  resting: 'text-slate-500',
  'off-duty': 'text-slate-600',
  error: 'text-red-400',
}

const PHASE_HEADER: Record<TeamPhase, string> = {
  running: 'text-amber-300',
  'just-done': 'text-emerald-300',
  resting: 'text-slate-400',
  preparing: 'text-yellow-300',
  'off-duty': 'text-slate-500',
  error: 'text-red-400',
}

function WorkstationDesk({ agent, state, slotIndex, isSelected, onClick }: {
  agent: AgentCharacter; state: EmployeeState; slotIndex: number; isSelected: boolean; onClick: () => void
}) {
  const tasks = agent.tasks ?? []
  const [taskIdx, setTaskIdx] = useState(() => slotIndex % Math.max(tasks.length, 1))
  const [bubbleVisible, setBubbleVisible] = useState(true)
  const isWorking = state === 'working'

  useEffect(() => {
    if (!isWorking || tasks.length <= 1) return
    const id = setInterval(() => {
      setBubbleVisible(false)
      setTimeout(() => { setTaskIdx(i => (i + 1) % tasks.length); setBubbleVisible(true) }, 350)
    }, 3500)
    return () => clearInterval(id)
  }, [isWorking, tasks.length])

  return (
    <div
      onClick={onClick}
      title={`${agent.name} ${agent.rank} — ${STATE_DESCRIPTION[state]}`}
      className={`relative flex w-[76px] flex-col items-center cursor-pointer select-none transition-transform duration-200
        ${isSelected ? 'scale-110' : 'hover:scale-105'}`}
    >
      {isWorking && (
        <div className="speech-bubble" style={{ opacity: bubbleVisible ? 1 : 0, transition: 'opacity 0.35s ease' }}>
          {tasks[taskIdx] ?? '업무 처리 중...'}
        </div>
      )}

      <EmployeeAvatar agent={agent} state={state} size="md" />

      {/* 책상 */}
      <div className={`mt-1 h-1.5 w-14 rounded-sm transition-colors duration-300
        ${isWorking ? 'bg-amber-500/60' : state === 'just-done' ? 'bg-emerald-600/40' : 'bg-slate-700/50'}`} />

      <span className={`mt-1 max-w-[76px] truncate text-center text-[10px] font-medium leading-tight
        ${isSelected ? 'text-white' : isWorking ? 'text-slate-100' : 'text-slate-400'}`}>
        {agent.name}
      </span>
      <span className={`max-w-[76px] truncate text-center text-[8.5px] font-medium leading-tight ${STATE_CHIP[state]}`}>
        {STATE_LABEL[state]}
      </span>
    </div>
  )
}

function groupByStep(agents: AgentCharacter[]): Map<number, AgentCharacter[]> {
  const map = new Map<number, AgentCharacter[]>()
  for (const a of agents) {
    const step = a.pipelineStep ?? 1
    if (!map.has(step)) map.set(step, [])
    map.get(step)!.push(a)
  }
  return map
}

function PipelineArrow({ active, done }: { active: boolean; done: boolean }) {
  return (
    <div className={`flex items-center self-center shrink-0 px-0.5 mt-3
      ${active ? 'text-amber-400 pipeline-arrow-active' : done ? 'text-emerald-600/70' : 'text-slate-700'}`}>
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M5 12h14M15 7l5 5-5 5" />
      </svg>
    </div>
  )
}

function completedTimeLabel(iso: string | undefined): string {
  if (!iso) return ''
  const d = new Date(iso)
  if (isNaN(d.getTime())) return ''
  return d.toLocaleTimeString('ko-KR', { timeZone: 'Asia/Seoul', hour: '2-digit', minute: '2-digit' })
}

/**
 * 팀 사무실 — 직원 전원이 자리에 앉아 있고, 근무 사이클 상태가 실시간으로 표시된다.
 * 실행 중: 헤더에 단계 진행률 + 경과 시간 라이브, 해당 단계 하이라이트.
 * 완료 직후: "HH:MM 업무 완료" / 휴식·대기: 차분한 표시.
 */
export default function OfficeRoom({ routine, nowMs, selectedAgentId, onSelectAgent }: Props) {
  const phase = deriveTeamPhase(routine, nowMs)
  const isActive = phase === 'running'

  const borderClass = isActive
    ? 'border border-amber-400/70 room-active'
    : phase === 'just-done'
      ? 'border border-emerald-500/40'
      : 'border border-slate-700/80'

  const stepsMap = groupByStep(routine.agents)
  const sortedSteps = Array.from(stepsMap.keys()).sort((a, b) => a - b)

  const elapsedMs = routine.runStartedAt ? nowMs - new Date(routine.runStartedAt).getTime() : 0

  // 헤더 우측 상태 라인
  let headerStatus: string
  if (isActive) {
    const stepLabel = routine.currentStep !== undefined
      ? `단계 ${routine.currentStep}/${routine.totalSteps}`
      : '진행 중'
    headerStatus = `${stepLabel} · ${formatElapsed(elapsedMs)}`
  } else if (phase === 'just-done') {
    headerStatus = `${completedTimeLabel(routine.lastCompletedAt)} 업무 완료`
  } else if (phase === 'preparing') {
    headerStatus = '곧 근무 시작'
  } else if (phase === 'resting') {
    headerStatus = '휴식 중'
  } else {
    headerStatus = `다음 근무 ${routine.nextRunLabel}`
  }

  return (
    <div className={`flex min-h-[210px] flex-col rounded-lg ${borderClass} office-room-bg`}>
      <div className="border-b border-white/[0.06] px-4 py-2.5">
        <div className="flex items-center justify-between gap-3">
          <div className="flex min-w-0 items-center gap-2">
            <span className="truncate text-sm font-semibold tracking-wide text-slate-200">{routine.department}</span>
            {isActive && routine.runSource && (
              <span className={`shrink-0 rounded px-1.5 py-0.5 text-[9px] font-bold uppercase tracking-wider
                ${routine.runSource === 'remote' ? 'bg-cyan-500/15 text-cyan-300' : 'bg-amber-500/15 text-amber-300'}`}>
                {routine.runSource === 'remote' ? '원격 근무' : '수동 호출'}
              </span>
            )}
          </div>
          <span className={`shrink-0 font-mono text-[10px] tabular-nums ${PHASE_HEADER[phase]}`}>
            {headerStatus}
          </span>
        </div>

        {/* 실행 중 진행률 바 */}
        {isActive && routine.currentStep !== undefined && (
          <div className="mt-2 h-1 overflow-hidden rounded-full bg-slate-800">
            <div
              className="h-full rounded-full bg-amber-400/80 transition-all duration-1000"
              style={{ width: `${Math.min(100, (routine.currentStep / routine.totalSteps) * 100)}%` }}
            />
          </div>
        )}
      </div>

      <div className="flex flex-1 items-start gap-0.5 overflow-hidden px-3 pb-4 pt-3">
        {sortedSteps.map((step, idx) => {
          const stepRoster = stepsMap.get(step) ?? []
          const isLast = idx === sortedSteps.length - 1
          const stepLabel = stepRoster[0]?.pipelineStepLabel ?? `${step}`
          const stepActive = isActive && routine.currentStep === step
          const stepDone = isActive && routine.currentStep !== undefined && step < routine.currentStep

          return (
            <div key={step} className="flex min-w-0 flex-1 items-start gap-0.5">
              <div className="flex min-w-0 flex-1 flex-col items-center gap-1.5">
                <span className={`max-w-full truncate text-[9px] font-bold uppercase tracking-widest
                  ${stepActive ? 'text-amber-300' : stepDone ? 'text-emerald-500/80' : 'text-slate-600'}`}>
                  {stepLabel}
                </span>

                <div className={`flex w-full min-w-0 flex-col items-center gap-3 rounded-md px-1 py-2.5 transition-colors duration-500
                  ${stepActive ? 'bg-amber-400/[0.07] ring-1 ring-amber-400/20' : 'bg-slate-900/45'}`}>
                  {stepRoster.map((agent, i) => (
                    <WorkstationDesk
                      key={agent.id}
                      agent={agent}
                      state={deriveEmployeeState(routine, agent, nowMs)}
                      slotIndex={i}
                      isSelected={selectedAgentId === agent.id}
                      onClick={() => onSelectAgent(agent.id)}
                    />
                  ))}
                </div>
              </div>

              {!isLast && <PipelineArrow active={stepActive} done={stepDone} />}
            </div>
          )
        })}
      </div>
    </div>
  )
}
