export type AgentStatus = 'idle' | 'running' | 'completed' | 'error'

export interface AgentCharacter {
  id: string
  name: string          // 직원 이름 (예: 김하루)
  rank: string          // 직급 (사원 | 대리 | 과장 | 차장 | 팀장)
  role: string          // 직무 (예: 콘텐츠 리서처)
  photo: string         // 사원 사진 경로 (/employees/*.jpg)
  employeeId: string    // 사번 (예: SF-2024-031)
  joinedAt: string      // 입사일 YYYY-MM-DD
  colorClass: string    // tailwind color key: amber | blue | purple | green | indigo | red | cyan | teal | orange | pink
  model: string
  description: string
  bio?: string          // 2-3문장 자기소개
  skills?: string[]     // 특기 태그 목록
  tasks?: string[]      // 담당 업무 목록 (상세 팝업의 메인 콘텐츠)
  pipelineStep?: number       // 파이프라인 단계 번호 (1-based)
  pipelineStepLabel?: string  // 단계 레이블 (같은 step 내 동일)
}

export interface Routine {
  id: string
  name: string
  cronExpression: string
  department: string
  runReportPrefix: string
  expectedDurationMin?: number  // 원격 실행 예상 소요 시간(분) — 스케줄 윈도우 감지용
  lastFiredAt?: string  // ISO 8601. 로컬 런 파일 없는 루틴의 마지막 실행 시각
  agents: AgentCharacter[]
}

export interface RunReport {
  date: string      // YYYY-MM-DD
  filename: string
  content: string
  routineId: string
}

export interface RoutineWithStatus extends Routine {
  status: AgentStatus
  latestRun: RunReportSummary | null
  nextRunAt: string      // ISO 8601 — 클라이언트 실시간 카운트다운용
  nextRunLabel: string   // 서버에서 포맷된 문자열: "3시간 20분 후"
  runCount: number
  hasLocalReport: boolean  // 로컬 런 파일 존재 여부 (리포트 버튼 표시용)
  currentStep?: number     // 현재 실행 중인 파이프라인 단계 (로컬: step 파일 / 원격: 경과 시간 추정)
  totalSteps: number       // 파이프라인 전체 단계 수
  runSource?: 'local' | 'remote'   // running일 때 실행 출처
  runStartedAt?: string    // running일 때 시작 시각 ISO — 경과 시간 표시용
  lastCompletedAt?: string // 마지막 완료 시각 ISO — 완료 강조의 시간 감쇠용
}

export interface RunReportSummary {
  date: string
  filename: string
  preview: string   // content 앞 300자
}

export interface ActivityItem {
  date: string       // YYYY-MM-DD
  filename: string
  department: string
  prefix: string
  title: string      // 리포트 첫 헤딩 또는 파일명
}

export interface DashboardData {
  routines: RoutineWithStatus[]
  activities: ActivityItem[]  // 최근 실행 리포트 피드 (최신순)
  scheduleDrift: boolean      // 실제 완료 커밋이 예상 윈도우와 어긋남 — 스케줄 재동기화 필요
  scheduleSyncedAt: string    // routine-schedule.json 마지막 동기화 시각
  serverNow: string           // 서버 시각 ISO — 클라이언트 시계 보정용
  lastSyncedAt: string
}
