import type { AgentCharacter, RoutineWithStatus } from '@/types'

/**
 * 직원 근무 사이클 상태.
 * 시간이 지나면 자동으로 전이되도록 클라이언트에서 now 기준으로 매번 유도한다.
 *
 *  working    근무 중 — 루틴 실행 중이며 내 파이프라인 단계 차례
 *  standby    차례 대기 — 루틴 실행 중이지만 내 단계는 아직
 *  handed-off 전달 완료 — 루틴 실행 중이고 내 단계는 이미 끝남
 *  preparing  출근 준비 — 다음 근무 시작 15분 전
 *  just-done  업무 완료 — 마지막 근무 종료 후 60분 이내 (이때만 초록불)
 *  resting    휴식 중 — 오늘 근무는 마쳤고 완료 강조 시간도 지남
 *  off-duty   자리 비움 — 오늘 근무 기록 없음
 *  error      오류
 */
export type EmployeeState =
  | 'working' | 'standby' | 'handed-off'
  | 'preparing' | 'just-done' | 'resting' | 'off-duty' | 'error'

const PREPARING_WINDOW_MS = 15 * 60 * 1000
const JUST_DONE_WINDOW_MS = 60 * 60 * 1000

export const STATE_LABEL: Record<EmployeeState, string> = {
  working: '근무 중',
  standby: '차례 대기',
  'handed-off': '전달 완료',
  preparing: '출근 준비',
  'just-done': '업무 완료',
  resting: '휴식 중',
  'off-duty': '자리 비움',
  error: '오류',
}

export const STATE_DESCRIPTION: Record<EmployeeState, string> = {
  working: '지금 담당 단계를 처리하고 있습니다',
  standby: '앞 단계가 끝나면 바로 투입됩니다',
  'handed-off': '담당 단계를 마치고 다음 직원에게 넘겼습니다',
  preparing: '곧 근무가 시작됩니다',
  'just-done': '방금 업무를 마쳤습니다',
  resting: '오늘 업무를 마치고 쉬는 중입니다',
  'off-duty': '오늘은 아직 근무 기록이 없습니다',
  error: '마지막 실행에서 문제가 발생했습니다',
}

function isToday(iso: string | undefined, nowMs: number): boolean {
  if (!iso) return false
  const kstDay = (ms: number) => new Date(ms).toLocaleDateString('en-CA', { timeZone: 'Asia/Seoul' })
  return kstDay(new Date(iso).getTime()) === kstDay(nowMs)
}

/** 직원 한 명의 현재 근무 상태를 유도한다 */
export function deriveEmployeeState(
  routine: RoutineWithStatus,
  agent: AgentCharacter,
  nowMs: number,
): EmployeeState {
  if (routine.status === 'error') return 'error'

  if (routine.status === 'running') {
    const step = routine.currentStep
    const mine = agent.pipelineStep
    if (step === undefined || mine === undefined) return 'working'
    if (mine === step) return 'working'
    if (mine < step) return 'handed-off'
    return 'standby'
  }

  const nextRunMs = new Date(routine.nextRunAt).getTime()
  if (!isNaN(nextRunMs) && nextRunMs - nowMs <= PREPARING_WINDOW_MS && nextRunMs > nowMs) {
    return 'preparing'
  }

  const completedMs = routine.lastCompletedAt ? new Date(routine.lastCompletedAt).getTime() : NaN
  if (!isNaN(completedMs) && isToday(routine.lastCompletedAt, nowMs)) {
    if (nowMs - completedMs <= JUST_DONE_WINDOW_MS) return 'just-done'
    return 'resting'
  }

  return 'off-duty'
}

/** 팀(루틴) 단위 운영 단계 — 사이드바 배지·헤더 표시용 */
export type TeamPhase = 'running' | 'just-done' | 'resting' | 'preparing' | 'off-duty' | 'error'

export const TEAM_PHASE_LABEL: Record<TeamPhase, string> = {
  running: '근무 중',
  'just-done': '업무 완료',
  resting: '휴식 중',
  preparing: '출근 준비',
  'off-duty': '대기',
  error: '오류',
}

export function deriveTeamPhase(routine: RoutineWithStatus, nowMs: number): TeamPhase {
  if (routine.status === 'error') return 'error'
  if (routine.status === 'running') return 'running'

  const nextRunMs = new Date(routine.nextRunAt).getTime()
  if (!isNaN(nextRunMs) && nextRunMs - nowMs <= PREPARING_WINDOW_MS && nextRunMs > nowMs) {
    return 'preparing'
  }

  const completedMs = routine.lastCompletedAt ? new Date(routine.lastCompletedAt).getTime() : NaN
  if (!isNaN(completedMs) && isToday(routine.lastCompletedAt, nowMs)) {
    if (nowMs - completedMs <= JUST_DONE_WINDOW_MS) return 'just-done'
    return 'resting'
  }
  return 'off-duty'
}

/** 경과 시간 mm:ss / h시간 m분 포맷 */
export function formatElapsed(ms: number): string {
  if (ms < 0) return '0:00'
  const totalSec = Math.floor(ms / 1000)
  const h = Math.floor(totalSec / 3600)
  const m = Math.floor((totalSec % 3600) / 60)
  const s = totalSec % 60
  if (h > 0) return `${h}시간 ${m}분`
  return `${m}:${String(s).padStart(2, '0')}`
}
