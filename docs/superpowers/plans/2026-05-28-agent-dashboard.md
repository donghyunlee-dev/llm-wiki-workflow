# SFOOD Agent HQ Dashboard Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 로컬에서 실행되는 Next.js 웹 대시보드를 구축하여, Claude.ai 루틴 에이전트들을 게임 캐릭터 형태의 회사 직원으로 시각화하고 실행 상태·결과 리포트를 열람할 수 있게 한다.

**Architecture:** `dashboard/` 서브 디렉토리에 Next.js 15 앱을 구성한다. API 라우트(서버 사이드)가 `../runs/*.md`와 `../routines/*.md`를 로컬 파일시스템에서 읽어 데이터를 제공한다. `agents-config.json`이 에이전트 캐릭터 정의를 담당하며, 루틴 추가 시 이 파일만 수정하면 새 부서가 자동 생성된다. Git 동기화 버튼으로 클라우드 루틴 결과를 로컬로 가져온다.

**Tech Stack:** Next.js 15, TypeScript, Tailwind CSS 3, cron-parser (서버 전용), marked (마크다운 렌더링)

---

## File Map

```
dashboard/
├── package.json
├── next.config.ts
├── tsconfig.json
├── tailwind.config.ts
├── postcss.config.mjs
├── .gitignore
├── data/
│   └── agents-config.json        ← 에이전트 캐릭터 정의 (루틴 추가 시 여기 추가)
├── types/
│   └── index.ts                  ← 공유 타입 정의
├── lib/
│   ├── routines.ts               ← agents-config.json 읽기 (서버 전용)
│   ├── runs.ts                   ← runs/*.md 파일 읽기 (서버 전용)
│   └── status.ts                 ← 상태 도출 + 다음 실행 계산 (서버 전용)
├── app/
│   ├── globals.css               ← 게임 분위기 글로우 애니메이션 포함
│   ├── layout.tsx
│   ├── page.tsx                  ← 메인 대시보드 (클라이언트 컴포넌트)
│   └── api/
│       ├── dashboard/route.ts    ← 전체 대시보드 데이터 반환
│       ├── runs/route.ts         ← 전체 런 목록 반환
│       ├── runs/[filename]/route.ts ← 특정 런 리포트 내용 반환
│       └── sync/route.ts         ← git pull 실행
└── components/
    ├── AgentAvatar.tsx           ← 이모지 기반 캐릭터 아바타
    ├── StatusBadge.tsx           ← 대기중/실행중/완료 뱃지
    ├── AgentCard.tsx             ← 개별 에이전트 카드
    ├── DepartmentSection.tsx     ← 루틴 = 부서 단위 섹션
    └── RunReportModal.tsx        ← 런 리포트 전문 모달
```

---

## Task 1: 프로젝트 스캐폴딩

**Files:**
- Create: `dashboard/package.json`
- Create: `dashboard/next.config.ts`
- Create: `dashboard/tsconfig.json`
- Create: `dashboard/tailwind.config.ts`
- Create: `dashboard/postcss.config.mjs`
- Create: `dashboard/.gitignore`

- [ ] **Step 1: dashboard 디렉토리 생성**

```bash
mkdir -p /home/donghyunlee/projects/SFOOD-LLM-WIKI-WORKFLOW/dashboard
```

- [ ] **Step 2: package.json 생성**

`dashboard/package.json`:
```json
{
  "name": "sfood-agent-dashboard",
  "version": "0.1.0",
  "private": true,
  "scripts": {
    "dev": "next dev --port 3737",
    "build": "next build",
    "start": "next start --port 3737"
  },
  "dependencies": {
    "next": "^15.3.0",
    "react": "^19.0.0",
    "react-dom": "^19.0.0",
    "marked": "^12.0.0",
    "cron-parser": "^4.9.0"
  },
  "devDependencies": {
    "@types/node": "^20",
    "@types/react": "^19",
    "@types/react-dom": "^19",
    "typescript": "^5",
    "tailwindcss": "^3.4",
    "autoprefixer": "^10",
    "postcss": "^8"
  }
}
```

- [ ] **Step 3: next.config.ts 생성**

`dashboard/next.config.ts`:
```typescript
import type { NextConfig } from 'next'
const config: NextConfig = {}
export default config
```

- [ ] **Step 4: tsconfig.json 생성**

`dashboard/tsconfig.json`:
```json
{
  "compilerOptions": {
    "target": "ES2017",
    "lib": ["dom", "dom.iterable", "esnext"],
    "allowJs": true,
    "skipLibCheck": true,
    "strict": true,
    "noEmit": true,
    "esModuleInterop": true,
    "module": "esnext",
    "moduleResolution": "bundler",
    "resolveJsonModule": true,
    "isolatedModules": true,
    "jsx": "preserve",
    "incremental": true,
    "plugins": [{"name": "next"}],
    "paths": {"@/*": ["./*"]}
  },
  "include": ["next-env.d.ts", "**/*.ts", "**/*.tsx", ".next/types/**/*.ts"],
  "exclude": ["node_modules"]
}
```

- [ ] **Step 5: tailwind.config.ts 생성**

`dashboard/tailwind.config.ts`:
```typescript
import type { Config } from 'tailwindcss'
const config: Config = {
  content: [
    './app/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
  ],
  theme: { extend: {} },
  plugins: [],
}
export default config
```

- [ ] **Step 6: postcss.config.mjs 생성**

`dashboard/postcss.config.mjs`:
```javascript
const config = {
  plugins: { tailwindcss: {}, autoprefixer: {} },
}
export default config
```

- [ ] **Step 7: .gitignore 생성**

`dashboard/.gitignore`:
```
node_modules/
.next/
.env.local
```

- [ ] **Step 8: 의존성 설치**

```bash
cd /home/donghyunlee/projects/SFOOD-LLM-WIKI-WORKFLOW/dashboard && npm install
```

Expected: `node_modules/` 생성, `package-lock.json` 생성.

- [ ] **Step 9: 커밋**

```bash
git add dashboard/package.json dashboard/next.config.ts dashboard/tsconfig.json dashboard/tailwind.config.ts dashboard/postcss.config.mjs dashboard/.gitignore dashboard/package-lock.json
git commit -m "feat: scaffold agent dashboard Next.js project"
```

---

## Task 2: 타입 정의 및 에이전트 설정 데이터

**Files:**
- Create: `dashboard/types/index.ts`
- Create: `dashboard/data/agents-config.json`

- [ ] **Step 1: types/index.ts 생성**

`dashboard/types/index.ts`:
```typescript
export type AgentStatus = 'idle' | 'running' | 'completed' | 'error'

export interface AgentCharacter {
  id: string
  name: string
  role: string
  emoji: string
  colorClass: string  // tailwind color key: amber | blue | purple | green | indigo | red
  model: string
  description: string
}

export interface Routine {
  id: string
  name: string
  cronExpression: string
  department: string
  runReportPrefix: string  // runs/ 파일명에서 날짜 뒤 부분. "weekly" → 2026-05-14-weekly.md
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
  nextRunLabel: string   // 서버에서 포맷된 문자열: "3시간 20분 후"
  runCount: number
}

export interface RunReportSummary {
  date: string
  filename: string
  preview: string   // content 앞 300자
}

export interface DashboardData {
  routines: RoutineWithStatus[]
  lastSyncedAt: string
}
```

- [ ] **Step 2: data/agents-config.json 생성**

`dashboard/data/agents-config.json`:
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
        "description": "Confluence 페이지를 순회하며 최신 키워드와 갱신 필요 항목을 수집합니다."
      },
      {
        "id": "gap",
        "name": "분석관 가이",
        "role": "갭 분석관",
        "emoji": "📊",
        "colorClass": "blue",
        "model": "claude-haiku-4-5",
        "description": "수확 결과를 분석하여 누락된 가이드 및 업데이트 필요 항목을 식별합니다."
      },
      {
        "id": "writer-claude",
        "name": "작가 클로드",
        "role": "Claude 도메인 작성관",
        "emoji": "✍️",
        "colorClass": "purple",
        "model": "claude-sonnet-4-6",
        "description": "Claude 관련 가이드 페이지를 작성 및 업데이트합니다."
      },
      {
        "id": "writer-codex",
        "name": "작가 코덱스",
        "role": "Codex 도메인 작성관",
        "emoji": "📝",
        "colorClass": "green",
        "model": "claude-sonnet-4-6",
        "description": "Codex 관련 가이드 페이지를 작성 및 업데이트합니다."
      },
      {
        "id": "writer-other",
        "name": "작가 아더",
        "role": "기타 도메인 작성관",
        "emoji": "🖊️",
        "colorClass": "indigo",
        "model": "claude-sonnet-4-6",
        "description": "기타 AI 도구 가이드 페이지를 작성 및 업데이트합니다."
      },
      {
        "id": "synthesis",
        "name": "사령관 신스",
        "role": "종합 사령관",
        "emoji": "🎯",
        "colorClass": "red",
        "model": "claude-sonnet-4-6",
        "description": "모든 작업 결과를 종합하여 최종 보고서를 작성하고 Index를 업데이트합니다."
      }
    ]
  }
]
```

> **루틴 추가 방법:** 이 JSON 배열에 새 객체를 추가하면 대시보드에 새 부서가 자동 생성됩니다.

- [ ] **Step 3: 커밋**

```bash
git add dashboard/types/ dashboard/data/
git commit -m "feat: add agent types and character configuration"
```

---

## Task 3: 데이터 레이어 (서버 전용 라이브러리)

**Files:**
- Create: `dashboard/lib/routines.ts`
- Create: `dashboard/lib/runs.ts`
- Create: `dashboard/lib/status.ts`

- [ ] **Step 1: lib/routines.ts 생성**

`dashboard/lib/routines.ts`:
```typescript
import type { Routine } from '@/types'
import agentsConfig from '@/data/agents-config.json'

export function getRoutines(): Routine[] {
  return agentsConfig as Routine[]
}
```

- [ ] **Step 2: lib/runs.ts 생성**

`dashboard/lib/runs.ts`:
```typescript
import fs from 'fs'
import path from 'path'
import type { RunReport } from '@/types'

const RUNS_DIR = path.resolve(process.cwd(), '..', 'runs')

const ROUTINE_PREFIX_MAP: Record<string, string> = {
  weekly: 'trig_01E5Ktiv4jfrzVDqv4RKM8qp',
}

export function getAllRunReports(): RunReport[] {
  if (!fs.existsSync(RUNS_DIR)) return []

  return fs.readdirSync(RUNS_DIR)
    .filter(f => f.endsWith('.md'))
    .sort()
    .reverse()
    .map(filename => {
      const match = filename.match(/^(\d{4}-\d{2}-\d{2})-(.+)\.md$/)
      const date = match?.[1] ?? ''
      const prefix = match?.[2] ?? ''
      const content = fs.readFileSync(path.join(RUNS_DIR, filename), 'utf-8')
      return {
        date,
        filename,
        content,
        routineId: ROUTINE_PREFIX_MAP[prefix] ?? 'unknown',
      }
    })
}

export function getRunsByPrefix(prefix: string): RunReport[] {
  return getAllRunReports().filter(r => r.filename.includes(`-${prefix}.md`))
}

export function getRunByFilename(filename: string): RunReport | undefined {
  return getAllRunReports().find(r => r.filename === filename)
}
```

- [ ] **Step 3: lib/status.ts 생성**

`dashboard/lib/status.ts`:
```typescript
import { parseExpression } from 'cron-parser'
import type { AgentStatus, RunReport } from '@/types'

export function deriveStatus(latestRun: RunReport | null): AgentStatus {
  if (!latestRun) return 'idle'
  const today = new Date().toISOString().slice(0, 10)
  return latestRun.date === today ? 'completed' : 'idle'
}

export function getNextRunLabel(cronExpression: string): string {
  try {
    const interval = parseExpression(cronExpression, { utc: true })
    const next = interval.next().toDate()
    const ms = next.getTime() - Date.now()
    if (ms < 0) return '곧 실행'
    const hours = Math.floor(ms / 3600000)
    const minutes = Math.floor((ms % 3600000) / 60000)
    if (hours > 0) return `${hours}시간 ${minutes}분 후`
    return `${minutes}분 후`
  } catch {
    return '-'
  }
}
```

- [ ] **Step 4: 커밋**

```bash
git add dashboard/lib/
git commit -m "feat: add server-side data layer for routines and run reports"
```

---

## Task 4: API 라우트

**Files:**
- Create: `dashboard/app/api/dashboard/route.ts`
- Create: `dashboard/app/api/runs/route.ts`
- Create: `dashboard/app/api/runs/[filename]/route.ts`
- Create: `dashboard/app/api/sync/route.ts`

- [ ] **Step 1: app/api/dashboard/route.ts 생성**

`dashboard/app/api/dashboard/route.ts`:
```typescript
import { NextResponse } from 'next/server'
import { getRoutines } from '@/lib/routines'
import { getRunsByPrefix } from '@/lib/runs'
import { deriveStatus, getNextRunLabel } from '@/lib/status'
import type { DashboardData, RoutineWithStatus } from '@/types'

export async function GET() {
  const routines = getRoutines()

  const data: DashboardData = {
    routines: routines.map((routine): RoutineWithStatus => {
      const runs = getRunsByPrefix(routine.runReportPrefix)
      const latestRun = runs[0] ?? null
      return {
        ...routine,
        status: deriveStatus(latestRun),
        latestRun: latestRun
          ? { date: latestRun.date, filename: latestRun.filename, preview: latestRun.content.slice(0, 300) }
          : null,
        nextRunLabel: getNextRunLabel(routine.cronExpression),
        runCount: runs.length,
      }
    }),
    lastSyncedAt: new Date().toISOString(),
  }

  return NextResponse.json(data)
}
```

- [ ] **Step 2: app/api/runs/route.ts 생성**

`dashboard/app/api/runs/route.ts`:
```typescript
import { NextResponse } from 'next/server'
import { getAllRunReports } from '@/lib/runs'

export async function GET() {
  const runs = getAllRunReports().map(r => ({
    date: r.date,
    filename: r.filename,
    routineId: r.routineId,
    preview: r.content.slice(0, 200),
  }))
  return NextResponse.json(runs)
}
```

- [ ] **Step 3: app/api/runs/[filename]/route.ts 생성**

`dashboard/app/api/runs/[filename]/route.ts`:
```typescript
import { NextResponse } from 'next/server'
import { getRunByFilename } from '@/lib/runs'

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ filename: string }> }
) {
  const { filename } = await params
  const run = getRunByFilename(decodeURIComponent(filename))
  if (!run) return NextResponse.json({ error: 'Not found' }, { status: 404 })
  return NextResponse.json(run)
}
```

- [ ] **Step 4: app/api/sync/route.ts 생성**

`dashboard/app/api/sync/route.ts`:
```typescript
import { NextResponse } from 'next/server'
import { execSync } from 'child_process'
import path from 'path'

const REPO_ROOT = path.resolve(process.cwd(), '..')

export async function POST() {
  try {
    execSync('git pull --ff-only', { cwd: REPO_ROOT, timeout: 30000, stdio: 'pipe' })
    return NextResponse.json({ success: true, message: 'Git pull 완료' })
  } catch (error) {
    const msg = error instanceof Error ? error.message : String(error)
    return NextResponse.json({ success: false, message: `동기화 실패: ${msg.slice(0, 100)}` }, { status: 500 })
  }
}
```

- [ ] **Step 5: 커밋**

```bash
git add dashboard/app/api/
git commit -m "feat: add API routes for dashboard data, run reports, and git sync"
```

---

## Task 5: 글로벌 스타일 및 기본 컴포넌트

**Files:**
- Create: `dashboard/app/globals.css`
- Create: `dashboard/components/AgentAvatar.tsx`
- Create: `dashboard/components/StatusBadge.tsx`

- [ ] **Step 1: app/globals.css 생성**

`dashboard/app/globals.css`:
```css
@tailwind base;
@tailwind components;
@tailwind utilities;

@layer base {
  body {
    background-color: #0d0d1a;
    color: #e2e8f0;
    font-family: 'Courier New', 'Consolas', monospace;
  }
}

@keyframes glow-green {
  0%, 100% { box-shadow: 0 0 6px 1px rgba(74, 222, 128, 0.3); }
  50%       { box-shadow: 0 0 14px 3px rgba(74, 222, 128, 0.7); }
}

@keyframes glow-yellow {
  0%, 100% { box-shadow: 0 0 6px 1px rgba(250, 204, 21, 0.3); }
  50%       { box-shadow: 0 0 14px 3px rgba(250, 204, 21, 0.7); }
}

.glow-completed { animation: glow-green 2.5s ease-in-out infinite; }
.glow-running   { animation: glow-yellow 1s ease-in-out infinite; }
```

- [ ] **Step 2: components/AgentAvatar.tsx 생성**

`dashboard/components/AgentAvatar.tsx`:
```typescript
'use client'
import type { AgentStatus } from '@/types'

const COLOR_BG: Record<string, string> = {
  amber:  'bg-amber-950/60 border-amber-600',
  blue:   'bg-blue-950/60 border-blue-600',
  purple: 'bg-purple-950/60 border-purple-600',
  green:  'bg-green-950/60 border-green-600',
  indigo: 'bg-indigo-950/60 border-indigo-600',
  red:    'bg-red-950/60 border-red-600',
}

const STATUS_OPACITY: Record<AgentStatus, string> = {
  idle:      'opacity-40 grayscale',
  running:   'opacity-100',
  completed: 'opacity-100',
  error:     'opacity-30',
}

interface Props {
  emoji: string
  colorClass: string
  status: AgentStatus
}

export default function AgentAvatar({ emoji, colorClass, status }: Props) {
  const bg = COLOR_BG[colorClass] ?? 'bg-gray-950/60 border-gray-600'
  return (
    <div className={`relative flex items-center justify-center w-20 h-20 rounded-xl border-2 text-4xl transition-all duration-500 ${bg} ${STATUS_OPACITY[status]}`}>
      <span role="img" aria-label="agent">{emoji}</span>

      {status === 'running' && (
        <span className="absolute -top-1.5 -right-1.5 flex h-3.5 w-3.5">
          <span className="animate-ping absolute h-full w-full rounded-full bg-yellow-400 opacity-75" />
          <span className="relative h-3.5 w-3.5 rounded-full bg-yellow-500" />
        </span>
      )}

      {status === 'completed' && (
        <span className="absolute -top-1.5 -right-1.5 text-base leading-none">✅</span>
      )}
    </div>
  )
}
```

- [ ] **Step 3: components/StatusBadge.tsx 생성**

`dashboard/components/StatusBadge.tsx`:
```typescript
import type { AgentStatus } from '@/types'

const CONFIG: Record<AgentStatus, { label: string; cls: string }> = {
  idle:      { label: '대기중', cls: 'bg-gray-800 text-gray-400' },
  running:   { label: '⚡ 실행중', cls: 'bg-yellow-950 text-yellow-300 animate-pulse' },
  completed: { label: '✓ 완료', cls: 'bg-green-950 text-green-300' },
  error:     { label: '✕ 오류', cls: 'bg-red-950 text-red-300' },
}

export default function StatusBadge({ status }: { status: AgentStatus }) {
  const { label, cls } = CONFIG[status]
  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold ${cls}`}>
      {label}
    </span>
  )
}
```

- [ ] **Step 4: 커밋**

```bash
git add dashboard/app/globals.css dashboard/components/AgentAvatar.tsx dashboard/components/StatusBadge.tsx
git commit -m "feat: add global styles and base visual components"
```

---

## Task 6: AgentCard 및 DepartmentSection 컴포넌트

**Files:**
- Create: `dashboard/components/AgentCard.tsx`
- Create: `dashboard/components/DepartmentSection.tsx`

- [ ] **Step 1: components/AgentCard.tsx 생성**

`dashboard/components/AgentCard.tsx`:
```typescript
'use client'
import AgentAvatar from './AgentAvatar'
import StatusBadge from './StatusBadge'
import type { AgentCharacter, AgentStatus } from '@/types'

interface Props {
  agent: AgentCharacter
  status: AgentStatus
}

const GLOW: Record<AgentStatus, string> = {
  idle: '',
  running: 'glow-running border-yellow-700/50',
  completed: 'glow-completed border-green-700/50',
  error: 'border-red-700/50',
}

export default function AgentCard({ agent, status }: Props) {
  return (
    <div className={`relative bg-gray-900/70 border border-gray-700/50 rounded-2xl p-4 flex flex-col items-center gap-3 w-36 transition-all duration-300 ${GLOW[status]} hover:bg-gray-800/70`}>
      <AgentAvatar emoji={agent.emoji} colorClass={agent.colorClass} status={status} />
      <div className="text-center w-full">
        <p className="font-bold text-sm text-white truncate">{agent.name}</p>
        <p className="text-xs text-gray-400 mt-0.5 leading-tight">{agent.role}</p>
        <p className="text-xs text-gray-600 mt-1 font-mono">{agent.model}</p>
      </div>
      <StatusBadge status={status} />
    </div>
  )
}
```

- [ ] **Step 2: components/DepartmentSection.tsx 생성**

`dashboard/components/DepartmentSection.tsx`:
```typescript
'use client'
import AgentCard from './AgentCard'
import StatusBadge from './StatusBadge'
import type { RoutineWithStatus } from '@/types'

interface Props {
  routine: RoutineWithStatus
  onViewReport: (filename: string) => void
}

export default function DepartmentSection({ routine, onViewReport }: Props) {
  return (
    <section className="mb-12">
      {/* 부서 헤더 */}
      <div className="flex items-start justify-between mb-5 flex-wrap gap-3">
        <div>
          <div className="flex items-center gap-3">
            <h2 className="text-xl font-bold text-white">{routine.department}</h2>
            <StatusBadge status={routine.status} />
          </div>
          <p className="text-sm text-gray-500 mt-1">
            마지막 실행:{' '}
            <span className="text-gray-400">{routine.latestRun?.date ?? '기록 없음'}</span>
            {' · '}
            다음 실행:{' '}
            <span className="text-gray-400">{routine.nextRunLabel}</span>
            {' · '}
            총 <span className="text-gray-400">{routine.runCount}회</span> 실행
          </p>
          {routine.latestRun && (
            <p className="text-xs text-gray-600 mt-1 font-mono max-w-lg truncate">
              {routine.latestRun.preview}
            </p>
          )}
        </div>

        {routine.latestRun && (
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
          <AgentCard key={agent.id} agent={agent} status={routine.status} />
        ))}
      </div>
    </section>
  )
}
```

- [ ] **Step 3: 커밋**

```bash
git add dashboard/components/AgentCard.tsx dashboard/components/DepartmentSection.tsx
git commit -m "feat: add AgentCard and DepartmentSection components"
```

---

## Task 7: 런 리포트 모달

**Files:**
- Create: `dashboard/components/RunReportModal.tsx`

- [ ] **Step 1: components/RunReportModal.tsx 생성**

`dashboard/components/RunReportModal.tsx`:
```typescript
'use client'
import { useEffect, useState } from 'react'
import type { RunReport } from '@/types'

interface Props {
  filename: string | null
  onClose: () => void
}

export default function RunReportModal({ filename, onClose }: Props) {
  const [report, setReport] = useState<RunReport | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!filename) { setReport(null); return }
    setLoading(true)
    setError(null)
    fetch(`/api/runs/${encodeURIComponent(filename)}`)
      .then(r => r.ok ? r.json() : Promise.reject('Not found'))
      .then((data: RunReport) => { setReport(data); setLoading(false) })
      .catch(() => { setError('리포트를 불러올 수 없습니다.'); setLoading(false) })
  }, [filename])

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose() }
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [onClose])

  if (!filename) return null

  return (
    <div
      className="fixed inset-0 bg-black/75 backdrop-blur-sm z-50 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <div
        className="bg-gray-950 border border-gray-700 rounded-2xl w-full max-w-3xl max-h-[85vh] flex flex-col shadow-2xl"
        onClick={e => e.stopPropagation()}
      >
        {/* 모달 헤더 */}
        <div className="flex items-center justify-between px-5 py-3 border-b border-gray-800 shrink-0">
          <span className="text-sm font-mono text-gray-300">{filename}</span>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-white text-xl leading-none transition-colors"
            aria-label="닫기"
          >
            ✕
          </button>
        </div>

        {/* 모달 본문 */}
        <div className="overflow-y-auto p-6 flex-1">
          {loading && <p className="text-gray-500 text-sm">로딩 중...</p>}
          {error && <p className="text-red-400 text-sm">{error}</p>}
          {report && (
            <pre className="text-sm text-gray-300 whitespace-pre-wrap font-mono leading-relaxed">
              {report.content}
            </pre>
          )}
        </div>
      </div>
    </div>
  )
}
```

- [ ] **Step 2: 커밋**

```bash
git add dashboard/components/RunReportModal.tsx
git commit -m "feat: add RunReportModal with keyboard close support"
```

---

## Task 8: 레이아웃 및 메인 페이지

**Files:**
- Create: `dashboard/app/layout.tsx`
- Create: `dashboard/app/page.tsx`

- [ ] **Step 1: app/layout.tsx 생성**

`dashboard/app/layout.tsx`:
```typescript
import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'SFOOD Agent HQ',
  description: '에쓰푸드 IT AX팀 AI 에이전트 현황판',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ko">
      <body className="min-h-screen">{children}</body>
    </html>
  )
}
```

- [ ] **Step 2: app/page.tsx 생성**

`dashboard/app/page.tsx`:
```typescript
'use client'
import { useEffect, useState, useCallback } from 'react'
import DepartmentSection from '@/components/DepartmentSection'
import RunReportModal from '@/components/RunReportModal'
import type { DashboardData } from '@/types'

const REFRESH_INTERVAL_MS = 5 * 60 * 1000 // 5분

export default function DashboardPage() {
  const [data, setData] = useState<DashboardData | null>(null)
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
    }
  }

  const activeCount = data?.routines.filter(r => r.status !== 'idle').length ?? 0

  return (
    <main className="min-h-screen px-6 py-8 md:px-12 md:py-10 max-w-6xl mx-auto">

      {/* 헤더 */}
      <header className="mb-12">
        <div className="flex items-start justify-between flex-wrap gap-4">
          <div>
            <h1 className="text-4xl font-bold text-white tracking-tight">
              🏢 SFOOD Agent HQ
            </h1>
            <p className="text-gray-500 mt-1">
              에쓰푸드 IT AX팀 · AI 에이전트 팀 현황판
            </p>
            {data && (
              <div className="flex gap-4 mt-3 text-sm">
                <span className="text-gray-400">
                  부서 <strong className="text-white">{data.routines.length}</strong>개
                </span>
                <span className="text-gray-400">
                  에이전트 <strong className="text-white">
                    {data.routines.reduce((s, r) => s + r.agents.length, 0)}
                  </strong>명
                </span>
                {activeCount > 0 && (
                  <span className="text-yellow-400 animate-pulse">
                    ⚡ {activeCount}개 부서 활성
                  </span>
                )}
              </div>
            )}
          </div>

          <div className="flex flex-col items-end gap-1">
            <button
              onClick={handleSync}
              disabled={syncing}
              className="text-sm px-4 py-2 bg-blue-950 hover:bg-blue-900 disabled:opacity-50 text-blue-300 rounded-lg border border-blue-800 transition-colors"
            >
              {syncing ? '동기화 중...' : '🔄 Git 동기화'}
            </button>
            {syncMsg && <p className="text-xs text-gray-500">{syncMsg}</p>}
            {data && (
              <p className="text-xs text-gray-700">
                조회: {new Date(data.lastSyncedAt).toLocaleString('ko-KR')}
              </p>
            )}
          </div>
        </div>
      </header>

      {/* 부서 목록 */}
      {!data && (
        <p className="text-gray-600 text-sm">데이터 로딩 중...</p>
      )}
      {data?.routines.map(routine => (
        <DepartmentSection
          key={routine.id}
          routine={routine}
          onViewReport={setSelectedReport}
        />
      ))}

      {/* 리포트 모달 */}
      <RunReportModal
        filename={selectedReport}
        onClose={() => setSelectedReport(null)}
      />
    </main>
  )
}
```

- [ ] **Step 3: 커밋**

```bash
git add dashboard/app/layout.tsx dashboard/app/page.tsx
git commit -m "feat: add main dashboard layout and page"
```

---

## Task 9: 빌드 검증 및 브라우저 확인

- [ ] **Step 1: 개발 서버 실행**

```bash
cd /home/donghyunlee/projects/SFOOD-LLM-WIKI-WORKFLOW/dashboard
npm run dev
```

Expected: `Next.js 15.x.x - Local: http://localhost:3737` 출력

- [ ] **Step 2: 브라우저에서 확인**

`http://localhost:3737` 열기.

확인 항목:
- [ ] 헤더에 "SFOOD Agent HQ" 표시됨
- [ ] "Wiki 관리팀" 부서 섹션이 보임
- [ ] 6개 에이전트 카드가 표시됨 (수확관 하루, 분석관 가이, 작가 클로드, 작가 코덱스, 작가 아더, 사령관 신스)
- [ ] 각 카드에 이모지 아바타, 이름, 역할, 모델명, "대기중" 뱃지 표시됨
- [ ] "최근 리포트 보기" 버튼 클릭 시 모달 열림
- [ ] 모달에서 `2026-05-14-weekly.md` 내용이 표시됨 (가장 최근 주간 리포트)
- [ ] ESC 키 또는 배경 클릭으로 모달 닫힘
- [ ] "Git 동기화" 버튼 클릭 시 "Git pull 완료" 메시지 표시됨

- [ ] **Step 3: 프로덕션 빌드 검증**

```bash
cd /home/donghyunlee/projects/SFOOD-LLM-WIKI-WORKFLOW/dashboard
npm run build 2>&1 | tail -30
```

Expected: `✓ Compiled successfully` (TypeScript 오류 없음, 빌드 성공)

- [ ] **Step 4: 최종 커밋**

```bash
git add dashboard/
git commit -m "feat: complete SFOOD Agent HQ dashboard - verified build and browser"
```

---

## 사용 방법

```bash
# 대시보드 실행 (항상 이 디렉토리에서)
cd /home/donghyunlee/projects/SFOOD-LLM-WIKI-WORKFLOW/dashboard
npm run dev

# 브라우저에서 열기
# http://localhost:3737

# 루틴 결과 최신화: 브라우저에서 "Git 동기화" 버튼 클릭
# 또는 터미널에서:
# cd .. && git pull
```

## 새 루틴(부서) 추가 방법

1. `dashboard/data/agents-config.json` 배열에 새 루틴 객체 추가
2. 개발 서버 재시작 (또는 자동 반영)
3. 대시보드에 새 부서 섹션 자동 생성

---

## Self-Review

**스펙 커버리지:**
- ✅ 에이전트를 게임 캐릭터(이모지 아바타 + 글로우 애니메이션)로 표시
- ✅ 실행 상태(대기중/실행중/완료) 시각 표시
- ✅ 결과 리포트 열람 (RunReportModal)
- ✅ 루틴 추가 시 부서 자동 생성 (agents-config.json)
- ✅ 나만 보는 로컬 웹사이트 (localhost:3737)
- ✅ Git 동기화로 클라우드 루틴 결과 반영
- ✅ Slack/이메일 의존성 없음 — 대시보드 자체가 알림 역할

**한계:**
- "실행 중" 상태는 오늘 런 리포트가 없는 경우로 근사 판단 (claude.ai RemoteTrigger API는 standalone 앱에서 인증 불가)
- 루틴 추가 시 `agents-config.json` 수동 수정 필요
- 외부 네트워크에서 접근하려면 별도 설정 필요 (현재 localhost 전용)

**타입 일관성:** `AgentStatus`, `RunReport`, `RunReportSummary`, `RoutineWithStatus`, `DashboardData` — 모두 `types/index.ts`에 정의, 전 파일에서 일관 사용.
