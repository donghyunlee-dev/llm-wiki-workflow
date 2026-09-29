#!/usr/bin/env node
/**
 * auto-search.mjs
 * 불충분 질문 재시도 + 교육 사이트(Claude Academy/ChatGPT Learn/Google AI Learn) 커리큘럼 기반
 * 페르소나 질문 생성 → SFOOD-LLM-WIKI 검색 API 호출 → 런 리포트 작성
 */
import { readFileSync, writeFileSync, mkdirSync, existsSync, unlinkSync, readdirSync } from 'fs'
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

// 실패 포함 어떤 종료에서도 step 파일을 정리 (대시보드 유령 단계 방지)
process.on('exit', () => { try { unlinkSync(STEP_FILE) } catch { /* ignore */ } })

// ── 환경변수 로드 ──────────────────────────────────────────
function loadEnv(envPath) {
  if (!existsSync(envPath)) return
  console.log(`[env] Loading: ${envPath}`)
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

const OPENAI_KEY = process.env.OPENAI_API_KEY ?? ''
if (!OPENAI_KEY) throw new Error('OPENAI_API_KEY not set in .env.local')

// ── 유틸 ──────────────────────────────────────────────────
function setStep(n) {
  writeFileSync(STEP_FILE, JSON.stringify({ step: n }))
}

function sleep(ms) {
  return new Promise(r => setTimeout(r, ms))
}

async function isServiceUp() {
  try {
    const res = await fetch(`${WIKI_BASE}/`, { signal: AbortSignal.timeout(3000) })
    return res.status < 500
  } catch { return false }
}

async function waitForService(maxSec = 90) {
  for (let i = 0; i < maxSec; i += 2) {
    if (await isServiceUp()) return true
    await sleep(2000)
  }
  return false
}

function todayKST() {
  return new Date().toLocaleDateString('en-CA', { timeZone: 'Asia/Seoul' })
}

// ── 과거 런 리포트에서 부족 질문 추출 ──────────────────────────
function loadRecentInsufficient(maxFiles = 10) {
  let files
  try {
    files = readdirSync(RUNS_DIR)
      .filter(f => /\d{4}-\d{2}-\d{2}-auto-search.*\.md$/.test(f))
      .sort()
      .slice(-maxFiles)
      .reverse() // 최신 먼저
  } catch { return { insufficient: [], recentQuestions: [] } }

  const insufficient = []
  const seen = new Set()
  const recentQuestions = []

  for (const file of files) {
    try {
      const content = readFileSync(resolve(RUNS_DIR, file), 'utf-8')
      const sections = content.split(/###\s+Q\d+\.\s+/)
      for (const section of sections.slice(1)) {
        const question = section.trim().split('\n')[0]?.trim()
        if (!question || seen.has(question)) continue
        seen.add(question)
        recentQuestions.push(question)
        if (section.includes('충분도: 부족')) insufficient.push(question)
      }
    } catch { /* ignore */ }
  }

  return { insufficient, recentQuestions: recentQuestions.slice(0, 30) }
}

function normalizeWhitespace(value) {
  return String(value ?? '').replace(/\s+/g, ' ').trim()
}

function dedupeQuestionMeta(items, limit = 5) {
  const seen = new Set()
  const deduped = []

  for (const item of items) {
    const question = normalizeWhitespace(item.question)
    if (!question) continue
    const key = question.toLowerCase()
    if (seen.has(key)) continue
    seen.add(key)
    deduped.push({
      ...item,
      question,
    })
    if (deduped.length >= limit) break
  }

  return deduped
}

// ── Step 1: 질문 생성 (OpenAI) ────────────────────────────
setStep(1)
console.log('[Step 1] 과거 런 리포트 분석 및 페르소나 시나리오 준비 중...')

// 5개 질문은 3개 교육 사이트 커리큘럼에 라운드로빈으로 배분한다.
// 실제 커리큘럼 발견(웹서치/fetch)은 remote 루틴(Anthropic 클라우드)이 담당하므로,
// 로컬 스크립트는 sourceSite 회전을 위한 시드 주제 목록을 폴백으로 사용한다.
const EDU_SITES = [
  { key: 'claude_academy', label: 'Claude Academy', url: 'https://academy.claude.com/ko',
    seedTopics: ['프롬프트 작성 기초', 'Claude와 대화 설계하기', 'Claude로 문서 요약하기', 'AI와 함께 아이디어 브레인스토밍하기'] },
  { key: 'chatgpt_learn', label: 'ChatGPT Learn', url: 'https://learn.chatgpt.com/docs',
    seedTopics: ['ChatGPT 첫 사용 가이드', '효과적인 프롬프트 작성법', 'ChatGPT로 코드 작성 도움받기', 'ChatGPT 커스텀 지침 설정'] },
  { key: 'google_ai_learn', label: 'Google AI Learn', url: 'https://ai.google/learn-ai-skills/',
    seedTopics: ['생성형 AI 기초 이해하기', 'Gemini로 업무 생산성 높이기', 'AI 프롬프트 엔지니어링 입문', '책임 있는 AI 사용법'] },
]
const STATE_PATH = resolve(TMP_DIR, 'education-coverage-state.json')

function loadCoverageState() {
  try { return JSON.parse(readFileSync(STATE_PATH, 'utf-8')) } catch { return { runCount: 0, siteIndex: {} } }
}
function saveCoverageState(state) {
  writeFileSync(STATE_PATH, JSON.stringify(state, null, 2))
}

const coverageState = loadCoverageState()
// 라운드로빈 슬롯 배분: 이번 실행의 시작 사이트를 회전시켜 장기적으로 균등 배분
const rotationStart = coverageState.runCount % EDU_SITES.length
const slotSites = Array.from({ length: 5 }, (_, i) => EDU_SITES[(rotationStart + i) % EDU_SITES.length])

// 각 사이트에서 다음에 쓸 시드 주제를 순환 선택(최근 사용한 것 다음 것부터)
const slotTopics = slotSites.map(site => {
  const idx = coverageState.siteIndex[site.key] ?? 0
  const topic = site.seedTopics[idx % site.seedTopics.length]
  coverageState.siteIndex[site.key] = idx + 1
  return { site, topic }
})

const { insufficient, recentQuestions } = loadRecentInsufficient(10)
const retryTargets = insufficient.slice(0, 2) // 최근 부족 질문 최대 2개 (사이트/슬롯 제한 없음)
const retryCount = retryTargets.length

console.log(`[Step 1] 사이트 배분: ${slotSites.map(s => s.label).join(', ')} / 재시도 ${retryCount}건`)

const recentList = recentQuestions.slice(0, 25).map(q => `- ${q}`).join('\n') || '(이전 기록 없음)'

const genPrompt = `당신은 AI 기반 개발 위키의 검색 공백을 드러내기 위한 질문 데이터셋 설계자입니다.

목표:
- 실제 사용자가 검색창에 입력할 법한 질문 5개를 만든다.
- 각 질문은 아래 "슬롯별 배분"에 지정된 교육 사이트의 커리큘럼 주제에서 나와야 한다. 순수 상상으로 페르소나를 지어내지 않는다.
- 그 주제를 배우는 중일 법한 초보자 페르소나(입문자·비개발자 기획자·학생·CLI 미숙 주니어 등)와 상황, 막힌 지점을 만든다.
- 키워드를 먼저 고정하지 말고, 커리큘럼 주제와 상황에서 필요한 기능명·명령어·개념어를 스스로 도출한다.
- 불충분했던 기존 질문은 같은 주제를 다른 각도에서 다시 탐색한다.

최근 이미 사용한 질문:
${recentList}

재탐색이 필요한 불충분 질문 (최대 ${retryCount}개, 사이트/슬롯 제한 없음):
${retryCount > 0 ? retryTargets.map((q, i) => `${i + 1}. ${q}`).join('\n') : '- 없음'}

슬롯별 배분 (반드시 지킨다 — 각 슬롯은 지정된 사이트의 커리큘럼 주제를 그대로 활용한다):
${slotTopics.map((s, i) => `${i + 1}. 사이트: ${s.site.label} (${s.site.url}) / 커리큘럼 주제: "${s.topic}"`).join('\n')}

생성 규칙:
- 슬롯 순서와 사이트/주제 배정을 그대로 따른다. 응답의 questions 배열도 같은 순서로 반환한다.
- 이 중 최대 ${retryCount}개는 위 불충분 질문을 다른 표현, 더 구체적인 상황, 더 실행 가능한 맥락으로 재작성해도 된다(재시도). 이 경우에도 sourceSite/sourceTopic은 원래 슬롯 값을 유지한다.
- 각 질문은 서로 다른 페르소나에서 나와야 한다.
- 각 질문은 역할, 현재 작업 목표, 사용 중인 도구/환경, 실제 막힌 증상, 검색 이유가 분명해야 한다.
- "설치 방법", "차이점", "무엇인가요" 같은 일반형 질문은 최대 1개만 허용한다.
- 제품명만 바꾼 유사 질문, 동일 커리큘럼 주제의 반복 질문은 금지한다.
- 위키 문서 공백을 드러낼 가능성이 높은 질문을 우선한다.
- 질문은 한국어 검색창에 실제로 입력할 만한 자연스러운 문장이어야 한다.

응답 형식:
- JSON만 출력한다.
- 아래 스키마를 따른다.

{
  "questions": [
    {
      "question": "실제 검색 질문",
      "persona": "사용자 역할",
      "situation": "현재 작업 상황",
      "painPoint": "막힌 지점",
      "searchIntent": "왜 이 질문을 검색하는지",
      "inferredKeywords": ["상황에서 도출한 키워드1", "키워드2"],
      "sourceSite": "claude_academy | chatgpt_learn | google_ai_learn",
      "sourceTopic": "커리큘럼 주제",
      "isRetry": true,
      "originalQuestion": "원래 부족했던 질문"
    }
  ]
}
`

// OpenAI 질문 생성 — 실패해도 전체 런이 죽지 않도록 폴백을 둔다
let generatedItems = []
try {
  const genRes = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${OPENAI_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: 'gpt-4o-mini',
      max_tokens: 2000,                                 // 5문항 × 8필드 JSON — 600은 잘림
      response_format: { type: 'json_object' },         // JSON 보장
      messages: [{ role: 'user', content: genPrompt }],
    }),
    signal: AbortSignal.timeout(60_000),
  })

  const genBody = await genRes.text()
  if (!genRes.ok) throw new Error(`OpenAI API error ${genRes.status}: ${genBody.slice(0, 200)}`)

  const genJson = JSON.parse(genBody)
  const rawText = genJson.choices?.[0]?.message?.content ?? ''
  const cleaned = rawText.replace(/```json|```/g, '').trim()
  const match = cleaned.match(/\{[\s\S]*\}/)
  const parsed = JSON.parse(match?.[0] ?? cleaned)
  generatedItems = Array.isArray(parsed.questions) ? parsed.questions : []
  if (generatedItems.length === 0) throw new Error('questions 배열이 비어 있음')
} catch (e) {
  // 폴백: 재시도 대상 + 슬롯별 시드 주제 기반 기본 질문으로 진행 (런 전체 실패 방지)
  console.warn(`[Step 1] OpenAI 질문 생성 실패 — 폴백 질문 사용: ${e.message}`)
  const fallbackBySlot = slotTopics.map(({ site, topic }, i) => {
    if (i < retryCount) {
      const q = retryTargets[i]
      return { question: q, isRetry: true, originalQuestion: q, persona: '기존 검색 실패를 다시 시도하는 사용자', situation: '같은 문제를 다시 검색', painPoint: '이전 검색에서 충분한 답을 못 찾음', searchIntent: '공백 해소 재확인', inferredKeywords: [], sourceSite: site.key, sourceTopic: topic, sourceUrl: site.url }
    }
    return { question: `${topic}을 배우다가 막혔는데 어떻게 해야 하나요`, persona: `${site.label} 커리큘럼을 따라가는 초보자`, situation: `${topic} 학습 중`, painPoint: '다음 단계로 어떻게 진행해야 할지 모름', searchIntent: '막힌 지점 해소', inferredKeywords: [topic], sourceSite: site.key, sourceTopic: topic, sourceUrl: site.url }
  })
  generatedItems = fallbackBySlot
}

let questionMeta = dedupeQuestionMeta(generatedItems.map((item, index) => {
  const slot = slotTopics[index] // 모델이 sourceSite/sourceTopic을 빠뜨려도 슬롯 배분값으로 보정
  return {
    question: item.question,
    persona: normalizeWhitespace(item.persona),
    situation: normalizeWhitespace(item.situation),
    painPoint: normalizeWhitespace(item.painPoint),
    searchIntent: normalizeWhitespace(item.searchIntent),
    inferredKeywords: Array.isArray(item.inferredKeywords) ? item.inferredKeywords.map(normalizeWhitespace).filter(Boolean).slice(0, 6) : [],
    sourceSite: normalizeWhitespace(item.sourceSite) || slot?.site.key || '',
    sourceTopic: normalizeWhitespace(item.sourceTopic) || slot?.topic || '',
    sourceUrl: item.sourceUrl || slot?.site.url || '',
    isRetry: Boolean(item.isRetry),
    originalQuestion: normalizeWhitespace(item.originalQuestion),
    order: index,
  }
}), 5)

if (questionMeta.length === 0) throw new Error('질문 생성 실패: 빈 결과')

// 모델이 retryCount를 제대로 맞추지 못하면 부족 질문을 안전하게 보정
const retrySeen = new Set(questionMeta.map(item => normalizeWhitespace(item.originalQuestion)).filter(Boolean))
for (const originalQuestion of retryTargets) {
  if (questionMeta.length >= 5) break
  if (retrySeen.has(originalQuestion)) continue
  const slot = slotTopics[questionMeta.length]
  questionMeta.push({
    question: originalQuestion,
    persona: '기존 검색 실패를 다시 시도하는 사용자',
    situation: '같은 문제를 더 직접적으로 다시 검색하는 상황',
    painPoint: '이전 검색에서 충분한 문서를 찾지 못함',
    searchIntent: '기존 공백이 실제로 해소됐는지 재확인',
    inferredKeywords: [],
    sourceSite: slot?.site.key || '',
    sourceTopic: slot?.topic || '',
    sourceUrl: slot?.site.url || '',
    isRetry: true,
    originalQuestion,
  })
}

questionMeta = questionMeta.slice(0, 5)

coverageState.runCount += 1
saveCoverageState(coverageState)

writeFileSync(resolve(TMP_DIR, 'auto-search-questions.json'), JSON.stringify(questionMeta, null, 2))
console.log('[Step 1] 생성된 질문:', questionMeta.map(item => item.question))

// ── Step 2: 위키 서비스 확인 및 검색 실행 ──────────────────
setStep(2)
console.log('[Step 2] SFOOD-LLM-WIKI 서비스 확인 중...')

if (!await isServiceUp()) {
  console.log(`[Step 2] 서비스 미기동 → pnpm dev 시작 (${WIKI_DIR})`)
  const child = spawn('pnpm', ['dev'], {
    cwd: WIKI_DIR,
    detached: true,
    stdio: 'ignore',
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

for (let i = 0; i < questionMeta.length; i++) {
  const meta = questionMeta[i]
  const { question, isRetry } = meta
  console.log(`[Step 2] 검색 ${i + 1}/${questionMeta.length} [${isRetry ? '재시도' : '신규'}]: ${question}`)

  try {
    const searchRes = await fetch(`${WIKI_BASE}/api/wiki/ai/search`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ question, persona: meta.persona || '' }),
      signal: AbortSignal.timeout(90_000),
    })

    const searchBody = await searchRes.text()
    if (!searchRes.ok) {
      results.push({ ...meta, status: 'error', error: `HTTP ${searchRes.status}: ${searchBody.slice(0, 200)}` })
    } else {
      const searchJson = JSON.parse(searchBody)
      results.push({
        ...meta,
        status: 'ok',
        sufficiency: searchJson.sufficiency ?? '-',
        recommendedCount: searchJson.recommendedDocuments?.length ?? 0,
        answerSummary: (searchJson.answerSummary ?? searchJson.answer ?? '').slice(0, 120),
      })
    }
  } catch (e) {
    results.push({ ...meta, status: 'error', error: e.message })
  }

  if (i < questionMeta.length - 1) await sleep(4000)
}

writeFileSync(resolve(TMP_DIR, 'auto-search-results.json'), JSON.stringify(results, null, 2))
console.log('[Step 2] 검색 완료:', results.map(r => `${r.status}(${r.sufficiency})`).join(', '))

// ── 런 리포트 작성 ──────────────────────────────────────────
const today = todayKST()
const okCount = results.filter(r => r.status === 'ok').length
const sufficientCount = results.filter(r => r.sufficiency === '충분').length
const retryResultCount = results.filter(r => r.isRetry).length
const newResultCount = results.filter(r => !r.isRetry).length

const reportLines = [
  `# Auto Search Run — ${today}`,
  '',
  `## 실행 요약`,
  `- 검색 시도: ${results.length}건 (재시도: ${retryResultCount}건, 신규: ${newResultCount}건)`,
  `- 성공: ${okCount}건`,
  `- 충분도 "충분": ${sufficientCount}/${okCount}건`,
  '',
  `## 질문 및 결과`,
  '',
  ...results.flatMap((r, i) => {
    const lines = [
      `### Q${i + 1}. ${r.question}`,
      `- 유형: ${r.isRetry ? `재시도 (원본: ${r.originalQuestion})` : '신규'}`,
      `- 출처: ${r.sourceSite || '-'} / ${r.sourceTopic || '-'} (${r.sourceUrl || '-'})`,
      `- 페르소나: ${r.persona || '-'}`,
      `- 상황: ${r.situation || '-'}`,
      `- 막힌 지점: ${r.painPoint || '-'}`,
      `- 검색 의도: ${r.searchIntent || '-'}`,
      `- 추론 키워드: ${Array.isArray(r.inferredKeywords) && r.inferredKeywords.length > 0 ? r.inferredKeywords.join(', ') : '-'}`,
      `- 상태: ${r.status}`,
    ]
    if (r.status === 'ok') {
      lines.push(`- 충분도: ${r.sufficiency}`)
      lines.push(`- 추천 문서 수: ${r.recommendedCount}`)
      if (r.answerSummary) lines.push(`- 답변 요약: ${r.answerSummary}`)
    } else {
      lines.push(`- 오류: ${r.error ?? '-'}`)
    }
    lines.push('')
    return lines
  }),
  `## Validation`,
  `- Playbook 자동 적재: ${okCount > 0 ? '✅ 통과' : '❌ 실패 (성공 건 없음)'}`,
]

const reportPath = resolve(RUNS_DIR, `${today}-auto-search.md`)
writeFileSync(reportPath, reportLines.join('\n'))
console.log(`[Done] 런 리포트 작성: ${reportPath}`)

// step 파일 정리
try { unlinkSync(STEP_FILE) } catch { /* ignore */ }
