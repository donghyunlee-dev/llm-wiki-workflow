# Auto Search Agent Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** SFOOD-LLM-WIKI 서비스에 바이브코딩 관련 질문 5개를 자동으로 생성·검색하여 Confluence Playbook을 유기적으로 축적하는 에이전트를 구현한다.

**Architecture:** Claude Haiku API로 초급/중급 바이브코더 시나리오 질문 5개를 생성(Step 1), 로컬 SFOOD-LLM-WIKI Vite 서비스를 기동 확인 후 `/api/wiki/ai/search`에 순차 POST(Step 2). 검색 API가 `logSearchToPlaybook()`를 자동 호출하므로 에이전트는 API만 호출하면 Confluence 적재가 완성된다. 전체 흐름은 `auto-search.mjs` (Node.js ESM, native fetch 전용) 한 파일에 구현하고, `wiki-update.sh`가 `auto-search` 모드에서 이 파일로 분기한다.

**Tech Stack:** Node.js 18+ (native fetch), Anthropic Messages API, SFOOD-LLM-WIKI Vite dev server (localhost:5173), Next.js 15 dashboard (localhost:3737)

---

## Task 1: agents-config.json — 자동 검색팀 루틴 추가

**Files:**
- Modify: `dashboard/data/agents-config.json`

- [ ] **Step 1: 기존 파일 확인**

```bash
cat dashboard/data/agents-config.json | python3 -c "import json,sys; d=json.load(sys.stdin); [print(r['id'], r['department']) for r in d]"
```

Expected: 기존 2개 루틴 (`trig_01E5...`, `trig_018d...`) 출력

- [ ] **Step 2: 새 루틴 추가 — agents-config.json 끝 배열에 append**

`dashboard/data/agents-config.json` 파일을 열어 최상위 배열 마지막 `}` 뒤에 `,` 를 추가하고 아래 객체를 삽입:

```json
{
  "id": "trig_auto_search_001",
  "name": "SFOOD Wiki Auto Search",
  "cronExpression": "0 10 * * *",
  "department": "자동 검색팀",
  "runReportPrefix": "auto-search",
  "agents": [
    {
      "id": "questioner",
      "name": "출제관 퀴니",
      "role": "바이브코딩 질문 출제관",
      "emoji": "🎯",
      "colorClass": "amber",
      "model": "claude-haiku-4-5-20251001",
      "pipelineStep": 1,
      "pipelineStepLabel": "출제",
      "description": "초급·중급 바이브코더 시나리오에서 실제로 검색할 법한 질문 5개를 매번 새롭게 생성합니다.",
      "bio": "Claude Haiku를 활용해 바이브코딩 학습자가 실제로 마주치는 질문들을 즉석에서 생성합니다. 매 실행마다 다른 질문으로 위키 커버리지를 넓힙니다.",
      "skills": ["질문 생성", "시나리오 설계", "주제 다양화"],
      "tasks": [
        "바이브코딩 초급·중급 질문 5개 생성",
        "설치·사용법·트러블슈팅·개념·비교 주제 균형 조정",
        "생성된 질문을 tmp/auto-search-questions.json에 저장"
      ]
    },
    {
      "id": "searcher",
      "name": "검색관 서치",
      "role": "위키 자동 검색관",
      "emoji": "🔍",
      "colorClass": "cyan",
      "model": "claude-haiku-4-5-20251001",
      "pipelineStep": 2,
      "pipelineStepLabel": "검색",
      "description": "생성된 질문을 SFOOD-LLM-WIKI 검색 API에 순차 제출하여 Confluence Playbook에 결과를 적재합니다.",
      "bio": "위키 서비스 기동을 확인하고 질문별 검색 API를 호출합니다. 검색 결과는 자동으로 Confluence Playbook 페이지에 누적됩니다.",
      "skills": ["API 호출", "서비스 모니터링", "결과 집계"],
      "tasks": [
        "SFOOD-LLM-WIKI 서비스 기동 상태 확인",
        "질문 5개를 /api/wiki/ai/search에 순차 POST",
        "각 응답의 충분도·추천 문서 수집",
        "검색 결과를 runs/{TODAY}-auto-search.md로 저장"
      ]
    }
  ]
}
```

- [ ] **Step 3: JSON 유효성 확인**

```bash
python3 -c "import json; json.load(open('dashboard/data/agents-config.json')); print('valid')"
```

Expected: `valid`

- [ ] **Step 4: 커밋**

```bash
git add dashboard/data/agents-config.json
git commit -m "feat: add auto-search team to dashboard agents config"
```

---

## Task 2: auto-search.mjs — 핵심 실행 스크립트 작성

**Files:**
- Create: `auto-search.mjs` (repo root)

- [ ] **Step 1: 파일 생성**

`/home/donghyunlee/projects/SFOOD-LLM-WIKI-WORKFLOW/auto-search.mjs` 를 아래 내용으로 작성:

```js
#!/usr/bin/env node
/**
 * auto-search.mjs
 * 바이브코딩 질문 5개 자동 생성 → SFOOD-LLM-WIKI 검색 API 호출 → 런 리포트 작성
 */
import { readFileSync, writeFileSync, mkdirSync, existsSync } from 'fs'
import { spawn } from 'child_process'
import { resolve, dirname } from 'path'
import { fileURLToPath } from 'url'

const __dirname = dirname(fileURLToPath(import.meta.url))
const REPO_ROOT = __dirname
const WIKI_DIR = resolve(REPO_ROOT, '../SFOOD-LLM-WIKI')
const TMP_DIR = resolve(REPO_ROOT, 'tmp')
const RUNS_DIR = resolve(REPO_ROOT, 'runs')
const WIKI_PORT = 5173
const WIKI_BASE = `http://localhost:${WIKI_PORT}`
const STEP_FILE = resolve(TMP_DIR, 'step-auto-search.json')

mkdirSync(TMP_DIR, { recursive: true })
mkdirSync(RUNS_DIR, { recursive: true })

// ── 환경변수 로드 (.env.local) ──────────────────────────────
function loadEnv(envPath) {
  if (!existsSync(envPath)) return
  const lines = readFileSync(envPath, 'utf-8').split('\n')
  for (const line of lines) {
    const trimmed = line.trim()
    if (!trimmed || trimmed.startsWith('#')) continue
    const eqIdx = trimmed.indexOf('=')
    if (eqIdx < 0) continue
    const key = trimmed.slice(0, eqIdx).trim()
    const val = trimmed.slice(eqIdx + 1).trim().replace(/^["']|["']$/g, '')
    if (key && !process.env[key]) process.env[key] = val
  }
}
loadEnv(resolve(REPO_ROOT, '.env.local'))
loadEnv(resolve(WIKI_DIR, '.env'))
loadEnv(resolve(WIKI_DIR, '.env.local'))

const ANTHROPIC_KEY = process.env.ANTHROPIC_API_KEY ?? ''
if (!ANTHROPIC_KEY) throw new Error('ANTHROPIC_API_KEY not set in .env.local')

// ── 유틸 ───────────────────────────────────────────────────
function setStep(n) {
  writeFileSync(STEP_FILE, JSON.stringify({ step: n }))
}

async function sleep(ms) {
  return new Promise(r => setTimeout(r, ms))
}

async function isServiceUp() {
  try {
    const res = await fetch(`${WIKI_BASE}/`, { signal: AbortSignal.timeout(3000) })
    return res.status < 500
  } catch { return false }
}

async function waitForService(maxSec = 60) {
  for (let i = 0; i < maxSec; i += 2) {
    if (await isServiceUp()) return true
    await sleep(2000)
  }
  return false
}

function todayKST() {
  return new Date().toLocaleDateString('en-CA', { timeZone: 'Asia/Seoul' })
}

// ── Step 1: 질문 생성 (Claude Haiku) ───────────────────────
setStep(1)
console.log('[Step 1] 바이브코딩 질문 생성 중...')

const genRes = await fetch('https://api.anthropic.com/v1/messages', {
  method: 'POST',
  headers: {
    'x-api-key': ANTHROPIC_KEY,
    'anthropic-version': '2023-06-01',
    'content-type': 'application/json',
  },
  body: JSON.stringify({
    model: 'claude-haiku-4-5-20251001',
    max_tokens: 512,
    messages: [{
      role: 'user',
      content: `당신은 AI 기반 개발(바이브코딩)을 배우는 초급·중급 개발자입니다.
실제로 검색창에 입력할 법한 구체적인 질문 5가지를 JSON 배열로만 응답하세요.
조건:
- 한국어
- 주제 다양화: 설치/환경설정, 사용법, 트러블슈팅, 개념이해, 도구비교 중 각기 다른 것
- AI 코딩 도구(Claude Code, Codex, MCP, 바이브코딩 등) 관련
- 검색 엔진에 실제로 입력할 법한 자연스러운 질문
형식: ["질문1", "질문2", "질문3", "질문4", "질문5"]
JSON 배열만 응답하고 다른 텍스트는 포함하지 마세요.`,
    }],
  }),
})

if (!genRes.ok) {
  const err = await genRes.text()
  throw new Error(`Claude API error ${genRes.status}: ${err}`)
}

const genJson = await genRes.json()
const rawText = genJson.content?.[0]?.text ?? ''

let questions
try {
  // JSON 배열 파싱 (앞뒤 마크다운 코드블록 제거)
  const cleaned = rawText.replace(/```json|```/g, '').trim()
  const match = cleaned.match(/\[[\s\S]*\]/)
  questions = JSON.parse(match?.[0] ?? cleaned)
  if (!Array.isArray(questions) || questions.length === 0) throw new Error('empty')
} catch (e) {
  throw new Error(`질문 파싱 실패: ${e.message}\n원문: ${rawText}`)
}

questions = questions.slice(0, 5)
writeFileSync(resolve(TMP_DIR, 'auto-search-questions.json'), JSON.stringify(questions, null, 2))
console.log('[Step 1] 생성된 질문:', questions)

// ── Step 2: 위키 서비스 확인 및 검색 실행 ──────────────────
setStep(2)
console.log('[Step 2] SFOOD-LLM-WIKI 서비스 확인 중...')

if (!await isServiceUp()) {
  console.log(`[Step 2] 서비스 미기동 → pnpm dev 시작 (${WIKI_DIR})`)
  const child = spawn('pnpm', ['dev'], {
    cwd: WIKI_DIR,
    detached: true,
    stdio: ['ignore', 'pipe', 'pipe'],
    env: { ...process.env },
  })
  child.unref()
  const started = await waitForService(90)
  if (!started) throw new Error('SFOOD-LLM-WIKI 서비스가 90초 내에 기동되지 않았습니다.')
  console.log('[Step 2] 서비스 기동 완료')
} else {
  console.log('[Step 2] 서비스 이미 실행 중')
}

const results = []

for (let i = 0; i < questions.length; i++) {
  const question = questions[i]
  console.log(`[Step 2] 검색 ${i + 1}/5: ${question}`)

  try {
    const searchRes = await fetch(`${WIKI_BASE}/api/wiki/ai/search`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ question }),
      signal: AbortSignal.timeout(90_000),
    })

    const searchJson = searchRes.ok ? await searchRes.json() : { error: `HTTP ${searchRes.status}` }
    results.push({
      question,
      status: searchRes.ok ? 'ok' : 'error',
      sufficiency: searchJson.sufficiency ?? '-',
      recommendedCount: searchJson.recommendedDocuments?.length ?? 0,
      answerSummary: (searchJson.answerSummary ?? searchJson.answer ?? '').slice(0, 120),
    })
  } catch (e) {
    results.push({ question, status: 'error', error: e.message })
  }

  // 검색 사이 간격 (서버 부하 방지)
  if (i < questions.length - 1) await sleep(4000)
}

writeFileSync(resolve(TMP_DIR, 'auto-search-results.json'), JSON.stringify(results, null, 2))
console.log('[Step 2] 검색 완료:', results.map(r => `${r.status}(${r.sufficiency})`).join(', '))

// ── 런 리포트 작성 ──────────────────────────────────────────
const today = todayKST()
const okCount = results.filter(r => r.status === 'ok').length
const sufficientCount = results.filter(r => r.sufficiency === '충분').length

const reportLines = [
  `# Auto Search Run — ${today}`,
  '',
  `## 실행 요약`,
  `- 검색 시도: ${results.length}건`,
  `- 성공: ${okCount}건`,
  `- 충분도 "충분": ${sufficientCount}/${okCount}건`,
  '',
  `## 질문 및 결과`,
  '',
  ...results.map((r, i) => [
    `### Q${i + 1}. ${r.question}`,
    `- 상태: ${r.status}`,
    r.status === 'ok' ? `- 충분도: ${r.sufficiency}` : `- 오류: ${r.error ?? '-'}`,
    r.status === 'ok' ? `- 추천 문서 수: ${r.recommendedCount}` : '',
    r.status === 'ok' && r.answerSummary ? `- 답변 요약: ${r.answerSummary}` : '',
    '',
  ].filter(l => l !== '').join('\n')),
  `## Validation`,
  `- Playbook 자동 적재: ${okCount > 0 ? '✅ 통과' : '❌ 실패 (성공 건 없음)'}`,
]

const reportPath = resolve(RUNS_DIR, `${today}-auto-search.md`)
writeFileSync(reportPath, reportLines.join('\n'))
console.log(`[Done] 런 리포트 작성: ${reportPath}`)

// step 파일 정리
import { unlinkSync } from 'fs'
try { unlinkSync(STEP_FILE) } catch { /* ignore */ }
```

- [ ] **Step 2: 실행 권한 확인 (선택, ESM이므로 불필요)**

```bash
node --version  # 18+ 확인
```

Expected: `v18.x.x` 이상

- [ ] **Step 3: 커밋**

```bash
git add auto-search.mjs
git commit -m "feat: add auto-search.mjs — vibe coding question generator + wiki search executor"
```

---

## Task 3: wiki-update.sh — auto-search 모드 분기 추가

**Files:**
- Modify: `wiki-update.sh`

- [ ] **Step 1: 기존 파일 확인**

```bash
cat wiki-update.sh
```

Expected: Codex 실행 로직 확인

- [ ] **Step 2: auto-search 분기 삽입**

`wiki-update.sh` 에서 `mode` 변수 설정 이후, `prompt=$(cat <<EOF` 블록 이전에 아래 분기를 추가:

```sh
# auto-search: Codex 없이 Node.js 스크립트 직접 실행
if [ "$mode" = "auto-search" ]; then
  exec node "$repo_root/auto-search.mjs"
fi
```

- [ ] **Step 3: 동작 확인 (dry run — 실제 API 호출 없이 분기만 확인)**

```bash
# auto-search 분기가 node로 분기하는지 확인 (--dry-run 없으므로 분기 코드 grep으로 확인)
grep -A2 "auto-search" wiki-update.sh
```

Expected:
```
if [ "$mode" = "auto-search" ]; then
  exec node "$repo_root/auto-search.mjs"
fi
```

- [ ] **Step 4: 커밋**

```bash
git add wiki-update.sh
git commit -m "feat: delegate auto-search mode to auto-search.mjs in wiki-update.sh"
```

---

## Task 4: routines/auto-search.md — 루틴 문서 작성

**Files:**
- Create: `routines/auto-search.md`

- [ ] **Step 1: 파일 작성**

`routines/auto-search.md`:

```markdown
# 루틴: SFOOD Wiki Auto Search

- **루틴 ID**: `trig_auto_search_001`
- **스케줄**: `0 10 * * *` (UTC 10:00 = KST 19:00, 매일)
- **실행 커맨드**: `./wiki-update.sh auto-search`

## 목적

바이브코딩(AI 기반 개발)을 배우는 초급·중급 개발자 시나리오에서 실제로 검색할 법한 질문 5개를
매일 자동으로 생성하여 SFOOD-LLM-WIKI 검색 API에 제출합니다.
검색 결과는 Confluence Playbook 페이지에 자동 적재되어 지식이 유기적으로 축적됩니다.

## 실행 흐름

### Step 1 — 출제관 퀴니 (질문 생성)
Claude Haiku API를 호출하여 바이브코딩 관련 질문 5개를 즉석 생성합니다.
- 주제 다양화: 설치/환경설정, 사용법, 트러블슈팅, 개념이해, 도구비교
- 출력: `tmp/auto-search-questions.json`

### Step 2 — 검색관 서치 (검색 실행)
SFOOD-LLM-WIKI 서비스(localhost:5173)에 질문별 POST 요청을 순차 전송합니다.
- 서비스 미기동 시 자동 시작
- 각 검색 결과는 Confluence Playbook 페이지에 자동 적재
- 출력: `tmp/auto-search-results.json`, `runs/{TODAY}-auto-search.md`

## 환경변수

| 변수 | 위치 | 용도 |
|---|---|---|
| `ANTHROPIC_API_KEY` | `.env.local` | 질문 생성용 Claude API |
| `OPENAI_API_KEY` | `../SFOOD-LLM-WIKI/.env.local` | 위키 검색 AI 응답 |
| `ATLASSIAN_API_TOKEN` | `../SFOOD-LLM-WIKI/.env.local` | Confluence Playbook 적재 |

## 변경 이력

| 날짜 | 변경 내용 |
|---|---|
| 2026-06-02 | 초기 루틴 생성 |
```

- [ ] **Step 2: 커밋**

```bash
git add routines/auto-search.md
git commit -m "docs: add auto-search routine documentation"
```

---

## Task 5: 통합 검증

- [ ] **Step 1: agents-config JSON 재확인**

```bash
python3 -c "
import json
d = json.load(open('dashboard/data/agents-config.json'))
r = next(x for x in d if x['id'] == 'trig_auto_search_001')
print('department:', r['department'])
print('prefix:', r['runReportPrefix'])
print('agents:', [a['name'] for a in r['agents']])
"
```

Expected:
```
department: 자동 검색팀
prefix: auto-search
agents: ['출제관 퀴니', '검색관 서치']
```

- [ ] **Step 2: wiki-update.sh 분기 확인**

```bash
bash -n wiki-update.sh && echo "syntax OK"
grep -c "auto-search" wiki-update.sh
```

Expected: `syntax OK` / `2` (if 조건 + 문자열 2곳)

- [ ] **Step 3: 대시보드 재시작 후 UI 확인**

```bash
pkill -f "next dev" 2>/dev/null; sleep 1
npm run dev -- --port 3737 > /tmp/dashboard-dev.log 2>&1 &
sleep 8 && curl -s -o /dev/null -w "%{http_code}" http://localhost:3737/
```

Expected: `200`

대시보드(http://localhost:3737)에서 "자동 검색팀" 팀방과 사이드바 확인:
- 팀방에 출제관 퀴니(Step 1), 검색관 서치(Step 2) ghost 워크스테이션 표시
- 사이드바에 "자동 검색팀" 섹션 + 실행 버튼 표시

- [ ] **Step 4: 실제 실행 테스트 (ANTHROPIC_API_KEY 있을 때)**

```bash
# 먼저 SFOOD-LLM-WIKI 서비스가 실행 중인지 확인
curl -s -o /dev/null -w "%{http_code}" http://localhost:5173/

# auto-search.mjs 직접 실행
node auto-search.mjs 2>&1 | head -30
```

Expected:
```
[Step 1] 바이브코딩 질문 생성 중...
[Step 1] 생성된 질문: ['...', '...', '...', '...', '...']
[Step 2] SFOOD-LLM-WIKI 서비스 확인 중...
[Step 2] 검색 1/5: ...
...
[Done] 런 리포트 작성: .../runs/2026-06-02-auto-search.md
```

- [ ] **Step 5: 런 리포트 확인**

```bash
cat runs/$(date +%Y-%m-%d -d "today")-auto-search.md 2>/dev/null || cat runs/2026-06-02-auto-search.md
```

Expected: 질문 5개, 상태, 충분도, 추천 문서 수 포함

- [ ] **Step 6: 최종 커밋**

```bash
git add -A
git status
# 변경 없으면 skip
```
