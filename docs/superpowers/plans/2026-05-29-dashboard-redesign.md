# Dashboard v1.1 Redesign Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** SFOOD Agent HQ 대시보드를 RPG 스탯 카드 UI, 2개 부서, Markdown 렌더링, Git sync 수정, Playwright QA로 완전 재설계한다.

**Architecture:** Next.js 15 App Router (port 3737), TypeScript strict. 기존 컴포넌트(AgentCard, DepartmentSection, RunReportModal)를 새 컴포넌트(AgentStatCard, DepartmentFloor, MarkdownModal)로 교체하고 Header/Footer를 추가한다. 2번째 루틴(AI 검색 품질팀)은 로컬 런 파일이 없으므로 `lastFiredAt` 필드로 상태를 파생한다.

**Tech Stack:** Next.js 15.3, React 19, TypeScript 5, Tailwind CSS 3, @tailwindcss/typography, marked 12, cron-parser 4.9, @playwright/test

**Working directory:** `/home/donghyunlee/projects/SFOOD-LLM-WIKI-WORKFLOW/dashboard`

---

## File Map

| File | Action | Responsibility |
|---|---|---|
| `app/api/sync/route.ts` | MODIFY | git fetch + merge (not pull --ff-only) |
| `data/agents-config.json` | MODIFY | 2번째 루틴 추가 (AI 검색 품질팀, 4명) |
| `types/index.ts` | MODIFY | Routine에 `lastFiredAt?`, RoutineWithStatus에 `hasLocalReport` 추가 |
| `lib/runs.ts` | MODIFY | ROUTINE_PREFIX_MAP에 playbook 추가 |
| `app/api/dashboard/route.ts` | MODIFY | lastFiredAt 처리 로직 추가 |
| `tailwind.config.ts` | MODIFY | @tailwindcss/typography 플러그인 추가 |
| `app/globals.css` | MODIFY | RPG stat ring CSS 클래스 추가 |
| `components/MarkdownModal.tsx` | CREATE | marked 렌더링 모달 (RunReportModal 대체) |
| `components/Header.tsx` | CREATE | 회사 헤더 + 동기화 버튼 |
| `components/Footer.tsx` | CREATE | 부서/에이전트 수 + 버전 표시 |
| `components/AgentStatCard.tsx` | CREATE | RPG 스탯 카드 (status ring + XP bar + level) |
| `components/DepartmentFloor.tsx` | CREATE | 부서 섹션 + 에이전트 그리드 (DepartmentSection 대체) |
| `app/layout.tsx` | MODIFY | 기존 유지 (page.tsx에서 Header/Footer 직접 렌더링) |
| `app/page.tsx` | MODIFY | DepartmentFloor + MarkdownModal + Header + Footer 통합 |
| `tests/playwright.config.ts` | CREATE | Playwright 설정 |
| `tests/dashboard.spec.ts` | CREATE | 스크린샷 기반 E2E 테스트 |

---

### Task 1: Fix Git Sync Route

**Files:**
- Modify: `dashboard/app/api/sync/route.ts`

현재 `git pull --ff-only`는 로컬(대시보드 커밋)과 리모트(루틴 커밋)가 diverge할 때 오류 발생. `git fetch origin`과 `git merge origin/main`으로 분리한다.

- [ ] **Step 1: 파일 수정**

`dashboard/app/api/sync/route.ts`를 아래 내용으로 교체한다:

```typescript
import { NextResponse } from 'next/server'
import { execSync } from 'child_process'
import path from 'path'

const REPO_ROOT = path.resolve(process.cwd(), '..')

export async function POST() {
  try {
    execSync('git fetch origin', { cwd: REPO_ROOT, timeout: 30000, stdio: 'pipe' })
    execSync('git merge origin/main', { cwd: REPO_ROOT, timeout: 30000, stdio: 'pipe' })
    return NextResponse.json({ success: true, message: 'Git 동기화 완료' })
  } catch (error) {
    const msg = error instanceof Error ? error.message : String(error)
    return NextResponse.json(
      { success: false, message: `동기화 실패: ${msg.slice(0, 120)}` },
      { status: 500 }
    )
  }
}
```

- [ ] **Step 2: 서버 실행 후 검증**

```bash
# 터미널 1: 서버 시작 (이미 실행 중이면 skip)
cd /home/donghyunlee/projects/SFOOD-LLM-WIKI-WORKFLOW/dashboard
npm run dev &

# 터미널 2: API 호출 테스트
curl -s -X POST http://localhost:3737/api/sync | python3 -m json.tool
```

Expected: `{"success": true, "message": "Git 동기화 완료"}` 또는 이미 최신이면 동일한 형식으로 성공 응답 (non-500).

- [ ] **Step 3: 커밋**

```bash
git add dashboard/app/api/sync/route.ts
git commit -m "fix: git sync — fetch+merge instead of pull --ff-only"
```

---

### Task 2: Update agents-config.json (2nd Routine)

**Files:**
- Modify: `dashboard/data/agents-config.json`

AI 검색 품질팀 루틴을 추가. 이 루틴의 `runReportPrefix: "playbook"`은 로컬 `runs/` 폴더에 일치 파일 없음 → runCount=0, latestRun=null. `lastFiredAt` 필드로 마지막 실행 날짜 표시.

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
        "description": "Playbook 데이터 및 사용자 쿼리 패턴을 수집합니다."
      },
      {
        "id": "pattern-analyst",
        "name": "패턴분석관 파이",
        "role": "패턴 분석관",
        "emoji": "🔬",
        "colorClass": "teal",
        "model": "claude-sonnet-4-6",
        "description": "수집된 데이터에서 검색 품질 개선 패턴을 분석합니다."
      },
      {
        "id": "rule-generator",
        "name": "규칙생성관 루이",
        "role": "규칙 생성관",
        "emoji": "⚙️",
        "colorClass": "orange",
        "model": "claude-sonnet-4-6",
        "description": "분석 결과를 기반으로 AI 프롬프트 개선 규칙을 생성합니다."
      },
      {
        "id": "editor",
        "name": "편집관 에디",
        "role": "프롬프트 편집관",
        "emoji": "✏️",
        "colorClass": "pink",
        "model": "claude-sonnet-4-6",
        "description": "생성된 규칙을 적용하여 AI 프롬프트를 최종 편집합니다."
      }
    ]
  }
]
```

- [ ] **Step 2: 커밋**

```bash
git add dashboard/data/agents-config.json
git commit -m "feat: add AI 검색 품질팀 routine to agents-config"
```

---

### Task 3: Update Types + Lib + Dashboard API

**Files:**
- Modify: `dashboard/types/index.ts`
- Modify: `dashboard/lib/runs.ts`
- Modify: `dashboard/app/api/dashboard/route.ts`

`Routine`에 `lastFiredAt?: string` 추가. `RoutineWithStatus`에 `hasLocalReport: boolean` 추가 (리포트 버튼 표시 여부 제어). 대시보드 API에서 로컬 런 파일이 없는 루틴에 대해 `lastFiredAt`으로 fallback.

- [ ] **Step 1: types/index.ts 수정**

`dashboard/types/index.ts`를 아래 내용으로 교체한다:

```typescript
export type AgentStatus = 'idle' | 'running' | 'completed' | 'error'

export interface AgentCharacter {
  id: string
  name: string
  role: string
  emoji: string
  colorClass: string  // tailwind color key: amber | blue | purple | green | indigo | red | cyan | teal | orange | pink
  model: string
  description: string
}

export interface Routine {
  id: string
  name: string
  cronExpression: string
  department: string
  runReportPrefix: string
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
  nextRunLabel: string   // 서버에서 포맷된 문자열: "3시간 20분 후"
  runCount: number
  hasLocalReport: boolean  // 로컬 런 파일 존재 여부 (리포트 버튼 표시용)
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

- [ ] **Step 2: lib/runs.ts 수정**

`dashboard/lib/runs.ts`의 `ROUTINE_PREFIX_MAP`에 `playbook` 항목을 추가한다. 기존 파일에서 `ROUTINE_PREFIX_MAP` 객체만 변경:

```typescript
import fs from 'fs'
import path from 'path'
import type { RunReport } from '@/types'

const RUNS_DIR = path.resolve(process.cwd(), '..', 'runs')

const ROUTINE_PREFIX_MAP: Record<string, string> = {
  weekly: 'trig_01E5Ktiv4jfrzVDqv4RKM8qp',
  'wiki-weekly': 'trig_01E5Ktiv4jfrzVDqv4RKM8qp',
  playbook: 'trig_018dn6jkaABXrxrkHpKhcriL',
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

- [ ] **Step 3: app/api/dashboard/route.ts 수정**

`dashboard/app/api/dashboard/route.ts`를 아래 내용으로 교체한다:

```typescript
import { NextResponse } from 'next/server'
import { getRoutines } from '@/lib/routines'
import { getRunsByPrefix } from '@/lib/runs'
import { deriveStatus, getNextRunLabel } from '@/lib/status'
import type { AgentStatus, DashboardData, RoutineWithStatus, RunReportSummary } from '@/types'

export async function GET() {
  const routines = getRoutines()
  const today = new Date().toISOString().slice(0, 10)

  const data: DashboardData = {
    routines: routines.map((routine): RoutineWithStatus => {
      const runs = getRunsByPrefix(routine.runReportPrefix)
      const localRun = runs[0] ?? null
      const hasLocalReport = localRun !== null

      let latestRun: RunReportSummary | null = null
      let status: AgentStatus = 'idle'

      if (localRun) {
        latestRun = {
          date: localRun.date,
          filename: localRun.filename,
          preview: localRun.content.slice(0, 300),
        }
        status = deriveStatus(localRun)
      } else if (routine.lastFiredAt) {
        const lastFiredDate = routine.lastFiredAt.slice(0, 10)
        latestRun = {
          date: lastFiredDate,
          filename: '',
          preview: '외부 루틴 — 로컬 리포트 없음',
        }
        status = lastFiredDate === today ? 'completed' : 'idle'
      }

      return {
        ...routine,
        status,
        latestRun,
        nextRunLabel: getNextRunLabel(routine.cronExpression),
        runCount: runs.length,
        hasLocalReport,
      }
    }),
    lastSyncedAt: new Date().toISOString(),
  }

  return NextResponse.json(data)
}
```

- [ ] **Step 4: TypeScript 빌드 확인**

```bash
cd /home/donghyunlee/projects/SFOOD-LLM-WIKI-WORKFLOW/dashboard
npx tsc --noEmit
```

Expected: 오류 0개

- [ ] **Step 5: API 응답 확인**

```bash
curl -s http://localhost:3737/api/dashboard | python3 -c "
import json,sys
d=json.load(sys.stdin)
for r in d['routines']:
    print(r['department'], '| hasLocalReport:', r['hasLocalReport'], '| runCount:', r['runCount'], '| latestRun:', r['latestRun']['date'] if r['latestRun'] else None)
"
```

Expected:
```
Wiki 관리팀 | hasLocalReport: True | runCount: N | latestRun: YYYY-MM-DD
AI 검색 품질팀 | hasLocalReport: False | runCount: 0 | latestRun: 2026-05-28
```

- [ ] **Step 6: 커밋**

```bash
git add dashboard/types/index.ts dashboard/lib/runs.ts dashboard/app/api/dashboard/route.ts
git commit -m "feat: add lastFiredAt + hasLocalReport support for external routines"
```

---

### Task 4: Install @tailwindcss/typography + Update Tailwind Config

**Files:**
- Modify: `dashboard/package.json` (npm install로 자동)
- Modify: `dashboard/tailwind.config.ts`

- [ ] **Step 1: 패키지 설치**

```bash
cd /home/donghyunlee/projects/SFOOD-LLM-WIKI-WORKFLOW/dashboard
npm install @tailwindcss/typography
```

Expected: `@tailwindcss/typography` 항목이 package.json `dependencies`에 추가됨.

- [ ] **Step 2: tailwind.config.ts 수정**

`dashboard/tailwind.config.ts`를 아래 내용으로 교체한다:

```typescript
import type { Config } from 'tailwindcss'
import typography from '@tailwindcss/typography'

const config: Config = {
  content: [
    './app/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
  ],
  theme: { extend: {} },
  plugins: [typography],
}
export default config
```

- [ ] **Step 3: 빌드 확인**

```bash
cd /home/donghyunlee/projects/SFOOD-LLM-WIKI-WORKFLOW/dashboard
npx tsc --noEmit
```

Expected: 오류 0개

- [ ] **Step 4: 커밋**

```bash
git add dashboard/package.json dashboard/package-lock.json dashboard/tailwind.config.ts
git commit -m "feat: install @tailwindcss/typography for markdown rendering"
```

---

### Task 5: Update globals.css (RPG Stat Ring Styles)

**Files:**
- Modify: `dashboard/app/globals.css`

기존 glow 애니메이션 유지 + RPG 스탯 카드용 status ring CSS 클래스 추가.

- [ ] **Step 1: globals.css 수정**

`dashboard/app/globals.css`를 아래 내용으로 교체한다:

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

/* 기존 DepartmentSection용 (하위 호환) */
.glow-completed { animation: glow-green 2.5s ease-in-out infinite; }
.glow-running   { animation: glow-yellow 1s ease-in-out infinite; }

/* RPG 스탯 카드 status ring */
.stat-ring-idle      { box-shadow: none; }
.stat-ring-running   { animation: glow-yellow 1s ease-in-out infinite; }
.stat-ring-completed { animation: glow-green 2.5s ease-in-out infinite; }
.stat-ring-error     { box-shadow: 0 0 8px 2px rgba(239, 68, 68, 0.4); }
```

- [ ] **Step 2: 커밋**

```bash
git add dashboard/app/globals.css
git commit -m "feat: add RPG stat ring CSS classes"
```

---

### Task 6: Create MarkdownModal Component

**Files:**
- Create: `dashboard/components/MarkdownModal.tsx`

`RunReportModal`을 대체. `marked` 라이브러리로 MD → HTML 변환. `@tailwindcss/typography`의 `prose` 클래스로 Notion 스타일 렌더링.

- [ ] **Step 1: MarkdownModal.tsx 생성**

`dashboard/components/MarkdownModal.tsx`를 아래 내용으로 생성한다:

```typescript
'use client'
import { useEffect, useState } from 'react'
import { marked } from 'marked'
import type { RunReport } from '@/types'

interface Props {
  filename: string | null
  onClose: () => void
}

export default function MarkdownModal({ filename, onClose }: Props) {
  const [html, setHtml] = useState<string>('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!filename) { setHtml(''); return }
    setLoading(true)
    setError(null)
    fetch(`/api/runs/${encodeURIComponent(filename)}`)
      .then(r => r.ok ? r.json() : Promise.reject('Not found'))
      .then((data: RunReport) => {
        setHtml(marked.parse(data.content) as string)
        setLoading(false)
      })
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
        className="bg-gray-950 border border-gray-700 rounded-2xl w-full max-w-4xl max-h-[88vh] flex flex-col shadow-2xl"
        onClick={e => e.stopPropagation()}
      >
        {/* 모달 헤더 */}
        <div className="flex items-center justify-between px-5 py-3 border-b border-gray-800 shrink-0">
          <span className="text-sm font-mono text-gray-300 truncate max-w-lg">{filename}</span>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-white text-xl leading-none transition-colors ml-4 shrink-0"
            aria-label="닫기"
          >
            ✕
          </button>
        </div>

        {/* 모달 본문 */}
        <div className="overflow-y-auto p-8 flex-1">
          {loading && <p className="text-gray-500 text-sm">로딩 중...</p>}
          {error && <p className="text-red-400 text-sm">{error}</p>}
          {html && (
            <article
              className="prose prose-invert prose-sm max-w-none
                prose-headings:text-white prose-headings:font-bold
                prose-p:text-gray-300 prose-p:leading-relaxed
                prose-code:text-green-400 prose-code:bg-gray-800/60 prose-code:rounded prose-code:px-1
                prose-pre:bg-gray-900 prose-pre:border prose-pre:border-gray-700 prose-pre:rounded-xl
                prose-a:text-blue-400 prose-a:no-underline hover:prose-a:underline
                prose-strong:text-white prose-em:text-gray-300
                prose-li:text-gray-300 prose-ul:marker:text-gray-500
                prose-hr:border-gray-700 prose-blockquote:border-gray-600
                prose-table:text-gray-300 prose-th:text-white"
              dangerouslySetInnerHTML={{ __html: html }}
            />
          )}
        </div>
      </div>
    </div>
  )
}
```

- [ ] **Step 2: TypeScript 확인**

```bash
cd /home/donghyunlee/projects/SFOOD-LLM-WIKI-WORKFLOW/dashboard
npx tsc --noEmit
```

Expected: 오류 0개

- [ ] **Step 3: 커밋**

```bash
git add dashboard/components/MarkdownModal.tsx
git commit -m "feat: create MarkdownModal with marked + prose styling"
```

---

### Task 7: Create Header Component

**Files:**
- Create: `dashboard/components/Header.tsx`

sticky 헤더. 회사 로고 + 동기화 버튼 + 마지막 조회 시각.

- [ ] **Step 1: Header.tsx 생성**

`dashboard/components/Header.tsx`를 아래 내용으로 생성한다:

```typescript
'use client'

interface Props {
  syncing: boolean
  syncMsg: string | null
  lastSyncedAt: string | null
  onSync: () => void
}

export default function Header({ syncing, syncMsg, lastSyncedAt, onSync }: Props) {
  return (
    <header className="sticky top-0 z-40 bg-[#0d0d1a]/95 backdrop-blur-sm border-b border-gray-800/60 px-6 py-3">
      <div className="max-w-6xl mx-auto flex items-center justify-between gap-4">
        {/* 로고 */}
        <div className="flex items-center gap-2">
          <span className="text-xl font-bold text-white tracking-tight">🏢 SFOOD</span>
          <span className="text-gray-500 text-sm hidden sm:inline">Agent Headquarters</span>
        </div>

        {/* 우측: 시각 + 동기화 버튼 */}
        <div className="flex items-center gap-3">
          {lastSyncedAt && (
            <span className="text-gray-600 text-xs hidden md:inline">
              조회:{' '}
              {new Date(lastSyncedAt).toLocaleTimeString('ko-KR', {
                hour: '2-digit',
                minute: '2-digit',
              })}
            </span>
          )}
          <button
            onClick={onSync}
            disabled={syncing}
            className="text-xs px-3 py-1.5 bg-blue-950 hover:bg-blue-900 disabled:opacity-50 text-blue-300 rounded-lg border border-blue-800 transition-colors"
          >
            {syncing ? '⏳ 동기화 중...' : '🔄 동기화'}
          </button>
        </div>
      </div>

      {/* 동기화 결과 메시지 */}
      {syncMsg && (
        <p
          className={`text-center text-xs mt-1 ${
            syncMsg.includes('완료') ? 'text-green-400' : 'text-red-400'
          }`}
        >
          {syncMsg}
        </p>
      )}
    </header>
  )
}
```

- [ ] **Step 2: 커밋**

```bash
git add dashboard/components/Header.tsx
git commit -m "feat: create Header component with sync button"
```

---

### Task 8: Create Footer Component

**Files:**
- Create: `dashboard/components/Footer.tsx`

부서 수, 에이전트 수, 버전 표시. 서버 컴포넌트 (함수 props 없음).

- [ ] **Step 1: Footer.tsx 생성**

`dashboard/components/Footer.tsx`를 아래 내용으로 생성한다:

```typescript
interface Props {
  deptCount: number
  agentCount: number
}

export default function Footer({ deptCount, agentCount }: Props) {
  return (
    <footer className="border-t border-gray-800/50 mt-16 py-5 px-6">
      <div className="max-w-6xl mx-auto flex items-center justify-between text-xs text-gray-600">
        <span className="text-gray-500">에쓰푸드 IT AX팀</span>
        <span>
          {deptCount}개 부서 · {agentCount}명 에이전트
        </span>
        <span>v1.1.0</span>
      </div>
    </footer>
  )
}
```

- [ ] **Step 2: 커밋**

```bash
git add dashboard/components/Footer.tsx
git commit -m "feat: create Footer component"
```

---

### Task 9: Create AgentStatCard Component

**Files:**
- Create: `dashboard/components/AgentStatCard.tsx`

RPG 스탯 카드. status ring glow + 이모지 아이콘 + XP 바 + 레벨 + 모델명 + 상태 배지. `data-testid="agent-card"` 추가 (Playwright 테스트용).

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
    .replace('-4-6', ' 4.6')
    .replace('-4-5', ' 4.5')
    .replace('-20251001', '')
}

export default function AgentStatCard({ agent, status, runCount }: Props) {
  const level = Math.min(10, Math.floor(runCount / 3) + 1)
  const xp = Math.min(20, runCount)
  const xpPercent = (xp / 20) * 100
  const xpColor = XP_COLOR[agent.colorClass] ?? 'bg-gray-500'

  return (
    <div
      data-testid="agent-card"
      className={`relative bg-gray-900/70 border-2 rounded-2xl p-4 flex flex-col items-center gap-2.5 w-40 transition-all duration-300 hover:bg-gray-800/70 ${RING_CLASS[status]}`}
    >
      {/* Status dot */}
      <span
        className={`absolute top-2.5 right-2.5 w-2 h-2 rounded-full ${STATUS_DOT[status]}`}
        title={status}
      />

      {/* Job icon */}
      <span
        className="text-4xl mt-1 select-none leading-none"
        role="img"
        aria-label={agent.role}
      >
        {agent.emoji}
      </span>

      {/* Identity */}
      <div className="text-center w-full">
        <p className="font-bold text-sm text-white truncate">{agent.name}</p>
        <p className="text-xs text-gray-400 leading-snug mt-0.5 line-clamp-2">{agent.role}</p>
      </div>

      {/* XP bar */}
      <div className="w-full">
        <div className="flex justify-between text-xs text-gray-600 mb-1">
          <span>XP</span>
          <span>{xp}/20</span>
        </div>
        <div className="h-1.5 bg-gray-800 rounded-full overflow-hidden">
          <div
            className={`h-full rounded-full transition-all duration-700 ${xpColor}`}
            style={{ width: `${xpPercent}%` }}
          />
        </div>
      </div>

      {/* Level + Model */}
      <div className="flex items-center justify-between w-full text-xs">
        <span className="font-mono font-bold text-yellow-500">Lv.{level}</span>
        <span className="text-gray-500 truncate max-w-[72px] text-right">
          {formatModel(agent.model)}
        </span>
      </div>

      {/* Status badge */}
      <StatusBadge status={status} />
    </div>
  )
}
```

- [ ] **Step 2: TypeScript 확인**

```bash
cd /home/donghyunlee/projects/SFOOD-LLM-WIKI-WORKFLOW/dashboard
npx tsc --noEmit
```

Expected: 오류 0개

- [ ] **Step 3: 커밋**

```bash
git add dashboard/components/AgentStatCard.tsx
git commit -m "feat: create AgentStatCard RPG stat card component"
```

---

### Task 10: Create DepartmentFloor Component

**Files:**
- Create: `dashboard/components/DepartmentFloor.tsx`

부서 헤더(이름 + 상태) + 에이전트 그리드(AgentStatCard) + 리포트 버튼(`hasLocalReport`일 때만). `DepartmentSection`을 대체.

- [ ] **Step 1: DepartmentFloor.tsx 생성**

`dashboard/components/DepartmentFloor.tsx`를 아래 내용으로 생성한다:

```typescript
'use client'
import AgentStatCard from './AgentStatCard'
import StatusBadge from './StatusBadge'
import type { RoutineWithStatus } from '@/types'

interface Props {
  routine: RoutineWithStatus
  onViewReport: (filename: string) => void
}

export default function DepartmentFloor({ routine, onViewReport }: Props) {
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

        {/* 리포트 버튼: 로컬 파일 있을 때만 표시 */}
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
          />
        ))}
      </div>
    </section>
  )
}
```

- [ ] **Step 2: TypeScript 확인**

```bash
cd /home/donghyunlee/projects/SFOOD-LLM-WIKI-WORKFLOW/dashboard
npx tsc --noEmit
```

Expected: 오류 0개

- [ ] **Step 3: 커밋**

```bash
git add dashboard/components/DepartmentFloor.tsx
git commit -m "feat: create DepartmentFloor component with AgentStatCard grid"
```

---

### Task 11: Update page.tsx — Integration

**Files:**
- Modify: `dashboard/app/page.tsx`

새 컴포넌트(DepartmentFloor, MarkdownModal, Header, Footer)로 통합. syncMsg 5초 후 자동 초기화 추가.

- [ ] **Step 1: page.tsx 교체**

`dashboard/app/page.tsx`를 아래 내용으로 교체한다:

```typescript
'use client'
import { useEffect, useState, useCallback } from 'react'
import DepartmentFloor from '@/components/DepartmentFloor'
import MarkdownModal from '@/components/MarkdownModal'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import type { DashboardData } from '@/types'

const REFRESH_INTERVAL_MS = 5 * 60 * 1000

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
      setTimeout(() => setSyncMsg(null), 5000)
    }
  }

  const deptCount = data?.routines.length ?? 0
  const agentCount = data?.routines.reduce((s, r) => s + r.agents.length, 0) ?? 0

  return (
    <>
      <Header
        syncing={syncing}
        syncMsg={syncMsg}
        lastSyncedAt={data?.lastSyncedAt ?? null}
        onSync={handleSync}
      />

      <main className="px-6 py-10 md:px-12 max-w-6xl mx-auto min-h-[calc(100vh-120px)]">
        {!data && (
          <p className="text-gray-600 text-sm mt-4">데이터 로딩 중...</p>
        )}
        {data?.routines.map(routine => (
          <DepartmentFloor
            key={routine.id}
            routine={routine}
            onViewReport={setSelectedReport}
          />
        ))}
      </main>

      <Footer deptCount={deptCount} agentCount={agentCount} />

      <MarkdownModal
        filename={selectedReport}
        onClose={() => setSelectedReport(null)}
      />
    </>
  )
}
```

- [ ] **Step 2: TypeScript 빌드 전체 확인**

```bash
cd /home/donghyunlee/projects/SFOOD-LLM-WIKI-WORKFLOW/dashboard
npx tsc --noEmit
```

Expected: 오류 0개

- [ ] **Step 3: 프로덕션 빌드 확인**

```bash
cd /home/donghyunlee/projects/SFOOD-LLM-WIKI-WORKFLOW/dashboard
npm run build 2>&1 | tail -20
```

Expected: `✓ Compiled successfully` 또는 `Route (app) ...` 표 출력, 오류 없음.

- [ ] **Step 4: 커밋**

```bash
git add dashboard/app/page.tsx
git commit -m "feat: integrate DepartmentFloor, MarkdownModal, Header, Footer in page.tsx"
```

---

### Task 12: Playwright Setup + E2E Tests

**Files:**
- Create: `dashboard/tests/playwright.config.ts`
- Create: `dashboard/tests/dashboard.spec.ts`
- Modify: `dashboard/package.json` (npm install로 자동)

주의: 테스트 실행 전 `npm run dev`로 서버가 http://localhost:3737에서 실행 중이어야 한다.

- [ ] **Step 1: @playwright/test 설치**

```bash
cd /home/donghyunlee/projects/SFOOD-LLM-WIKI-WORKFLOW/dashboard
npm install -D @playwright/test
npx playwright install chromium
```

Expected: `chromium` 브라우저 설치 완료 메시지.

- [ ] **Step 2: playwright.config.ts 생성**

`dashboard/tests/playwright.config.ts`를 아래 내용으로 생성한다:

```typescript
import { defineConfig } from '@playwright/test'

export default defineConfig({
  testDir: './',
  use: {
    baseURL: 'http://localhost:3737',
    headless: true,
    screenshot: 'on',
    viewport: { width: 1280, height: 900 },
  },
  outputDir: './screenshots',
  reporter: [['list']],
})
```

- [ ] **Step 3: dashboard.spec.ts 생성**

`dashboard/tests/dashboard.spec.ts`를 아래 내용으로 생성한다:

```typescript
import { test, expect } from '@playwright/test'

test.describe('SFOOD Agent HQ Dashboard v1.1', () => {

  test('01 — 홈 페이지 로드 및 전체 스크린샷', async ({ page }) => {
    await page.goto('/')
    // 에이전트 카드 로드 대기
    await page.waitForSelector('[data-testid="agent-card"]', { timeout: 15000 })
    await page.screenshot({
      path: 'tests/screenshots/01-home-full.png',
      fullPage: true,
    })
    // 기본 구조 확인
    await expect(page.locator('header')).toBeVisible()
    await expect(page.locator('footer')).toBeVisible()
  })

  test('02 — 헤더: SFOOD 브랜딩 + 동기화 버튼', async ({ page }) => {
    await page.goto('/')
    await page.waitForSelector('header')
    await expect(page.locator('header')).toContainText('SFOOD')
    await expect(page.locator('button:has-text("동기화")')).toBeVisible()
    await page.screenshot({ path: 'tests/screenshots/02-header.png' })
  })

  test('03 — 2개 부서 섹션 표시', async ({ page }) => {
    await page.goto('/')
    await page.waitForSelector('[data-testid="agent-card"]', { timeout: 15000 })
    const sections = page.locator('section')
    await expect(sections).toHaveCount(2)
    await expect(page.locator('text=Wiki 관리팀')).toBeVisible()
    await expect(page.locator('text=AI 검색 품질팀')).toBeVisible()
    await page.screenshot({ path: 'tests/screenshots/03-two-departments.png', fullPage: true })
  })

  test('04 — 에이전트 카드 총 10개 표시', async ({ page }) => {
    await page.goto('/')
    await page.waitForSelector('[data-testid="agent-card"]', { timeout: 15000 })
    const cards = page.locator('[data-testid="agent-card"]')
    await expect(cards).toHaveCount(10)
    // 6명 Wiki 관리팀 + 4명 AI 검색 품질팀
    await page.screenshot({ path: 'tests/screenshots/04-agent-cards.png', fullPage: true })
  })

  test('05 — 리포트 버튼 클릭 → Markdown 모달 렌더링', async ({ page }) => {
    await page.goto('/')
    await page.waitForSelector('[data-testid="agent-card"]', { timeout: 15000 })
    // Wiki 관리팀에만 리포트 버튼 표시됨
    const reportBtn = page.locator('button:has-text("최근 리포트 보기")').first()
    const hasBtnVisible = await reportBtn.isVisible()
    if (!hasBtnVisible) {
      // 로컬 런 파일 없을 때 — 버튼 없음이 정상
      console.log('리포트 버튼 없음 (로컬 runs/ 비어있음) — 스킵')
      return
    }
    await reportBtn.click()
    await page.waitForSelector('article.prose', { timeout: 8000 })
    await expect(page.locator('article.prose')).toBeVisible()
    // raw <pre> 태그가 없어야 함
    await expect(page.locator('pre:has-text("# ")')).toHaveCount(0)
    await page.screenshot({ path: 'tests/screenshots/05-markdown-modal.png' })
    // ESC로 닫기
    await page.keyboard.press('Escape')
    await expect(page.locator('article.prose')).not.toBeVisible()
  })

  test('06 — 푸터: 부서 수 + 에이전트 수 표시', async ({ page }) => {
    await page.goto('/')
    await page.waitForSelector('footer')
    await expect(page.locator('footer')).toContainText('2개 부서')
    await expect(page.locator('footer')).toContainText('10명 에이전트')
    await page.screenshot({ path: 'tests/screenshots/06-footer.png' })
  })

})
```

- [ ] **Step 4: 서버 실행 확인 후 테스트 실행**

서버가 이미 실행 중인지 확인:

```bash
curl -s http://localhost:3737 > /dev/null && echo "서버 실행 중" || echo "서버 없음"
```

서버 없으면 별도 터미널에서 `cd dashboard && npm run dev &` 실행 후 10초 대기.

테스트 실행:

```bash
cd /home/donghyunlee/projects/SFOOD-LLM-WIKI-WORKFLOW/dashboard
npx playwright test tests/dashboard.spec.ts --config tests/playwright.config.ts
```

Expected: 6개 테스트 중 최소 5개 통과 (테스트 05는 로컬 runs/ 비어있으면 skip 가능).

스크린샷 확인:
```bash
ls -la /home/donghyunlee/projects/SFOOD-LLM-WIKI-WORKFLOW/dashboard/tests/screenshots/
```

Expected: `01-home-full.png` ~ `06-footer.png` 파일 생성됨.

- [ ] **Step 5: 커밋**

```bash
git add dashboard/package.json dashboard/package-lock.json \
        dashboard/tests/playwright.config.ts dashboard/tests/dashboard.spec.ts
git commit -m "test: add Playwright E2E screenshot tests for dashboard v1.1"
```

---

## Verification Checklist

모든 태스크 완료 후 최종 확인:

```bash
# TypeScript 0 오류
cd /home/donghyunlee/projects/SFOOD-LLM-WIKI-WORKFLOW/dashboard && npx tsc --noEmit

# 프로덕션 빌드 성공
npm run build

# API 응답 정상 (2개 루틴)
curl -s http://localhost:3737/api/dashboard | python3 -c "
import json,sys
d=json.load(sys.stdin)
print('루틴 수:', len(d['routines']))
for r in d['routines']:
    print(' -', r['department'], '|', r['runCount'], '회 | hasLocal:', r['hasLocalReport'])
"

# Playwright 전체 통과
npx playwright test tests/dashboard.spec.ts --config tests/playwright.config.ts
```

스크린샷 위치: `dashboard/tests/screenshots/`
