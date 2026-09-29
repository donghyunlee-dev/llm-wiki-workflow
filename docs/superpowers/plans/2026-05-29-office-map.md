# Office Map Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 카드 그리드를 2D 오피스 맵으로 전환 — 에이전트가 상태에 따라 팀 사무실/휴게실에 포지션되고, 작업 중 글로우·바운스·말풍선으로 생동감을 표현한다.

**Architecture:** 3개 방(Wiki팀 사무실, AI팀 사무실, 휴게실)을 CSS로 그리고, 각 방 안에 에이전트를 절대 좌표로 배치한다. 루틴 status가 `running|completed|error`이면 팀 사무실, `idle`이면 휴게실. 우측에 항상 표시되는 AgentProfilePanel이 선택된 에이전트 프로필 또는 HQ 현황을 보여준다.

**Tech Stack:** Next.js 15, TypeScript 5, Tailwind CSS 3, plain CSS animations (globals.css)

**Working directory:** `/home/donghyunlee/projects/SFOOD-LLM-WIKI-WORKFLOW/dashboard`

---

## File Map

| File | Action | 내용 |
|---|---|---|
| `app/globals.css` | MODIFY | sprite 애니메이션 + glow 클래스 추가 |
| `components/AgentSprite.tsx` | CREATE | 이모지 스프라이트 (glow·bounce·말풍선) |
| `components/OfficeRoom.tsx` | CREATE | 방 컨테이너 (슬롯 배치, 활성화 테두리) |
| `components/OfficeMap.tsx` | CREATE | 3개 방 + 에이전트 분류 로직 |
| `components/AgentProfilePanel.tsx` | CREATE | 우측 고정 패널 (HQ현황 / 에이전트 프로필) |
| `app/page.tsx` | MODIFY | 2컬럼 레이아웃, 구형 컴포넌트 제거 |
| `components/DepartmentFloor.tsx` | DELETE | OfficeMap으로 대체 |
| `components/AgentStatCard.tsx` | DELETE | AgentSprite로 대체 |
| `components/AgentDetailModal.tsx` | DELETE | AgentProfilePanel로 대체 |

---

### Task 1: CSS 애니메이션 추가 (globals.css)

**Files:**
- Modify: `dashboard/app/globals.css`

- [ ] **Step 1: globals.css에 애니메이션 추가**

기존 내용 끝에 아래를 **append**한다 (기존 내용 삭제하지 말 것):

```css
/* ── Office Map: Sprite Animations ─────────────────────── */
@keyframes sprite-bounce {
  0%, 100% { transform: translateY(0); }
  50%       { transform: translateY(-6px); }
}

@keyframes sprite-float {
  0%, 100% { transform: translateY(0); }
  50%       { transform: translateY(-3px); }
}

@keyframes sprite-shake {
  0%, 100% { transform: translateX(0); }
  25%       { transform: translateX(-3px); }
  75%       { transform: translateX(3px); }
}

.sprite-bounce { animation: sprite-bounce 1.2s ease-in-out infinite; }
.sprite-float  { animation: sprite-float  3s   ease-in-out infinite; }
.sprite-shake  { animation: sprite-shake  0.6s ease-in-out infinite; }

/* ── Office Map: Sprite Glow (colorClass별) ─────────────── */
@keyframes glow-amber  { 0%,100%{box-shadow:0 0 8px 3px rgba(245,158,11,0.3)} 50%{box-shadow:0 0 20px 7px rgba(245,158,11,0.7)} }
@keyframes glow-blue   { 0%,100%{box-shadow:0 0 8px 3px rgba(59,130,246,0.3)}  50%{box-shadow:0 0 20px 7px rgba(59,130,246,0.7)}  }
@keyframes glow-purple { 0%,100%{box-shadow:0 0 8px 3px rgba(168,85,247,0.3)}  50%{box-shadow:0 0 20px 7px rgba(168,85,247,0.7)}  }
@keyframes glow-green-sp { 0%,100%{box-shadow:0 0 8px 3px rgba(34,197,94,0.3)} 50%{box-shadow:0 0 20px 7px rgba(34,197,94,0.7)} }
@keyframes glow-indigo { 0%,100%{box-shadow:0 0 8px 3px rgba(99,102,241,0.3)}  50%{box-shadow:0 0 20px 7px rgba(99,102,241,0.7)}  }
@keyframes glow-red-sp { 0%,100%{box-shadow:0 0 8px 3px rgba(239,68,68,0.3)}   50%{box-shadow:0 0 20px 7px rgba(239,68,68,0.7)}   }
@keyframes glow-cyan   { 0%,100%{box-shadow:0 0 8px 3px rgba(6,182,212,0.3)}   50%{box-shadow:0 0 20px 7px rgba(6,182,212,0.7)}   }
@keyframes glow-teal   { 0%,100%{box-shadow:0 0 8px 3px rgba(20,184,166,0.3)}  50%{box-shadow:0 0 20px 7px rgba(20,184,166,0.7)}  }
@keyframes glow-orange { 0%,100%{box-shadow:0 0 8px 3px rgba(249,115,22,0.3)}  50%{box-shadow:0 0 20px 7px rgba(249,115,22,0.7)}  }
@keyframes glow-pink   { 0%,100%{box-shadow:0 0 8px 3px rgba(236,72,153,0.3)}  50%{box-shadow:0 0 20px 7px rgba(236,72,153,0.7)}  }

.sprite-glow-amber  { animation: glow-amber   1.4s ease-in-out infinite; border-radius: 50%; }
.sprite-glow-blue   { animation: glow-blue    1.4s ease-in-out infinite; border-radius: 50%; }
.sprite-glow-purple { animation: glow-purple  1.4s ease-in-out infinite; border-radius: 50%; }
.sprite-glow-green  { animation: glow-green-sp 1.4s ease-in-out infinite; border-radius: 50%; }
.sprite-glow-indigo { animation: glow-indigo  1.4s ease-in-out infinite; border-radius: 50%; }
.sprite-glow-red    { animation: glow-red-sp  1.4s ease-in-out infinite; border-radius: 50%; }
.sprite-glow-cyan   { animation: glow-cyan    1.4s ease-in-out infinite; border-radius: 50%; }
.sprite-glow-teal   { animation: glow-teal    1.4s ease-in-out infinite; border-radius: 50%; }
.sprite-glow-orange { animation: glow-orange  1.4s ease-in-out infinite; border-radius: 50%; }
.sprite-glow-pink   { animation: glow-pink    1.4s ease-in-out infinite; border-radius: 50%; }

/* ── Office Map: Room active border ──────────────────────── */
@keyframes room-pulse {
  0%, 100% { box-shadow: 0 0 12px 2px rgba(234,179,8,0.2); }
  50%       { box-shadow: 0 0 24px 6px rgba(234,179,8,0.4); }
}
.room-active { animation: room-pulse 2s ease-in-out infinite; }

/* ── Office Map: Speech bubble ───────────────────────────── */
.speech-bubble {
  position: absolute;
  bottom: calc(100% + 6px);
  left: 50%;
  transform: translateX(-50%);
  background: #1f2937;
  border: 1px solid #374151;
  color: #e5e7eb;
  font-size: 0.65rem;
  white-space: nowrap;
  padding: 2px 8px;
  border-radius: 8px;
  pointer-events: none;
  z-index: 20;
}
.speech-bubble::after {
  content: '';
  position: absolute;
  top: 100%;
  left: 50%;
  transform: translateX(-50%);
  border: 5px solid transparent;
  border-top-color: #374151;
}
```

- [ ] **Step 2: 브라우저에서 CSS 로드 확인**

```bash
cd /home/donghyunlee/projects/SFOOD-LLM-WIKI-WORKFLOW/dashboard && npx tsc --noEmit 2>&1
```

Expected: 출력 없음 (CSS 파일은 TS 검사 대상 아님 — 오류 없으면 OK)

- [ ] **Step 3: 커밋**

```bash
cd /home/donghyunlee/projects/SFOOD-LLM-WIKI-WORKFLOW && git add dashboard/app/globals.css && git commit -m "feat: add office map sprite animations and glow CSS"
```

---

### Task 2: AgentSprite 컴포넌트 생성

**Files:**
- Create: `dashboard/components/AgentSprite.tsx`

이모지 스프라이트. 슬롯 위치는 상위 OfficeRoom이 `position: absolute`로 주입. 이 컴포넌트는 자신의 내부 레이아웃만 담당한다.

- [ ] **Step 1: AgentSprite.tsx 생성**

`dashboard/components/AgentSprite.tsx`를 아래 내용으로 생성한다:

```typescript
'use client'
import type { AgentCharacter, AgentStatus } from '@/types'

interface Props {
  agent: AgentCharacter
  status: AgentStatus
  slotIndex: number   // idle-float animation-delay 계산용
  isSelected: boolean
  onClick: () => void
}

const SPRITE_ANIM: Record<AgentStatus, string> = {
  idle: 'sprite-float',
  running: 'sprite-bounce',
  completed: 'sprite-float',
  error: 'sprite-shake',
}

const GLOW_CLASS: Record<string, string> = {
  amber: 'sprite-glow-amber',
  blue: 'sprite-glow-blue',
  purple: 'sprite-glow-purple',
  green: 'sprite-glow-green',
  indigo: 'sprite-glow-indigo',
  red: 'sprite-glow-red',
  cyan: 'sprite-glow-cyan',
  teal: 'sprite-glow-teal',
  orange: 'sprite-glow-orange',
  pink: 'sprite-glow-pink',
}

export default function AgentSprite({ agent, status, slotIndex, isSelected, onClick }: Props) {
  const animClass = SPRITE_ANIM[status]
  const glowClass = GLOW_CLASS[agent.colorClass] ?? ''
  const delay = `${slotIndex * 0.35}s`

  return (
    <div
      className="flex flex-col items-center cursor-pointer select-none group"
      onClick={onClick}
      title={agent.name}
    >
      {/* 말풍선 */}
      {status === 'running' && (
        <div className="speech-bubble">작업 중...</div>
      )}

      {/* 이모지 + 글로우 링 */}
      <div className="relative flex items-center justify-center">
        {status === 'running' && (
          <div
            className={`absolute inset-[-6px] ${glowClass}`}
            aria-hidden="true"
          />
        )}
        <span
          className={`text-3xl leading-none relative z-10 transition-transform ${animClass} ${isSelected ? 'scale-125' : ''}`}
          style={{ animationDelay: delay }}
          role="img"
          aria-label={agent.role}
        >
          {agent.emoji}
        </span>
      </div>

      {/* 이름표 */}
      <span
        className={`text-[10px] mt-1 max-w-[72px] truncate text-center leading-tight transition-colors ${
          isSelected ? 'text-white font-semibold' : 'text-gray-500 group-hover:text-gray-300'
        }`}
      >
        {agent.name}
      </span>
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
cd /home/donghyunlee/projects/SFOOD-LLM-WIKI-WORKFLOW && git add dashboard/components/AgentSprite.tsx && git commit -m "feat: create AgentSprite component with glow and bounce animations"
```

---

### Task 3: OfficeRoom 컴포넌트 생성

**Files:**
- Create: `dashboard/components/OfficeRoom.tsx`

방 컨테이너. `position: relative`로 내부에 에이전트 절대 배치. 슬롯 좌표 10개 사전 정의.

- [ ] **Step 1: OfficeRoom.tsx 생성**

`dashboard/components/OfficeRoom.tsx`를 아래 내용으로 생성한다:

```typescript
'use client'
import AgentSprite from './AgentSprite'
import type { AgentCharacter, AgentStatus } from '@/types'

export interface AgentInRoom {
  agent: AgentCharacter
  status: AgentStatus
  slotIndex: number
}

interface Props {
  title: string
  icon: string
  agents: AgentInRoom[]
  selectedAgentId: string | null
  onSelectAgent: (id: string) => void
  isActive: boolean   // true이면 방 테두리 glow
}

// 방 크기 기준 % 좌표 — 최대 10슬롯 (5×2 그리드)
const SLOT_POSITIONS = [
  { left: '10%', top: '45%' },
  { left: '28%', top: '45%' },
  { left: '46%', top: '45%' },
  { left: '64%', top: '45%' },
  { left: '82%', top: '45%' },
  { left: '10%', top: '78%' },
  { left: '28%', top: '78%' },
  { left: '46%', top: '78%' },
  { left: '64%', top: '78%' },
  { left: '82%', top: '78%' },
]

export default function OfficeRoom({ title, icon, agents, selectedAgentId, onSelectAgent, isActive }: Props) {
  return (
    <div
      className={`relative rounded-2xl border min-h-[150px] mb-4 ${
        isActive
          ? 'border-yellow-600/50 bg-gray-900/70 room-active'
          : 'border-gray-800 bg-gray-900/40'
      }`}
    >
      {/* 방 제목 */}
      <div className="absolute top-3 left-4 flex items-center gap-1.5 pointer-events-none">
        <span className="text-sm">{icon}</span>
        <span className="text-xs text-gray-500 uppercase tracking-widest font-semibold">
          {title}
        </span>
      </div>

      {/* 에이전트 스프라이트 (슬롯 배치) */}
      {agents.map(({ agent, status, slotIndex }) => {
        const slot = SLOT_POSITIONS[slotIndex % SLOT_POSITIONS.length]
        return (
          <div
            key={agent.id}
            className="absolute"
            style={{ left: slot.left, top: slot.top, transform: 'translate(-50%, -50%)' }}
          >
            <AgentSprite
              agent={agent}
              status={status}
              slotIndex={slotIndex}
              isSelected={selectedAgentId === agent.id}
              onClick={() => onSelectAgent(agent.id)}
            />
          </div>
        )
      })}

      {/* 빈 방 표시 */}
      {agents.length === 0 && (
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-xs text-gray-700">비어 있음</span>
        </div>
      )}
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
cd /home/donghyunlee/projects/SFOOD-LLM-WIKI-WORKFLOW && git add dashboard/components/OfficeRoom.tsx && git commit -m "feat: create OfficeRoom component with slot-based agent positioning"
```

---

### Task 4: OfficeMap 컴포넌트 생성

**Files:**
- Create: `dashboard/components/OfficeMap.tsx`

에이전트 분류 로직 + 3개 방 렌더링. 루틴 status가 `idle`이면 해당 팀 에이전트 전원을 휴게실로, 그 외에는 팀 사무실로 보낸다.

- [ ] **Step 1: OfficeMap.tsx 생성**

`dashboard/components/OfficeMap.tsx`를 아래 내용으로 생성한다:

```typescript
'use client'
import OfficeRoom, { type AgentInRoom } from './OfficeRoom'
import type { RoutineWithStatus } from '@/types'

interface Props {
  routines: RoutineWithStatus[]
  selectedAgentId: string | null
  onSelectAgent: (id: string) => void   // null 처리는 page.tsx에서 toggle로 수행
}

// department 문자열 → 방 설정 매핑
const ROOM_CONFIG: Record<string, { title: string; icon: string }> = {
  'Wiki 관리팀': { title: 'Wiki 관리팀 사무실', icon: '📋' },
  'AI 검색 품질팀': { title: 'AI 검색 품질팀 사무실', icon: '🔬' },
}

export default function OfficeMap({ routines, selectedAgentId, onSelectAgent }: Props) {
  // 에이전트를 방으로 분류
  // key: department 이름, value: AgentInRoom[]
  const teamRooms: Record<string, AgentInRoom[]> = {}
  const breakRoom: AgentInRoom[] = []

  for (const routine of routines) {
    const inOffice = routine.status !== 'idle'
    const dept = routine.department

    if (!teamRooms[dept]) teamRooms[dept] = []

    routine.agents.forEach(agent => {
      const target = inOffice ? teamRooms[dept] : breakRoom
      target.push({ agent, status: routine.status, slotIndex: target.length })
    })
  }

  // routines 순서대로 팀 방 렌더링
  const deptOrder = routines.map(r => r.department)

  return (
    <div className="flex flex-col gap-2">
      {deptOrder.map(dept => {
        const config = ROOM_CONFIG[dept] ?? { title: dept, icon: '🏢' }
        const agents = teamRooms[dept] ?? []
        const routine = routines.find(r => r.department === dept)!
        const isActive = routine.status === 'running'

        return (
          <OfficeRoom
            key={dept}
            title={config.title}
            icon={config.icon}
            agents={agents}
            selectedAgentId={selectedAgentId}
            onSelectAgent={onSelectAgent}
            isActive={isActive}
          />
        )
      })}

      {/* 휴게실 */}
      <OfficeRoom
        title="휴게실"
        icon="☕"
        agents={breakRoom}
        selectedAgentId={selectedAgentId}
        onSelectAgent={onSelectAgent}
        isActive={false}
      />
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
cd /home/donghyunlee/projects/SFOOD-LLM-WIKI-WORKFLOW && git add dashboard/components/OfficeMap.tsx && git commit -m "feat: create OfficeMap component with department-based room distribution"
```

---

### Task 5: AgentProfilePanel 컴포넌트 생성

**Files:**
- Create: `dashboard/components/AgentProfilePanel.tsx`

항상 표시되는 우측 패널. 선택된 에이전트 없으면 HQ 현황, 있으면 프로필.

- [ ] **Step 1: AgentProfilePanel.tsx 생성**

`dashboard/components/AgentProfilePanel.tsx`를 아래 내용으로 생성한다:

```typescript
'use client'
import StatusBadge from './StatusBadge'
import type { AgentCharacter, AgentStatus, RoutineWithStatus } from '@/types'

interface Props {
  routines: RoutineWithStatus[]
  selectedAgentId: string | null
  onDeselect: () => void
  onViewReport: (filename: string) => void
}

interface SelectedData {
  agent: AgentCharacter
  status: AgentStatus
  runCount: number
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

function findSelected(routines: RoutineWithStatus[], id: string | null): SelectedData | null {
  if (!id) return null
  for (const r of routines) {
    const agent = r.agents.find(a => a.id === id)
    if (agent) return { agent, status: r.status, runCount: r.runCount }
  }
  return null
}

export default function AgentProfilePanel({ routines, selectedAgentId, onDeselect, onViewReport }: Props) {
  const selected = findSelected(routines, selectedAgentId)

  if (!selected) {
    // HQ 현황 요약
    return (
      <div className="p-5 flex flex-col gap-4">
        <h2 className="text-xs font-semibold text-gray-500 uppercase tracking-widest">
          SFOOD Agent HQ
        </h2>
        <div className="flex flex-col gap-3">
          {routines.map(r => (
            <div key={r.id} className="flex flex-col gap-1.5">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-200 font-medium">{r.department}</p>
                  <p className="text-xs text-gray-500">{r.agents.length}명</p>
                </div>
                <StatusBadge status={r.status} />
              </div>
              {r.hasLocalReport && r.latestRun && (
                <button
                  onClick={() => onViewReport(r.latestRun!.filename)}
                  className="text-[10px] px-2 py-1 bg-gray-800 hover:bg-gray-700 text-gray-400 rounded border border-gray-700 transition-colors text-left"
                >
                  📋 최근 리포트 보기
                </button>
              )}
            </div>
          ))}
        </div>
        <p className="text-xs text-gray-700 mt-2 leading-relaxed">
          에이전트를 클릭하면<br />프로필을 볼 수 있습니다
        </p>
      </div>
    )
  }

  const { agent, status, runCount } = selected
  const level = Math.min(10, Math.floor(runCount / 3) + 1)
  const xp = Math.min(20, runCount)
  const xpPercent = (xp / 20) * 100
  const xpColor = XP_COLOR[agent.colorClass] ?? 'bg-gray-500'
  const bioText = agent.bio ?? agent.description

  return (
    <div className="p-5 flex flex-col gap-4">
      {/* 닫기 */}
      <div className="flex justify-end">
        <button
          onClick={onDeselect}
          className="text-gray-600 hover:text-gray-300 text-sm transition-colors"
          aria-label="선택 해제"
        >
          ✕
        </button>
      </div>

      {/* 아이덴티티 */}
      <div className="flex flex-col items-center gap-2 text-center">
        <span className="text-5xl leading-none select-none" role="img" aria-label={agent.role}>
          {agent.emoji}
        </span>
        <div>
          <p className="font-bold text-white text-base">{agent.name}</p>
          <p className="text-xs text-gray-400 mt-0.5">{agent.role}</p>
        </div>
        <StatusBadge status={status} />
      </div>

      {/* XP + 레벨 */}
      <div>
        <div className="flex justify-between text-xs text-gray-600 mb-1">
          <span>Lv.{level}</span>
          <span>XP {xp}/20 · {formatModel(agent.model)}</span>
        </div>
        <div className="h-1.5 bg-gray-800 rounded-full overflow-hidden">
          <div
            className={`h-full rounded-full ${xpColor}`}
            style={{ width: `${xpPercent}%` }}
          />
        </div>
      </div>

      {/* 담당 업무 */}
      {agent.tasks && agent.tasks.length > 0 && (
        <div className="border-t border-gray-800 pt-4">
          <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-2">
            담당 업무
          </h3>
          <ul className="flex flex-col gap-1.5">
            {agent.tasks.map((task, i) => (
              <li key={i} className="flex items-start gap-1.5 text-xs text-gray-200">
                <span className="text-gray-600 shrink-0 mt-0.5">•</span>
                <span>{task}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* 자기소개 */}
      <div className="border-t border-gray-800 pt-4">
        <h3 className="text-xs font-semibold text-gray-600 uppercase tracking-widest mb-2">
          자기소개
        </h3>
        <p className="text-xs text-gray-400 leading-relaxed">{bioText}</p>
      </div>

      {/* 특기 */}
      {agent.skills && agent.skills.length > 0 && (
        <div className="border-t border-gray-800 pt-4">
          <h3 className="text-xs font-semibold text-gray-600 uppercase tracking-widest mb-2">
            특기
          </h3>
          <div className="flex flex-wrap gap-1.5">
            {agent.skills.map((skill, i) => (
              <span
                key={i}
                className="bg-gray-800 text-gray-300 rounded-full px-2 py-0.5 text-[10px]"
              >
                {skill}
              </span>
            ))}
          </div>
        </div>
      )}
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
cd /home/donghyunlee/projects/SFOOD-LLM-WIKI-WORKFLOW && git add dashboard/components/AgentProfilePanel.tsx && git commit -m "feat: create AgentProfilePanel — always-visible right panel"
```

---

### Task 6: page.tsx 2컬럼 레이아웃으로 교체 + 구형 컴포넌트 삭제

**Files:**
- Modify: `dashboard/app/page.tsx`
- Delete: `dashboard/components/DepartmentFloor.tsx`
- Delete: `dashboard/components/AgentStatCard.tsx`
- Delete: `dashboard/components/AgentDetailModal.tsx`

- [ ] **Step 1: page.tsx 전체 교체**

`dashboard/app/page.tsx`를 아래 내용으로 교체한다:

```typescript
'use client'
import { useEffect, useState, useCallback } from 'react'
import OfficeMap from '@/components/OfficeMap'
import AgentProfilePanel from '@/components/AgentProfilePanel'
import MarkdownModal from '@/components/MarkdownModal'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import type { DashboardData } from '@/types'

const REFRESH_INTERVAL_MS = 5 * 60 * 1000

export default function DashboardPage() {
  const [data, setData] = useState<DashboardData | null>(null)
  const [selectedAgentId, setSelectedAgentId] = useState<string | null>(null)
  const [selectedReport, setSelectedReport] = useState<string | null>(null)
  const [syncing, setSyncing] = useState(false)
  const [syncMsg, setSyncMsg] = useState<string | null>(null)

  const fetchData = useCallback(() => {
    fetch('/api/dashboard')
      .then(r => r.json())
      .then((json: DashboardData) => setData(json))
      .catch(() => {})
  }, [])

  useEffect(() => {
    fetchData()
    const id = setInterval(fetchData, REFRESH_INTERVAL_MS)
    return () => clearInterval(id)
  }, [fetchData])

  async function handleSync() {
    setSyncing(true)
    setSyncMsg(null)
    try {
      const res = await fetch('/api/sync', { method: 'POST' })
      const json = await res.json()
      setSyncMsg(json.message)
      if (json.success) fetchData()
    } finally {
      setSyncing(false)
      setTimeout(() => setSyncMsg(null), 5000)
    }
  }

  const deptCount = data?.routines.length ?? 0
  const agentCount = data?.routines.reduce((s, r) => s + r.agents.length, 0) ?? 0

  return (
    <div className="flex flex-col min-h-screen">
      <Header
        syncing={syncing}
        syncMsg={syncMsg}
        lastSyncedAt={data?.lastSyncedAt ?? null}
        onSync={handleSync}
      />

      <main className="flex flex-1 overflow-hidden" style={{ height: 'calc(100vh - 120px)' }}>
        {/* 왼쪽: 오피스 맵 */}
        <div className="flex-1 min-w-0 overflow-y-auto p-6">
          {!data && (
            <p className="text-gray-600 text-sm">데이터 로딩 중...</p>
          )}
          {data && (
            <OfficeMap
              routines={data.routines}
              selectedAgentId={selectedAgentId}
              onSelectAgent={id => setSelectedAgentId(prev => prev === id ? null : id)}
            />
          )}
        </div>

        {/* 오른쪽: 에이전트 프로필 패널 */}
        <aside className="w-72 shrink-0 border-l border-gray-800 overflow-y-auto bg-gray-950/50">
          {data && (
            <AgentProfilePanel
              routines={data.routines}
              selectedAgentId={selectedAgentId}
              onDeselect={() => setSelectedAgentId(null)}
              onViewReport={setSelectedReport}
            />
          )}
        </aside>
      </main>

      <Footer deptCount={deptCount} agentCount={agentCount} />

      <MarkdownModal
        filename={selectedReport}
        onClose={() => setSelectedReport(null)}
      />
    </div>
  )
}
```

- [ ] **Step 2: 구형 컴포넌트 삭제**

```bash
rm /home/donghyunlee/projects/SFOOD-LLM-WIKI-WORKFLOW/dashboard/components/DepartmentFloor.tsx
rm /home/donghyunlee/projects/SFOOD-LLM-WIKI-WORKFLOW/dashboard/components/AgentStatCard.tsx
rm /home/donghyunlee/projects/SFOOD-LLM-WIKI-WORKFLOW/dashboard/components/AgentDetailModal.tsx
```

- [ ] **Step 3: TypeScript 0 오류 확인**

```bash
cd /home/donghyunlee/projects/SFOOD-LLM-WIKI-WORKFLOW/dashboard && npx tsc --noEmit 2>&1
```

Expected: 출력 없음 (0 오류). 오류 있으면 반드시 수정 후 진행.

- [ ] **Step 4: 프로덕션 빌드 확인**

```bash
cd /home/donghyunlee/projects/SFOOD-LLM-WIKI-WORKFLOW/dashboard && npm run build 2>&1 | tail -20
```

Expected: 빌드 성공, 오류 없음

- [ ] **Step 5: 개발 서버 실행 확인**

```bash
curl -s --max-time 5 http://localhost:3737 > /dev/null && echo "서버 OK" || echo "서버 없음 — npm run dev 필요"
```

서버가 없으면:
```bash
rm -rf /home/donghyunlee/projects/SFOOD-LLM-WIKI-WORKFLOW/dashboard/.next
cd /home/donghyunlee/projects/SFOOD-LLM-WIKI-WORKFLOW/dashboard && npm run dev > /tmp/dashboard-dev.log 2>&1 &
sleep 6 && curl -s --max-time 5 http://localhost:3737/api/dashboard | python3 -c "import json,sys; d=json.load(sys.stdin); print('routines:', len(d['routines']))"
```

Expected: `routines: 2`

- [ ] **Step 6: 커밋**

```bash
cd /home/donghyunlee/projects/SFOOD-LLM-WIKI-WORKFLOW && git add dashboard/app/page.tsx && git rm dashboard/components/DepartmentFloor.tsx dashboard/components/AgentStatCard.tsx dashboard/components/AgentDetailModal.tsx && git commit -m "feat: replace card grid with 2-column office map layout"
```

---

## Verification Checklist

모든 태스크 완료 후 최종 확인:

```bash
# TypeScript 0 오류
cd /home/donghyunlee/projects/SFOOD-LLM-WIKI-WORKFLOW/dashboard && npx tsc --noEmit

# 빌드 성공
npm run build

# API 응답 확인
curl -s http://localhost:3737/api/dashboard | python3 -c "
import json, sys
d = json.load(sys.stdin)
print('routines:', len(d['routines']))
for r in d['routines']:
    print(f'  {r[\"department\"]}: {r[\"status\"]} ({len(r[\"agents\"])}명)')
"
```

Expected:
```
routines: 2
  Wiki 관리팀: idle (6명)
  AI 검색 품질팀: idle (4명)
```
