# Office Map v2 Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 우측 사이드바를 2열 에이전트 카드 그리드로 교체하고, 카드 클릭 시 상세 팝업 모달을 열며, 오피스 맵 방을 시각적으로 방답게 개선한다.

**Architecture:** 삭제됐던 `AgentStatCard`·`AgentDetailModal`을 git history에서 복원하고, 신규 `AgentSidebar`로 우측 패널을 대체한다. `OfficeRoom`에 `roomType` prop을 추가해 방 타입별 비주얼(벽 두께·배경·소품)을 적용한다.

**Tech Stack:** Next.js 15, TypeScript 5, Tailwind CSS 3

**Working directory:** `/home/donghyunlee/projects/SFOOD-LLM-WIKI-WORKFLOW/dashboard`

---

## File Map

| File | Action | 내용 |
|---|---|---|
| `components/AgentStatCard.tsx` | RESTORE + MODIFY | git history 복원, `w-40` → `w-full` |
| `components/AgentDetailModal.tsx` | RESTORE | git history 복원, 수정 없음 |
| `components/AgentSidebar.tsx` | CREATE | 2열 카드 그리드 + 부서 섹션 헤더 |
| `components/OfficeRoom.tsx` | MODIFY | `roomType` prop + 두꺼운 테두리 + 소품 데코 + 네임플레이트 |
| `components/OfficeMap.tsx` | MODIFY | `roomType` 전달 |
| `app/page.tsx` | MODIFY | AgentSidebar 연결, 모달 state, w-96 사이드바 |
| `components/AgentProfilePanel.tsx` | DELETE | AgentSidebar로 대체 |

---

### Task 1: AgentStatCard 복원

**Files:**
- Create: `dashboard/components/AgentStatCard.tsx`

git history에 있는 파일을 복원하되 `w-40` → `w-full` 한 곳만 변경한다.

- [ ] **Step 1: AgentStatCard.tsx 생성**

`dashboard/components/AgentStatCard.tsx`를 아래 내용으로 생성한다:

```typescript
'use client'
import StatusBadge from './StatusBadge'
import type { AgentCharacter, AgentStatus } from '@/types'

interface Props {
  agent: AgentCharacter
  status: AgentStatus
  runCount: number
  onClick: () => void
}

const RING_CLASS: Record<AgentStatus, string> = {
  idle: 'border-gray-700/50',
  running: 'stat-ring-running border-yellow-600/60',
  completed: 'stat-ring-completed border-green-600/60',
  error: 'stat-ring-error border-red-600/60',
}

const STATUS_DOT: Record<AgentStatus, string> = {
  idle: 'bg-gray-600',
  running: 'bg-yellow-400 animate-pulse',
  completed: 'bg-green-400',
  error: 'bg-red-400',
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
    .replace(/-(\d+)-(\d+)$/, ' $1.$2')
    .replace(/-\d{8}$/, '')
}

export default function AgentStatCard({ agent, status, runCount, onClick }: Props) {
  const level = Math.min(10, Math.floor(runCount / 3) + 1)
  const xp = Math.min(20, runCount)
  const xpPercent = (xp / 20) * 100
  const xpColor = XP_COLOR[agent.colorClass] ?? 'bg-gray-500'

  return (
    <div
      data-testid="agent-card"
      onClick={onClick}
      className={`relative bg-gray-900/70 border-2 rounded-2xl p-3 flex flex-col items-center gap-2 w-full transition-all duration-300 hover:bg-gray-800/70 cursor-pointer ${RING_CLASS[status]}`}
    >
      <span
        className={`absolute top-2 right-2 w-2 h-2 rounded-full ${STATUS_DOT[status]}`}
        title={status}
      />

      <span className="text-3xl mt-1 select-none leading-none" role="img" aria-label={agent.role}>
        {agent.emoji}
      </span>

      <div className="text-center w-full">
        <p className="font-bold text-xs text-white truncate">{agent.name}</p>
        <p className="text-[10px] text-gray-500 leading-snug mt-0.5 line-clamp-1">{agent.role}</p>
      </div>

      <div className="w-full">
        <div className="flex justify-between text-[10px] text-gray-600 mb-1">
          <span>XP</span>
          <span>{xp}/20</span>
        </div>
        <div className="h-1 bg-gray-800 rounded-full overflow-hidden">
          <div
            className={`h-full rounded-full transition-all duration-700 ${xpColor}`}
            style={{ width: `${xpPercent}%` }}
          />
        </div>
      </div>

      <div className="flex items-center justify-between w-full text-[10px]">
        <span className="font-mono font-bold text-yellow-500">Lv.{level}</span>
        <span className="text-gray-600 truncate max-w-[60px] text-right">
          {formatModel(agent.model)}
        </span>
      </div>

      <StatusBadge status={status} />
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
cd /home/donghyunlee/projects/SFOOD-LLM-WIKI-WORKFLOW && git add dashboard/components/AgentStatCard.tsx && git commit -m "feat: restore AgentStatCard with w-full for sidebar grid"
```

---

### Task 2: AgentDetailModal 복원

**Files:**
- Create: `dashboard/components/AgentDetailModal.tsx`

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
    .replace(/-(\d+)-(\d+)$/, ' $1.$2')
    .replace(/-\d{8}$/, '')
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

          {agent.tasks && agent.tasks.length > 0 && (
            <div>
              <h3 className="text-xs font-semibold text-gray-300 mb-3 uppercase tracking-widest">
                담당 업무
              </h3>
              <ul className="flex flex-col gap-2">
                {agent.tasks.map((task, i) => (
                  <li key={task} className="flex items-start gap-2 text-sm text-gray-200">
                    <span className="text-gray-500 mt-0.5 shrink-0">•</span>
                    <span>{task}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          <div className="border-t border-gray-800 pt-4">
            <h3 className="text-xs font-semibold text-gray-500 mb-2 uppercase tracking-widest">
              자기소개
            </h3>
            <p className="text-sm text-gray-400 leading-relaxed">{bioText}</p>
          </div>

          {agent.skills && agent.skills.length > 0 && (
            <div className="border-t border-gray-800 pt-4">
              <h3 className="text-xs font-semibold text-gray-500 mb-2 uppercase tracking-widest">
                특기
              </h3>
              <div className="flex flex-wrap gap-1.5">
                {agent.skills.map(skill => (
                  <span
                    key={skill}
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
cd /home/donghyunlee/projects/SFOOD-LLM-WIKI-WORKFLOW && git add dashboard/components/AgentDetailModal.tsx && git commit -m "feat: restore AgentDetailModal 2-panel popup"
```

---

### Task 3: AgentSidebar 생성

**Files:**
- Create: `dashboard/components/AgentSidebar.tsx`

부서별 섹션 헤더 + 2열 AgentStatCard 그리드.

- [ ] **Step 1: AgentSidebar.tsx 생성**

`dashboard/components/AgentSidebar.tsx`를 아래 내용으로 생성한다:

```typescript
'use client'
import AgentStatCard from './AgentStatCard'
import StatusBadge from './StatusBadge'
import type { RoutineWithStatus } from '@/types'

interface Props {
  routines: RoutineWithStatus[]
  onOpenModal: (agentId: string) => void
}

export default function AgentSidebar({ routines, onOpenModal }: Props) {
  return (
    <div className="flex flex-col divide-y divide-gray-800">
      {routines.map(routine => (
        <div key={routine.id}>
          <div className="flex items-center justify-between px-4 py-2.5 bg-gray-900/60">
            <span className="text-xs font-semibold text-gray-400 uppercase tracking-wide">
              {routine.department}
            </span>
            <StatusBadge status={routine.status} />
          </div>
          <div className="grid grid-cols-2 gap-2 p-3">
            {routine.agents.map(agent => (
              <AgentStatCard
                key={agent.id}
                agent={agent}
                status={routine.status}
                runCount={routine.runCount}
                onClick={() => onOpenModal(agent.id)}
              />
            ))}
          </div>
        </div>
      ))}
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
cd /home/donghyunlee/projects/SFOOD-LLM-WIKI-WORKFLOW && git add dashboard/components/AgentSidebar.tsx && git commit -m "feat: create AgentSidebar with 2-col card grid"
```

---

### Task 4: OfficeRoom 비주얼 개선

**Files:**
- Modify: `dashboard/components/OfficeRoom.tsx`

`roomType` prop 추가, 테두리 두껍게, 방별 배경·소품, 네임플레이트 라벨.

- [ ] **Step 1: OfficeRoom.tsx 전체 교체**

`dashboard/components/OfficeRoom.tsx`를 아래 내용으로 교체한다:

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
  roomType: 'office' | 'breakroom'
  agents: AgentInRoom[]
  selectedAgentId: string | null
  onSelectAgent: (id: string) => void
  isActive: boolean
}

const SLOT_POSITIONS = [
  { left: '10%', top: '50%' },
  { left: '28%', top: '50%' },
  { left: '46%', top: '50%' },
  { left: '64%', top: '50%' },
  { left: '82%', top: '50%' },
  { left: '10%', top: '80%' },
  { left: '28%', top: '80%' },
  { left: '46%', top: '80%' },
  { left: '64%', top: '80%' },
  { left: '82%', top: '80%' },
]

export default function OfficeRoom({
  title, icon, roomType, agents, selectedAgentId, onSelectAgent, isActive,
}: Props) {
  const isOffice = roomType === 'office'

  const borderClass = isActive
    ? 'border-2 border-yellow-500/70 room-active'
    : isOffice
      ? 'border-2 border-gray-600'
      : 'border-2 border-amber-900/50'

  const bgClass = isOffice ? 'bg-slate-950' : 'bg-gray-950'

  const decorItems = isOffice
    ? ['🖥️', '💻', '📁']
    : ['☕', '🛋️', '🪴']

  return (
    <div className={`relative rounded-xl min-h-[155px] mb-3 ${borderClass} ${bgClass}`}>
      {/* 네임플레이트 — 상단 테두리를 가로지름 */}
      <div className="absolute -top-3 left-4 bg-[#0d0d1a] px-2 flex items-center gap-1.5">
        <span className="text-sm leading-none">{icon}</span>
        <span className="text-xs text-gray-400 font-semibold tracking-wide">{title}</span>
      </div>

      {/* 방 소품 — 우상단, 반투명 */}
      <div className="absolute top-3 right-3 flex gap-1.5 opacity-15 pointer-events-none select-none">
        {decorItems.map((d, i) => (
          <span key={i} className="text-base leading-none">{d}</span>
        ))}
      </div>

      {/* 에이전트 스프라이트 */}
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

      {agents.length === 0 && (
        <div className="absolute inset-0 flex items-center justify-center pt-4">
          <span className="text-xs text-gray-800">비어 있음</span>
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

Expected: `OfficeMap`에서 `roomType` prop 누락 오류 발생 — Task 5에서 해결. 그 외 오류는 반드시 수정.

- [ ] **Step 3: 커밋**

```bash
cd /home/donghyunlee/projects/SFOOD-LLM-WIKI-WORKFLOW && git add dashboard/components/OfficeRoom.tsx && git commit -m "feat: improve OfficeRoom visuals — roomType, nameplate, decor"
```

---

### Task 5: OfficeMap에 roomType 전달

**Files:**
- Modify: `dashboard/components/OfficeMap.tsx`

각 `OfficeRoom` 호출에 `roomType` prop을 추가한다.

- [ ] **Step 1: OfficeMap.tsx 수정**

현재 파일을 읽은 뒤, 두 곳을 수정한다.

현재 팀 방 렌더링 (`routines.map` 안):
```typescript
        return (
          <OfficeRoom
            key={r.id}
            title={config.title}
            icon={config.icon}
            agents={agents}
            selectedAgentId={selectedAgentId}
            onSelectAgent={onSelectAgent}
            isActive={isActive}
          />
```

→ `roomType="office"` 추가:
```typescript
        return (
          <OfficeRoom
            key={r.id}
            title={config.title}
            icon={config.icon}
            roomType="office"
            agents={agents}
            selectedAgentId={selectedAgentId}
            onSelectAgent={onSelectAgent}
            isActive={isActive}
          />
```

현재 휴게실 렌더링:
```typescript
      <OfficeRoom
        title="휴게실"
        icon="☕"
        agents={breakRoom}
        selectedAgentId={selectedAgentId}
        onSelectAgent={onSelectAgent}
        isActive={false}
      />
```

→ `roomType="breakroom"` 추가:
```typescript
      <OfficeRoom
        title="휴게실"
        icon="☕"
        roomType="breakroom"
        agents={breakRoom}
        selectedAgentId={selectedAgentId}
        onSelectAgent={onSelectAgent}
        isActive={false}
      />
```

- [ ] **Step 2: TypeScript 확인**

```bash
cd /home/donghyunlee/projects/SFOOD-LLM-WIKI-WORKFLOW/dashboard && npx tsc --noEmit 2>&1
```

Expected: 출력 없음 (0 오류)

- [ ] **Step 3: 커밋**

```bash
cd /home/donghyunlee/projects/SFOOD-LLM-WIKI-WORKFLOW && git add dashboard/components/OfficeMap.tsx && git commit -m "feat: pass roomType to OfficeRoom from OfficeMap"
```

---

### Task 6: page.tsx 교체 + AgentProfilePanel 삭제

**Files:**
- Modify: `dashboard/app/page.tsx`
- Delete: `dashboard/components/AgentProfilePanel.tsx`

AgentSidebar(w-96)로 우측 교체, 모달 state 추가, 기존 AgentProfilePanel 삭제.

- [ ] **Step 1: page.tsx 전체 교체**

`dashboard/app/page.tsx`를 아래 내용으로 교체한다:

```typescript
'use client'
import { useEffect, useState, useCallback } from 'react'
import OfficeMap from '@/components/OfficeMap'
import AgentSidebar from '@/components/AgentSidebar'
import AgentDetailModal from '@/components/AgentDetailModal'
import MarkdownModal from '@/components/MarkdownModal'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import type { AgentCharacter, AgentStatus, DashboardData } from '@/types'

const REFRESH_INTERVAL_MS = 5 * 60 * 1000

export default function DashboardPage() {
  const [data, setData] = useState<DashboardData | null>(null)
  const [selectedAgentId, setSelectedAgentId] = useState<string | null>(null)
  const [modalAgentId, setModalAgentId] = useState<string | null>(null)
  const [selectedReport, setSelectedReport] = useState<string | null>(null)
  const [syncing, setSyncing] = useState(false)
  const [syncMsg, setSyncMsg] = useState<string | null>(null)
  const [fetchError, setFetchError] = useState(false)

  const fetchData = useCallback(() => {
    fetch('/api/dashboard')
      .then(r => r.json())
      .then((json: DashboardData) => { setData(json); setFetchError(false) })
      .catch(() => setFetchError(true))
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

  // 모달 에이전트 데이터 조회
  let modalAgent: AgentCharacter | null = null
  let modalStatus: AgentStatus = 'idle'
  let modalRunCount = 0
  if (modalAgentId && data) {
    for (const r of data.routines) {
      const found = r.agents.find(a => a.id === modalAgentId)
      if (found) { modalAgent = found; modalStatus = r.status; modalRunCount = r.runCount; break }
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
          {!data && !fetchError && (
            <p className="text-gray-600 text-sm">데이터 로딩 중...</p>
          )}
          {fetchError && (
            <p className="text-red-500 text-sm">데이터를 불러오지 못했습니다. 잠시 후 다시 시도합니다.</p>
          )}
          {data && (
            <OfficeMap
              routines={data.routines}
              selectedAgentId={selectedAgentId}
              onSelectAgent={id => setSelectedAgentId(prev => prev === id ? null : id)}
            />
          )}
        </div>

        {/* 오른쪽: 에이전트 카드 사이드바 */}
        <aside className="w-96 shrink-0 border-l border-gray-800 overflow-y-auto bg-gray-950/50">
          {data && (
            <AgentSidebar
              routines={data.routines}
              onOpenModal={setModalAgentId}
            />
          )}
        </aside>
      </main>

      <Footer deptCount={deptCount} agentCount={agentCount} />

      <MarkdownModal
        filename={selectedReport}
        onClose={() => setSelectedReport(null)}
      />

      <AgentDetailModal
        agent={modalAgent}
        status={modalStatus}
        runCount={modalRunCount}
        onClose={() => setModalAgentId(null)}
      />
    </div>
  )
}
```

- [ ] **Step 2: AgentProfilePanel 삭제**

```bash
rm /home/donghyunlee/projects/SFOOD-LLM-WIKI-WORKFLOW/dashboard/components/AgentProfilePanel.tsx
```

- [ ] **Step 3: TypeScript 0 오류 확인**

```bash
cd /home/donghyunlee/projects/SFOOD-LLM-WIKI-WORKFLOW/dashboard && npx tsc --noEmit 2>&1
```

Expected: 출력 없음. 오류 있으면 반드시 수정 후 진행.

- [ ] **Step 4: 프로덕션 빌드 확인**

```bash
cd /home/donghyunlee/projects/SFOOD-LLM-WIKI-WORKFLOW/dashboard && npm run build 2>&1 | tail -15
```

Expected: 빌드 성공

- [ ] **Step 5: 개발 서버 확인**

```bash
curl -s --max-time 5 http://localhost:3737/api/dashboard | python3 -c "import json,sys; d=json.load(sys.stdin); print('routines:', len(d['routines']))"
```

Expected: `routines: 2`

서버가 없으면:
```bash
rm -rf /home/donghyunlee/projects/SFOOD-LLM-WIKI-WORKFLOW/dashboard/.next
cd /home/donghyunlee/projects/SFOOD-LLM-WIKI-WORKFLOW/dashboard && npm run dev > /tmp/dashboard-dev.log 2>&1 &
sleep 7 && curl -s --max-time 5 http://localhost:3737/api/dashboard | python3 -c "import json,sys; d=json.load(sys.stdin); print('routines:', len(d['routines']))"
```

- [ ] **Step 6: 커밋**

```bash
cd /home/donghyunlee/projects/SFOOD-LLM-WIKI-WORKFLOW
git add dashboard/app/page.tsx
git rm dashboard/components/AgentProfilePanel.tsx
git commit -m "feat: replace profile panel with AgentSidebar card grid + modal"
```
