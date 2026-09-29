# Agent Detail Modal Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 에이전트 카드 클릭 시 담당 업무·자기소개·특기를 보여주는 2단 패널 모달을 추가한다.

**Architecture:** `AgentCharacter` 타입에 `bio?/skills?/tasks?` 필드 추가 → `agents-config.json`에 콘텐츠 입력 → `AgentDetailModal` 신규 컴포넌트 생성 → `AgentStatCard`에 `onClick` 추가 → `DepartmentFloor`에서 선택 상태 관리 후 모달 렌더링.

**Tech Stack:** Next.js 15, TypeScript 5, Tailwind CSS 3 (기존 스택 그대로)

**Working directory:** `/home/donghyunlee/projects/SFOOD-LLM-WIKI-WORKFLOW/dashboard`

---

## File Map

| File | Action | 변경 내용 |
|---|---|---|
| `types/index.ts` | MODIFY | `AgentCharacter`에 `bio?`, `skills?`, `tasks?` 추가 |
| `data/agents-config.json` | MODIFY | 10개 에이전트 전체에 bio/skills/tasks 콘텐츠 추가 |
| `components/AgentDetailModal.tsx` | CREATE | 2단 패널 모달 컴포넌트 |
| `components/AgentStatCard.tsx` | MODIFY | `onClick: () => void` prop 추가 + `cursor-pointer` |
| `components/DepartmentFloor.tsx` | MODIFY | `selectedAgent` state + `AgentDetailModal` 렌더링 |

---

### Task 1: Update AgentCharacter Type

**Files:**
- Modify: `dashboard/types/index.ts`

- [ ] **Step 1: types/index.ts 수정**

`AgentCharacter` 인터페이스에 3개 선택 필드를 추가한다. 기존 `description` 필드는 유지.

`dashboard/types/index.ts`의 `AgentCharacter` 인터페이스를 아래로 교체한다:

```typescript
export interface AgentCharacter {
  id: string
  name: string
  role: string
  emoji: string
  colorClass: string  // tailwind color key: amber | blue | purple | green | indigo | red | cyan | teal | orange | pink
  model: string
  description: string
  bio?: string        // 2-3문장 자기소개
  skills?: string[]   // 특기 태그 목록
  tasks?: string[]    // 담당 업무 목록 (상세 팝업의 메인 콘텐츠)
}
```

나머지 인터페이스(`Routine`, `RunReport`, `RoutineWithStatus`, `RunReportSummary`, `DashboardData`)는 변경하지 않는다.

- [ ] **Step 2: TypeScript 확인**

```bash
cd /home/donghyunlee/projects/SFOOD-LLM-WIKI-WORKFLOW/dashboard && npx tsc --noEmit 2>&1
```

Expected: 출력 없음 (오류 0개)

- [ ] **Step 3: 커밋**

```bash
git add dashboard/types/index.ts
git commit -m "feat: add bio/skills/tasks optional fields to AgentCharacter"
```

---

### Task 2: Update agents-config.json — Add Agent Content

**Files:**
- Modify: `dashboard/data/agents-config.json`

10개 에이전트 전체에 `bio`, `skills`, `tasks` 필드를 추가한다. 기존 필드는 유지.

- [ ] **Step 1: agents-config.json 전체 교체**

`dashboard/data/agents-config.json`을 아래 내용으로 교체한다:

```json
[
  {
    "id": "trig_01E5Ktiv4jfrzVDqv4RKM8qp",
    "name": "SFOOD Wiki Weekly Maintenance",
    "cronExpression": "0 11 * * *",
    "department": "Wiki 관리팀",
    "runReportPrefix": "weekly",
    "agents": [
      {
        "id": "harvest",
        "name": "수확관 하루",
        "role": "키워드 수확 정찰관",
        "emoji": "🔍",
        "colorClass": "amber",
        "model": "claude-haiku-4-5",
        "description": "Confluence 페이지를 순회하며 최신 키워드와 갱신 필요 항목을 수집합니다.",
        "bio": "저는 Confluence 전체를 순찰하며 가이드 업데이트가 필요한 페이지와 누락된 키워드를 찾아냅니다. 빠른 처리 속도가 강점인 정찰 전문가입니다.",
        "skills": ["검색", "분류", "정찰"],
        "tasks": [
          "Confluence Index 페이지 전체 순회",
          "최신 AI 도구 키워드 수집",
          "갱신 필요 페이지 식별",
          "수확 결과를 harvest-result.json으로 저장"
        ]
      },
      {
        "id": "gap",
        "name": "분석관 가이",
        "role": "갭 분석관",
        "emoji": "📊",
        "colorClass": "blue",
        "model": "claude-haiku-4-5",
        "description": "수확 결과를 분석하여 누락된 가이드 및 업데이트 필요 항목을 식별합니다.",
        "bio": "수확된 데이터를 분석하여 무엇이 부족한지 파악합니다. 현재 위키 상태와 이상적인 상태 사이의 갭을 정량화하는 것이 제 역할입니다.",
        "skills": ["데이터 분석", "갭 탐지", "우선순위 판단"],
        "tasks": [
          "수확 결과 파일 분석",
          "누락된 가이드 목록 도출",
          "업데이트 필요 페이지 우선순위 결정",
          "갭 분석 결과를 gap-result.json으로 저장"
        ]
      },
      {
        "id": "writer-claude",
        "name": "작가 클로드",
        "role": "Claude 도메인 작성관",
        "emoji": "✍️",
        "colorClass": "purple",
        "model": "claude-sonnet-4-6",
        "description": "Claude 관련 가이드 페이지를 작성 및 업데이트합니다.",
        "bio": "Claude 관련 가이드를 전문으로 작성합니다. Claude Code, API, 프롬프트 기법 등 Claude 생태계 전반을 다룹니다.",
        "skills": ["문서 작성", "Claude 전문", "가이드 구성"],
        "tasks": [
          "Claude Code 기능 가이드 작성",
          "Claude API 사용법 업데이트",
          "프롬프트 엔지니어링 가이드 작성",
          "Confluence 페이지 직접 게시"
        ]
      },
      {
        "id": "writer-codex",
        "name": "작가 코덱스",
        "role": "Codex 도메인 작성관",
        "emoji": "📝",
        "colorClass": "green",
        "model": "claude-sonnet-4-6",
        "description": "Codex 관련 가이드 페이지를 작성 및 업데이트합니다.",
        "bio": "Codex 및 OpenAI 계열 도구 가이드 전문 작성관입니다. Codex CLI, GPT API 관련 문서를 최신 상태로 유지합니다.",
        "skills": ["문서 작성", "Codex 전문", "API 문서화"],
        "tasks": [
          "Codex CLI 가이드 작성 및 업데이트",
          "OpenAI API 사용 가이드 작성",
          "Codex 관련 Confluence 페이지 게시"
        ]
      },
      {
        "id": "writer-other",
        "name": "작가 아더",
        "role": "기타 도메인 작성관",
        "emoji": "🖊️",
        "colorClass": "indigo",
        "model": "claude-sonnet-4-6",
        "description": "기타 AI 도구 가이드 페이지를 작성 및 업데이트합니다.",
        "bio": "Claude와 Codex 외 모든 AI 도구를 담당합니다. Gemini, Cursor, Copilot 등 빠르게 변화하는 AI 생태계를 폭넓게 커버합니다.",
        "skills": ["문서 작성", "다양한 AI 도구", "시장 리서치"],
        "tasks": [
          "Gemini, Cursor 등 기타 AI 도구 가이드 작성",
          "신규 AI 도구 페이지 생성",
          "기타 도메인 Confluence 페이지 게시"
        ]
      },
      {
        "id": "synthesis",
        "name": "사령관 신스",
        "role": "종합 사령관",
        "emoji": "🎯",
        "colorClass": "red",
        "model": "claude-sonnet-4-6",
        "description": "모든 작업 결과를 종합하여 최종 보고서를 작성하고 Index를 업데이트합니다.",
        "bio": "모든 작성 결과물을 검수하고 종합하여 최종 보고서를 만듭니다. Index 페이지 링크 정합성 확인과 전체 품질 보증이 임무입니다.",
        "skills": ["종합 분석", "품질 검증", "보고서 작성"],
        "tasks": [
          "3명 작가 결과물 취합 및 검토",
          "Index 페이지 링크 업데이트",
          "Validation 체크리스트 실행",
          "주간 실행 보고서 작성 및 커밋"
        ]
      }
    ]
  },
  {
    "id": "trig_018dn6jkaABXrxrkHpKhcriL",
    "name": "Playbook 분석 및 AI 프롬프트 자동 개선",
    "cronExpression": "0 11 * * *",
    "department": "AI 검색 품질팀",
    "runReportPrefix": "playbook",
    "lastFiredAt": "2026-05-28T11:05:22Z",
    "agents": [
      {
        "id": "collector",
        "name": "수집관 큐",
        "role": "데이터 수집관",
        "emoji": "📡",
        "colorClass": "cyan",
        "model": "claude-sonnet-4-6",
        "description": "Playbook 데이터 및 사용자 쿼리 패턴을 수집합니다.",
        "bio": "Playbook 데이터와 사용자 쿼리 패턴을 수집합니다. AI 검색 품질 개선의 첫 단계로 원시 데이터를 확보하는 역할입니다.",
        "skills": ["데이터 수집", "쿼리 분석", "패턴 탐지"],
        "tasks": [
          "Playbook 데이터 수집",
          "사용자 쿼리 패턴 추출",
          "수집 결과 구조화 저장"
        ]
      },
      {
        "id": "pattern-analyst",
        "name": "패턴분석관 파이",
        "role": "패턴 분석관",
        "emoji": "🔬",
        "colorClass": "teal",
        "model": "claude-sonnet-4-6",
        "description": "수집된 데이터에서 검색 품질 개선 패턴을 분석합니다.",
        "bio": "수집된 데이터에서 검색 품질 저하 패턴을 분석합니다. 어떤 유형의 쿼리가 부정확한 결과를 내는지 규명하는 것이 전문입니다.",
        "skills": ["패턴 분석", "통계 처리", "원인 규명"],
        "tasks": [
          "수집 데이터 패턴 분석",
          "검색 품질 저하 원인 유형 분류",
          "개선 우선순위 도출"
        ]
      },
      {
        "id": "rule-generator",
        "name": "규칙생성관 루이",
        "role": "규칙 생성관",
        "emoji": "⚙️",
        "colorClass": "orange",
        "model": "claude-sonnet-4-6",
        "description": "분석 결과를 기반으로 AI 프롬프트 개선 규칙을 생성합니다.",
        "bio": "분석 결과를 바탕으로 AI 프롬프트 개선 규칙을 생성합니다. 데이터에서 도출된 인사이트를 실행 가능한 규칙으로 변환하는 것이 역할입니다.",
        "skills": ["규칙 생성", "프롬프트 설계", "추상화"],
        "tasks": [
          "패턴 분석 결과 기반 규칙 도출",
          "프롬프트 개선 규칙 문서화",
          "규칙 적용 가이드라인 작성"
        ]
      },
      {
        "id": "editor",
        "name": "편집관 에디",
        "role": "프롬프트 편집관",
        "emoji": "✏️",
        "colorClass": "pink",
        "model": "claude-sonnet-4-6",
        "description": "생성된 규칙을 적용하여 AI 프롬프트를 최종 편집합니다.",
        "bio": "생성된 규칙을 실제 AI 프롬프트에 적용하여 최종 편집합니다. 이론에서 실제 결과물로 이어지는 마지막 단계를 담당합니다.",
        "skills": ["프롬프트 편집", "품질 검증", "최종 검수"],
        "tasks": [
          "규칙 기반 프롬프트 수정",
          "편집 결과 품질 검증",
          "최종 프롬프트 저장 및 배포"
        ]
      }
    ]
  }
]
```

- [ ] **Step 2: JSON 유효성 + 에이전트 수 확인**

```bash
cd /home/donghyunlee/projects/SFOOD-LLM-WIKI-WORKFLOW && python3 -c "
import json
d = json.load(open('dashboard/data/agents-config.json'))
total = sum(len(r['agents']) for r in d)
no_tasks = [a['name'] for r in d for a in r['agents'] if not a.get('tasks')]
print(f'루틴: {len(d)}개, 에이전트: {total}명')
print(f'tasks 없는 에이전트: {no_tasks or \"없음\"}')
"
```

Expected:
```
루틴: 2개, 에이전트: 10명
tasks 없는 에이전트: 없음
```

- [ ] **Step 3: 커밋**

```bash
git add dashboard/data/agents-config.json
git commit -m "feat: add bio/skills/tasks content for all 10 agents"
```

---

### Task 3: Create AgentDetailModal Component

**Files:**
- Create: `dashboard/components/AgentDetailModal.tsx`

2단 패널 모달. 왼쪽: 아이덴티티(이모지·이름·역할·상태·XP·모델). 오른쪽: 담당 업무(메인) → 자기소개(서브) → 특기(서브). ESC + 배경 클릭으로 닫기.

- [ ] **Step 1: AgentDetailModal.tsx 생성**

`dashboard/components/AgentDetailModal.tsx`를 아래 내용으로 생성한다:

```typescript
'use client'
import { useEffect } from 'react'
import StatusBadge from './StatusBadge'
import type { AgentCharacter, AgentStatus } from '@/types'

interface Props {
  agent: AgentCharacter | null
  status: AgentStatus
  runCount: number
  onClose: () => void
}

const XP_COLOR: Record<string, string> = {
  amber: 'bg-amber-500',
  blue: 'bg-blue-500',
  purple: 'bg-purple-500',
  green: 'bg-green-500',
  indigo: 'bg-indigo-500',
  red: 'bg-red-500',
  cyan: 'bg-cyan-500',
  teal: 'bg-teal-500',
  orange: 'bg-orange-500',
  pink: 'bg-pink-500',
}

function formatModel(model: string): string {
  return model
    .replace('claude-', '')
    .replace('-4-6', ' 4.6')
    .replace('-4-5', ' 4.5')
    .replace('-20251001', '')
}

export default function AgentDetailModal({ agent, status, runCount, onClose }: Props) {
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose() }
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [onClose])

  if (!agent) return null

  const level = Math.min(10, Math.floor(runCount / 3) + 1)
  const xp = Math.min(20, runCount)
  const xpPercent = (xp / 20) * 100
  const xpColor = XP_COLOR[agent.colorClass] ?? 'bg-gray-500'
  const bioText = agent.bio ?? agent.description

  return (
    <div
      className="fixed inset-0 bg-black/75 backdrop-blur-sm z-50 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <div
        className="bg-gray-950 border border-gray-700 rounded-2xl w-full max-w-2xl shadow-2xl flex overflow-hidden max-h-[80vh]"
        onClick={e => e.stopPropagation()}
      >
        {/* 왼쪽 패널 — 아이덴티티 */}
        <div className="w-48 shrink-0 bg-gray-900/80 flex flex-col items-center justify-center gap-3 p-6 border-r border-gray-800">
          <span className="text-7xl leading-none select-none" role="img" aria-label={agent.role}>
            {agent.emoji}
          </span>
          <div className="text-center">
            <p className="font-bold text-white text-base">{agent.name}</p>
            <p className="text-xs text-gray-400 mt-0.5 leading-snug">{agent.role}</p>
          </div>
          <StatusBadge status={status} />
          <div className="w-full">
            <div className="flex justify-between text-xs text-gray-600 mb-1">
              <span>Lv.{level}</span>
              <span>XP {xp}/20</span>
            </div>
            <div className="h-1.5 bg-gray-800 rounded-full overflow-hidden">
              <div
                className={`h-full rounded-full ${xpColor}`}
                style={{ width: `${xpPercent}%` }}
              />
            </div>
          </div>
          <p className="text-xs text-gray-600">{formatModel(agent.model)}</p>
        </div>

        {/* 오른쪽 패널 — 상세 내용 */}
        <div className="flex-1 overflow-y-auto p-6 flex flex-col gap-5">
          <div className="flex justify-end">
            <button
              onClick={onClose}
              className="text-gray-500 hover:text-white text-xl leading-none transition-colors"
              aria-label="닫기"
            >
              ✕
            </button>
          </div>

          {/* 담당 업무 — 메인 콘텐츠 */}
          {agent.tasks && agent.tasks.length > 0 && (
            <div>
              <h3 className="text-xs font-semibold text-gray-300 mb-3 uppercase tracking-widest">
                담당 업무
              </h3>
              <ul className="flex flex-col gap-2">
                {agent.tasks.map((task, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm text-gray-200">
                    <span className="text-gray-500 mt-0.5 shrink-0">•</span>
                    <span>{task}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* 자기소개 — 서브 */}
          <div className="border-t border-gray-800 pt-4">
            <h3 className="text-xs font-semibold text-gray-500 mb-2 uppercase tracking-widest">
              자기소개
            </h3>
            <p className="text-sm text-gray-400 leading-relaxed">{bioText}</p>
          </div>

          {/* 특기 태그 — 서브 */}
          {agent.skills && agent.skills.length > 0 && (
            <div className="border-t border-gray-800 pt-4">
              <h3 className="text-xs font-semibold text-gray-500 mb-2 uppercase tracking-widest">
                특기
              </h3>
              <div className="flex flex-wrap gap-1.5">
                {agent.skills.map((skill, i) => (
                  <span
                    key={i}
                    className="bg-gray-800 text-gray-300 rounded-full px-2.5 py-0.5 text-xs"
                  >
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
```

- [ ] **Step 2: TypeScript 확인**

```bash
cd /home/donghyunlee/projects/SFOOD-LLM-WIKI-WORKFLOW/dashboard && npx tsc --noEmit 2>&1
```

Expected: 출력 없음

- [ ] **Step 3: 커밋**

```bash
git add dashboard/components/AgentDetailModal.tsx
git commit -m "feat: create AgentDetailModal 2-panel component"
```

---

### Task 4: Update AgentStatCard — Add onClick Prop

**Files:**
- Modify: `dashboard/components/AgentStatCard.tsx`

`onClick: () => void` prop을 추가하고 카드에 `cursor-pointer`를 붙인다.

- [ ] **Step 1: Props 인터페이스 수정**

`dashboard/components/AgentStatCard.tsx`의 `Props` 인터페이스를 찾아 `onClick` 추가:

```typescript
interface Props {
  agent: AgentCharacter
  status: AgentStatus
  runCount: number
  onClick: () => void
}
```

- [ ] **Step 2: 컴포넌트 시그니처 수정**

함수 선언부에서 `onClick` destructuring 추가:

```typescript
export default function AgentStatCard({ agent, status, runCount, onClick }: Props) {
```

- [ ] **Step 3: root div에 onClick + cursor-pointer 추가**

기존 root `<div>`의 `className`에 `cursor-pointer` 추가, `onClick={onClick}` 핸들러 추가:

```typescript
    <div
      data-testid="agent-card"
      onClick={onClick}
      className={`relative bg-gray-900/70 border-2 rounded-2xl p-4 flex flex-col items-center gap-2.5 w-40 transition-all duration-300 hover:bg-gray-800/70 cursor-pointer ${RING_CLASS[status]}`}
    >
```

- [ ] **Step 4: TypeScript 확인**

```bash
cd /home/donghyunlee/projects/SFOOD-LLM-WIKI-WORKFLOW/dashboard && npx tsc --noEmit 2>&1
```

Expected: `DepartmentFloor.tsx`에서 `onClick` prop 누락 오류가 발생할 수 있음 — Task 5에서 해결.

- [ ] **Step 5: 커밋**

```bash
git add dashboard/components/AgentStatCard.tsx
git commit -m "feat: add onClick prop to AgentStatCard"
```

---

### Task 5: Update DepartmentFloor — Wire Modal

**Files:**
- Modify: `dashboard/components/DepartmentFloor.tsx`

`selectedAgent` state를 추가하고, `AgentStatCard`에 `onClick` 전달, `AgentDetailModal` 렌더링.

- [ ] **Step 1: DepartmentFloor.tsx 전체 교체**

`dashboard/components/DepartmentFloor.tsx`를 아래 내용으로 교체한다:

```typescript
'use client'
import { useState } from 'react'
import AgentStatCard from './AgentStatCard'
import AgentDetailModal from './AgentDetailModal'
import StatusBadge from './StatusBadge'
import type { AgentCharacter, RoutineWithStatus } from '@/types'

interface Props {
  routine: RoutineWithStatus
  onViewReport: (filename: string) => void
}

export default function DepartmentFloor({ routine, onViewReport }: Props) {
  const [selectedAgent, setSelectedAgent] = useState<AgentCharacter | null>(null)

  return (
    <section className="mb-14">
      {/* 부서 헤더 */}
      <div className="flex items-start justify-between mb-5 flex-wrap gap-3">
        <div>
          <div className="flex items-center gap-3 mb-1.5">
            <h2 className="text-lg font-bold text-white">{routine.department}</h2>
            <StatusBadge status={routine.status} />
          </div>
          <div className="flex flex-wrap gap-x-3 gap-y-0.5 text-sm text-gray-500">
            <span>
              마지막 실행:{' '}
              <span className="text-gray-400">{routine.latestRun?.date ?? '기록 없음'}</span>
            </span>
            <span>·</span>
            <span>
              다음 실행:{' '}
              <span className="text-gray-400">{routine.nextRunLabel}</span>
            </span>
            <span>·</span>
            <span>
              총 <span className="text-gray-400">{routine.runCount}회</span> 실행
            </span>
          </div>
        </div>

        {routine.hasLocalReport && routine.latestRun && (
          <button
            onClick={() => onViewReport(routine.latestRun!.filename)}
            className="shrink-0 text-xs px-3 py-2 bg-gray-800 hover:bg-gray-700 text-gray-300 rounded-lg border border-gray-600 transition-colors"
          >
            📋 최근 리포트 보기
          </button>
        )}
      </div>

      {/* 에이전트 카드 그리드 */}
      <div className="flex flex-wrap gap-4">
        {routine.agents.map(agent => (
          <AgentStatCard
            key={agent.id}
            agent={agent}
            status={routine.status}
            runCount={routine.runCount}
            onClick={() => setSelectedAgent(agent)}
          />
        ))}
      </div>

      {/* 에이전트 상세 모달 */}
      <AgentDetailModal
        agent={selectedAgent}
        status={routine.status}
        runCount={routine.runCount}
        onClose={() => setSelectedAgent(null)}
      />
    </section>
  )
}
```

- [ ] **Step 2: TypeScript 확인**

```bash
cd /home/donghyunlee/projects/SFOOD-LLM-WIKI-WORKFLOW/dashboard && npx tsc --noEmit 2>&1
```

Expected: 출력 없음 (오류 0개)

- [ ] **Step 3: 프로덕션 빌드 확인**

```bash
cd /home/donghyunlee/projects/SFOOD-LLM-WIKI-WORKFLOW/dashboard && npm run build 2>&1 | tail -15
```

Expected: 오류 없이 빌드 성공

- [ ] **Step 4: 개발 서버에서 동작 확인**

서버가 실행 중인지 확인 후, 에이전트 카드 클릭 시 모달이 뜨는지 확인:

```bash
curl -s --max-time 3 http://localhost:3737 > /dev/null && echo "서버 실행 중" || echo "서버 없음 — npm run dev 필요"
```

- [ ] **Step 5: 커밋**

```bash
git add dashboard/components/DepartmentFloor.tsx
git commit -m "feat: wire AgentDetailModal into DepartmentFloor — click card to view details"
```

---

## Verification Checklist

모든 태스크 완료 후 최종 확인:

```bash
# TypeScript 0 오류
cd /home/donghyunlee/projects/SFOOD-LLM-WIKI-WORKFLOW/dashboard && npx tsc --noEmit

# 빌드 성공
npm run build

# 에이전트 데이터 확인
curl -s http://localhost:3737/api/dashboard | python3 -c "
import json, sys
d = json.load(sys.stdin)
for r in d['routines']:
    for a in r['agents']:
        has_tasks = bool(a.get('tasks'))
        print(a['name'], '| tasks:', has_tasks)
"
```

Expected: 10명 모두 `tasks: True`
