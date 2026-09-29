# Wiki Targets

## Confirmed Index Pages

| Name | Confluence Page ID | Purpose |
|---|---:|---|
| Root Guide Index | 63045651 | Main entry point for AI development guide pages |
| Tool Index | 87851100 | Tool-based navigation |
| Codex Index | 63995906 | Codex navigation and canonical Codex guide set |
| Claude Code Index | 66846748 | Claude Code navigation and canonical Claude Code guide set |
| Gemini Index | 88211525 | Gemini navigation and canonical Gemini guide set |

## Confirmed Ops Pages

| Name | Confluence Page ID | Purpose |
|---|---:|---|
| Ops Log (Knowledge Change Log) | 63111673 | Weekly run summaries and knowledge change history |
| Ops Approval Queue | 120520705 | Manual-review items awaiting human approval before weekly auto-processing |

## Unconfirmed Index Pages

| Name | Confluence Page ID | Purpose |
|---|---:|---|
| Agent Index | <not confirmed> | Agent-based navigation |
| Setup Index | <not confirmed> | Setup and installation navigation |
| MCP Index | <not confirmed> | MCP-related navigation |

## Default Parent Pages

| Name | Confluence Page ID | Purpose |
|---|---:|---|
| Guide Parent | <not confirmed> | Default parent for new Guide pages |
| Ops Parent | 63111673 | Parent for run reports and operational notes (= Ops Log page) |

## Guide Page Candidates

| Guide Page | Confluence Page ID | Candidate Index Pages | Why It Matters |
|---|---:|---|---|
| `[Guide] Getting Started` | 63668231 | Root Guide Index, Tool Index | High-level entry point for new users; useful as a discovery page alongside tool indexes |
| `[Guide] Node.js Setup` | 64618497 | Root Guide Index, Tool Index | Shared prerequisite guide surfaced by audit as a likely missing index link |
| `[Guide] npm Setup` | 64290859 | Root Guide Index, Tool Index | Shared prerequisite guide surfaced by audit as a likely missing index link |
| `[Guide] npx Setup` | 64290887 | Root Guide Index, Tool Index | Shared prerequisite guide surfaced by audit as a likely missing index link |
| `[Guide] pnpm Setup` | 67928082 | Root Guide Index, Tool Index | Shared prerequisite guide surfaced by audit as a likely missing index link |
| `[Guide] Browser MCP Setup` | 84181346 | Root Guide Index, MCP Index | Canonical MCP setup entry that should be discoverable from the root index |
| `[Guide] Desktop Control MCP Setup` | 84181326 | Root Guide Index, MCP Index | Canonical MCP setup entry that should be discoverable from the root index |
| `[Guide] AnythingLLM Local RAG Setup` | 87228417 | Root Guide Index, Tool Index | Local RAG workflow guide that should remain reachable from the root discovery path |
| `[Guide] Codex CLI Setup` | <not confirmed> | Root Guide Index, Tool Index, Codex Index | Referenced by Codex Index summary, but the page ID was not separately confirmed in the audit |
| `[Guide] Claude CLI Setup` | 88211499 | Root Guide Index, Tool Index, Claude Code Index | Confirmed canonical Claude Code setup page; already exposed through Claude Code Index |
| `[Guide] Gemini CLI Setup` | <not confirmed> | Root Guide Index, Tool Index, Gemini Index | Referenced by Gemini Index summary, but page ID was not separately confirmed in the audit |

## Wiki Purpose

이 위키의 독자는 **AI 도구를 활용해 바이브 코딩, 학습, 개인 앱 개발을 하려는 사람**이다.
전문 개발자가 아니어도 따라할 수 있는 실용적인 가이드를 제공하는 것이 목표다.

에이전트는 아래 "범위 기준"을 이해하고, 공식 소스를 탐색하면서 스스로 새 주제를 발견하면 이 파일의 "에이전트 발견 주제" 섹션에 추가한 뒤 페이지를 생성한다.

## 범위 기준 (Scope Intent)

아래 기준에 하나라도 해당하면 문서화 대상이다.

**포함:**
- AI CLI 도구(Claude Code, Codex, Gemini CLI)의 기능 및 사용법
- MCP 서버 연결, 설정, 활용
- AI 에이전트 개념 (subagent, multi-agent, tool use, memory, hooks 등)
- 바이브 코딩 워크플로우 (자연어로 앱 만들기, 반복 실행, 자동화)
- 개인 앱 개발에 쓸 수 있는 AI 활용 패턴 (프롬프트 설계, 코드 생성, 디버깅)
- LLM API 활용 (Claude API, OpenAI API, Gemini API — 개념 및 기초 사용법)
- 개발 환경 설정 (Node.js, Python, 패키지 매니저, IDE 통합)
- 학습 목적의 개념 설명 (AI 에이전트, RAG, 프롬프트 캐싱, function calling 등)
- AI 리터러시/프롬프팅 기초 (교육 사이트 커리큘럼 기반 — 아래 "교육 사이트" 섹션 참조)

**제외:**
- 뉴스, 의견, 트렌드 분석
- 엔터프라이즈 전용 기능 (사용자 대다수가 접근 불가한 내용)
- 보안·인증·결제 관련 상세 내용 (수동 검토 대상)

## Discovery Keywords

에이전트가 Gap Analysis 단계에서 웹 검색에 사용하는 키워드 목록이다.
에이전트는 매 실행마다 `PENDING` 키워드부터 처리하고, 완료 시 `SEARCHED`로 변경한다.
사람이 직접 수정하는 것은 새 키워드를 추가하거나 범위를 조정할 때만이다.

### Claude Code / Claude CLI

| 키워드 | 우선순위 | 상태 |
|--------|---------|------|
| slash commands | 높음 | SEARCHED |
| subagent | 높음 | SEARCHED |
| multi-agent | 높음 | SEARCHED |
| hooks | 높음 | SEARCHED |
| memory CLAUDE.md | 높음 | SEARCHED |
| MCP server setup | 높음 | SEARCHED |
| skills | 높음 | SEARCHED |
| plugins | 높음 | SEARCHED |
| sessions | 높음 | SEARCHED |
| worktrees | 높음 | SEARCHED |
| checkpointing | 높음 | SEARCHED |
| /goal command | 높음 | SEARCHED |
| Agent View claude agents | 높음 | SEARCHED |
| fullscreen rendering | 중간 | SEARCHED |
| context window | 중간 | SEARCHED |
| plugin URL | 중간 | SEARCHED |
| tool use | 중간 | SEARCHED |
| computer use | 중간 | SEARCHED |
| IDE integration VS Code | 중간 | SEARCHED |
| IDE integration JetBrains | 중간 | SEARCHED |
| permissions model | 중간 | SEARCHED |
| settings configuration | 중간 | SEARCHED |
| context window compaction | 중간 | SEARCHED |
| git integration | 중간 | SEARCHED |
| PR review | 중간 | SEARCHED |
| terminal bash tool | 중간 | SEARCHED |
| keybindings | 낮음 | SEARCHED |
| model selection | 낮음 | SEARCHED |
| /usage loops breakdown | 중간 | MANUAL_REVIEW_REQUIRED |
| modelPicker setting | 중간 | SEARCHED |
| promptCacheTtl subagentPromptCacheTtl | 중간 | SEARCHED |

### Codex CLI

| 키워드 | 우선순위 | 상태 |
|--------|---------|------|
| AGENTS.md | 높음 | SEARCHED |
| approval mode | 높음 | SEARCHED |
| sandbox workspace | 높음 | SEARCHED |
| slash commands | 높음 | SEARCHED |
| MCP integration | 높음 | SEARCHED |
| codex remote-control | 중간 | SEARCHED |
| vim composer mode | 높음 | SEARCHED |
| codex mcp-server deprecation app-server migration | 높음 | SEARCHED |
| Codex Appshots | 중간 | SEARCHED |
| keymap debug | 중간 | SEARCHED |
| reasoning effort | 중간 | SEARCHED |
| multimodal input | 중간 | SEARCHED |
| shell command execution | 중간 | SEARCHED |
| environment variables | 낮음 | SEARCHED |
| /export markdown | 중간 | SEARCHED |
| codex exec fork archive restore sessions | 중간 | SEARCHED |
| hooks async MCP tools | 높음 | SEARCHED |

### Gemini CLI

| 키워드 | 우선순위 | 상태 |
|--------|---------|------|
| slash commands | 높음 | SEARCHED |
| GEMINI.md | 높음 | SEARCHED |
| MCP tools | 높음 | SEARCHED |
| extensions | 높음 | SEARCHED |
| Auto Memory inbox flow | 높음 | SEARCHED |
| message queuing during compression | 중간 | SEARCHED |
| memory | 중간 | SEARCHED |
| checkpointing | 중간 | SEARCHED |
| multimodal file input | 중간 | SEARCHED |
| Google Search grounding | 중간 | SEARCHED |
| code execution | 중간 | SEARCHED |
| model selection | 낮음 | SEARCHED |

### MCP (Model Context Protocol)

| 키워드 | 우선순위 | 상태 |
|--------|---------|------|
| MCP overview | 높음 | SEARCHED |
| MCP server list | 높음 | SEARCHED |
| MCP tool definition | 높음 | SEARCHED |
| subagent protocol local remote | 중간 | SEARCHED |
| MCP resource | 중간 | SEARCHED |
| MCP prompt template | 중간 | SEARCHED |
| MCP transport stdio | 중간 | SEARCHED |
| MCP transport SSE | 중간 | SEARCHED |
| MCP debugging | 중간 | SEARCHED |
| MCP sampling | 낮음 | DEPRECATED |

### AI 개발 공통 개념

| 키워드 | 우선순위 | 상태 |
|--------|---------|------|
| vibe coding workflow | 높음 | SEARCHED |
| prompt engineering basics | 높음 | SEARCHED |
| AI agent loop | 높음 | SEARCHED |
| function calling tool use | 높음 | SEARCHED |
| RAG retrieval augmented generation | 높음 | SEARCHED |
| local RAG setup | 높음 | SEARCHED |
| prompt caching | 중간 | SEARCHED |
| embedding vector database | 중간 | SEARCHED |
| context management | 중간 | SEARCHED |
| system prompt | 중간 | SEARCHED |
| few shot prompting | 중간 | SEARCHED |
| structured output JSON mode | 중간 | SEARCHED |
| chain of thought | 중간 | SEARCHED |
| streaming response | 낮음 | SEARCHED |
| batch API | 낮음 | SEARCHED |
| generative AI basics LLM token Transformer | 높음 | SEARCHED |
| ChatGPT first use files web search image generation | 높음 | SEARCHED |

### 바이브 코딩 / 앱 개발 패턴

| 키워드 | 우선순위 | 상태 |
|--------|---------|------|
| vibe coding personal app | 높음 | SEARCHED |
| AI code generation workflow | 높음 | SEARCHED |
| natural language to app | 높음 | SEARCHED |
| AI debugging workflow | 중간 | SEARCHED |
| AI test generation | 중간 | SEARCHED |
| AI refactoring | 중간 | SEARCHED |
| no code low code AI | 중간 | SEARCHED |
| AI pair programming | 중간 | SEARCHED |

## 교육 사이트 (Education Sites)

`routines/auto-search.md`의 페르소나 질문 생성이 참조하는 공식 AI 교육 사이트 목록이다.
이 사이트들의 커리큘럼(코스/레슨 제목)을 기반으로 초보자 질문을 만들고, 위키가 실제 학습 순서를 커버하는지 검증한다.

| 사이트 | URL | 접근 방식 |
|---|---|---|
| Claude Academy | https://academy.claude.com/ko | JS 렌더링 SPA — 직접 fetch 불가. `site:academy.claude.com` 웹서치로 코스/레슨 제목을 발견한다. |
| ChatGPT Learn | https://learn.chatgpt.com/docs | 직접 fetch 가능 |
| Google AI Learn (Gemini 대체) | https://ai.google/learn-ai-skills/ | 직접 fetch 가능. Gemini 전용 공식 교육 사이트가 없어 가장 가까운 Google AI 공식 학습 허브로 대체 |

### 교육 사이트 커리큘럼 커버리지 로그

**이 섹션은 `auto-search` 루틴이 직접 관리한다.** Discovery Keywords와 동일한 상태 관리 패턴을 따른다.

- `PENDING`: 발견했지만 아직 질문으로 사용하지 않음.
- `COVERED`: 이미 질문으로 사용함. "최근 사용일"을 갱신하고, 다음 라운드로빈에서는 가장 오래전에 사용된 항목을 우선한다.

에이전트는 매 실행마다 배분된 사이트에서 커리큘럼 주제를 1~2개 발견해 이 표에 `PENDING`으로 추가한 뒤, 그중 하나를 질문 생성에 사용하고 `COVERED`로 갱신한다.

| 주제 | 사이트 | 레슨/섹션 URL | 상태 | 매핑된 위키 페이지 ID | 최근 사용일 |
|------|--------|--------------|------|---------------------|-----------|
| (초기 상태 — 첫 실행에서 채워짐) | | | | | |

## Discovery Sources

에이전트가 새 주제를 탐색할 때 참조하는 공식 소스 목록.
실행 시마다 아래 소스의 changelog, "What's New", 릴리스 노트를 확인한다.

| 도구 | 탐색 소스 |
|------|----------|
| Claude Code | docs.anthropic.com/ko/docs/claude-code, github.com/anthropics/claude-code (releases) |
| Codex CLI | github.com/openai/codex (README, releases, CHANGELOG) |
| Gemini CLI | github.com/google-gemini/gemini-cli (README, releases) |
| MCP | modelcontextprotocol.io, github.com/modelcontextprotocol/servers |
| Claude API | docs.anthropic.com/ko/docs (API reference, changelog) |
| 공통 | 각 도구의 공식 블로그 발표 글 (새 기능 추가 시) |

## Keyword Harvest Sources

에이전트가 매 실행 시 최신 뉴스·블로그를 스캔해 새 키워드를 자동 추출하는 소스 목록이다.
**소스 목록 자체는 사람이 관리한다.** 에이전트는 "마지막 확인일"만 업데이트한다.

추출 기준: 위키 범위 기준(Scope Intent)에 부합하는 기능명·워크플로우명·개념명만 추가한다.
중복 방지: 추가 전에 기존 Discovery Keywords와 대조해 이미 있는 항목은 건너뛴다.

| 이름 | URL | 확인 대상 | 마지막 확인일 |
|------|-----|----------|------------|
| Anthropic Blog | https://www.anthropic.com/news | Claude, Claude Code 신기능 발표 | 2026-08-25 |
| OpenAI Blog | https://openai.com/blog | Codex, GPT, API, 에이전트 신기능 | 2026-08-25 |
| Google DeepMind Blog | https://deepmind.google/discover/blog | Gemini, AI 에이전트 신기능 | 2026-08-25 |
| Simon Willison's Blog | https://simonwillison.net | AI 도구 실용 사용법, 신기능 리뷰 | 2026-08-25 |
| HuggingFace Blog | https://huggingface.co/blog | 오픈소스 AI, 에이전트, LLM 도구 | 2026-08-25 |
| Claude Code Releases | https://github.com/anthropics/claude-code/releases | Claude Code 릴리스 노트 | 2026-08-25 |
| Codex CLI Releases | https://github.com/openai/codex/releases | Codex CLI 릴리스 노트 | 2026-08-25 |
| Gemini CLI Releases | https://github.com/google-gemini/gemini-cli/releases | Gemini CLI 릴리스 노트 | 2026-08-25 |
| MCP Servers | https://github.com/modelcontextprotocol/servers | MCP 공식 서버 신규 추가분 | 2026-08-25 |

### 카테고리 배정 기준

추출된 키워드를 어느 Discovery Keywords 카테고리에 넣을지 판단하는 기준.

| 주제 특성 | 배정 카테고리 |
|----------|------------|
| Claude Code / Claude CLI 기능 | Claude Code / Claude CLI |
| Codex CLI 기능 | Codex CLI |
| Gemini CLI 기능 | Gemini CLI |
| MCP 서버·프로토콜 관련 | MCP |
| 프롬프트 기법·에이전트 개념·API | AI 개발 공통 개념 |
| 앱 제작·바이브 코딩 워크플로우 | 바이브 코딩 / 앱 개발 패턴 |

### 우선순위 배정 기준

| 소스 유형 | 우선순위 |
|----------|---------|
| 공식 블로그 주요 기능 발표 | 높음 |
| GitHub 릴리스 노트 신규 기능 | 중간 |
| 커뮤니티 블로그·실용 가이드 | 낮음 |

## Keyword Harvest Log

**이 섹션은 에이전트가 직접 관리하는 수확 로그다. 사람이 수동으로 편집할 필요 없다.**

에이전트는 Keyword Harvest 단계에서 새로 추출·추가한 키워드를 이 로그에 기록한다.
Discovery Keywords 카테고리에 이미 추가되었으므로, 이 로그는 이력 추적 목적이다.

| 키워드 | 카테고리 | 우선순위 | 소스 URL | 수확일 |
|--------|---------|---------|---------|-------|
| Gemini CLI multimodal file input | Gemini CLI | 중간 | https://github.com/google-gemini/gemini-cli/blob/main/docs/tools/file-system.md | 2026-05-28 |
| Gemini CLI Google Search grounding | Gemini CLI | 중간 | https://github.com/google-gemini/gemini-cli/blob/main/docs/tools/web-search.md | 2026-05-28 |
| Gemini CLI code execution shell | Gemini CLI | 중간 | https://github.com/google-gemini/gemini-cli/blob/main/docs/tools/shell.md | 2026-05-28 |
| Gemini CLI context compression session | Gemini CLI | 중간 | https://github.com/google-gemini/gemini-cli/blob/main/docs/cli/session-management.md | 2026-05-28 |
| MCP prompt templates | MCP | 중간 | https://modelcontextprotocol.io/specification/2025-06-18/server/prompts | 2026-05-28 |
| MCP transport stdio HTTP | MCP | 중간 | https://modelcontextprotocol.io/specification/2025-11-25/architecture | 2026-05-28 |
| MCP server debugging | MCP | 중간 | https://modelcontextprotocol.io/docs/tools/debugging | 2026-05-28 |
| modal Vim editing | Codex CLI | 중간 | https://github.com/openai/codex/releases | 2026-05-12 |
| plugin URL | Claude Code / Claude CLI | 중간 | https://github.com/anthropics/claude-code/releases | 2026-05-12 |
| Auto Memory inbox flow | Gemini CLI | 중간 | https://github.com/google-gemini/gemini-cli/releases | 2026-05-12 |
| /goal command | Claude Code / Claude CLI | 높음 | https://github.com/anthropics/claude-code/releases | 2026-05-14 |
| Agent View (claude agents) | Claude Code / Claude CLI | 높음 | https://github.com/anthropics/claude-code/releases | 2026-05-14 |
| codex remote-control | Codex CLI | 중간 | https://github.com/openai/codex/releases | 2026-05-14 |
| subagent protocol local remote | AI 개발 공통 개념 | 중간 | https://github.com/google-gemini/gemini-cli/releases | 2026-05-14 |
| codex mcp-server deprecation app-server migration | Codex CLI | 높음 | https://openai.com/products/release-notes/ | 2026-08-25 |
| Codex Appshots | Codex CLI | 중간 | https://learn.chatgpt.com/docs/appshots | 2026-08-25 |
| /export markdown | Codex CLI | 중간 | https://github.com/openai/codex/releases/tag/rust-v0.148.0 | 2026-08-25 |
| codex exec fork archive restore sessions | Codex CLI | 중간 | https://github.com/openai/codex/releases/tag/rust-v0.148.0 | 2026-08-25 |
| hooks async MCP tools | Codex CLI | 높음 | https://github.com/openai/codex/releases/tag/rust-v0.148.0 | 2026-08-25 |
| generative AI basics LLM token Transformer | AI 개발 공통 개념 | 높음 | https://ai.google/learn-ai-skills/ | 2026-08-25 |
| ChatGPT first use files web search image generation | AI 개발 공통 개념 | 높음 | https://learn.chatgpt.com/docs/quickstart | 2026-08-25 |
| Claude Code /usage loops breakdown | Claude Code / Claude CLI | 중간 | https://github.com/anthropics/claude-code/releases/tag/v2.1.243 | 2026-08-25 |
| Claude Code modelPicker setting | Claude Code / Claude CLI | 중간 | https://github.com/anthropics/claude-code/releases/tag/v2.1.243 | 2026-08-25 |
| Claude Code promptCacheTtl subagentPromptCacheTtl | Claude Code / Claude CLI | 중간 | https://github.com/anthropics/claude-code/releases/tag/v2.1.243 | 2026-08-25 |

### 2026-08-25 weekly run3 실행 요약

이번 실행은 Writer Agent 결과를 취합해 신규 페이지 2건을 Index에 연결하고, 같은 날짜에 수확된 Claude/Codex 키워드 상태를 실제 처리 결과에 맞게 정리했다.

- 생성 2건: 211025987 (`[Guide] Codex Hooks 비동기 실행과 MCP 도구 연동`), 211124313 (`[Guide] SFOOD 디자인 시스템 설치와 Claude Code 연결`).
- 업데이트 3건: 97124360, 144277549, 198475778.
- Index 업데이트 2건: Codex Index(63995906), Tool Index(87851100).
- Codex v0.148.0의 `/export` Markdown, `codex exec fork` archive/restore sessions, async hooks + MCP tools를 Discovery Keywords에 SEARCHED로 반영하고 Harvest Log에 추가.
- Claude Code `modelPicker`와 `promptCacheTtl`/`subagentPromptCacheTtl`은 SEARCHED로 정리했고, `/usage loops breakdown`은 billing/cost 범위라 `MANUAL_REVIEW_REQUIRED`로 유지.
- Approval Queue `AQ-2026-08-25-001`은 blank status라 처리하지 않았고, `AQ-2026-08-12-001` rejected 항목도 14일 미만이라 활성 큐에 유지.
- `wiki.metadata` Content Property는 이번 실행에서도 접근 경로가 없어 페이지별 WARN으로 기록.
- Guide Synthesis는 accessible metadata로 docType cluster를 검증할 수 없어 생성하지 않음.

### 2026-08-25 weekly 재실행 요약

현재 정책에 따라 Content Property API 실패를 페이지 생성 보류 사유로 사용하지 않고 안전한 PENDING 갭을 처리했다.
- 생성 2건: 211714073 (`[Guide] 생성형 AI 기초: LLM이 텍스트를 만드는 원리`), 211746842 (`[Guide] ChatGPT 처음 시작하기: 대화·파일·웹 검색·이미지 활용`).
- Index 업데이트 2건: Root Guide Index(63045651), Tool Index(87851100).
- `wiki.metadata`는 직접 MCP 승인 차단 및 REST HTTP 000으로 설정하지 못해 페이지 ID와 함께 수동 재시도 항목으로 기록.
- Codex Appshots는 macOS 화면 기록·접근성 권한과 민감한 창 공유를 포함해 `MANUAL_REVIEW_REQUIRED`로 분류.
- Claude Code v2.1.243에서 `/usage` loops breakdown, `modelPicker`, `promptCacheTtl`/`subagentPromptCacheTtl`을 새 PENDING 키워드로 수확.
- Guide Synthesis는 신규 page 문서가 기존 종합 흐름을 대체할 독립적인 3-page 클러스터를 만들지 않아 생성 없음.

### 2026-08-25 weekly 실행 요약

이번 실행은 Index-first 탐색, 최신 Playbook/FAQ/승인 큐 확인, 9개 수확 소스 확인과 중복 분석까지 완료했다.
- 최신 `playbook-analysis.json`의 Graph Engineering 생성 후보는 기존 정식 페이지 202309789와 Tool Index 링크를 확인해 중복 생성하지 않음.
- Codex `mcp-server` 폐기는 기존 app-server 기반 원격 제어 가이드 99090489로 핵심 마이그레이션 경로가 커버되어 신규 페이지 불필요.
- 생성형 AI 기초, ChatGPT 첫 사용, 개발 환경 비교·동기화는 신규 갭으로 확인했으나 `wiki.metadata` Content Property API가 현재 실행 환경에서 차단되어 PENDING으로 등록.
- Guide Synthesis는 Observability 클러스터가 동일 흐름의 `page` 문서 2건에 머물러 조건 미충족.
- Confluence 본문/Index 변경 0건. 메타데이터 없는 변경을 금지하는 정책에 따라 수동 검토로 전환.

### 2026-06-11 weekly 실행 요약

이번 실행(2026-06-11)에서 신규 키워드 추가 없음. Writer Agent 결과: 생성 2건, 업데이트 0건.
- other 도메인: 2건 CREATED
  - 126779541 ([Guide] 구조화된 로깅 및 에러 핸들링 아키텍처 가이드) — structlog, pino, RFC 7807, OpenTelemetry 기반 구조화 로깅·에러 핸들링 아키텍처
  - 127893507 ([Guide] Confluence MCP로 위키 페이지 자동 생성 및 유지보수하기) — Confluence REST API v2 + MCP 위키 자동화 워크플로우
- claude 도메인: 처리 0건 (갭 없음)
- codex 도메인: 처리 0건 (갭 없음)
- Guide Synthesis: 조건 미충족 — Observability 클러스터(126124123+126779541) page 타입 2건으로 3개 미만. PENDING 후보 등록 완료.
- Index 업데이트: Tool Index(87851100) — 126779541, 127893507 링크 추가 (버전 23)
- Manual Review 이월: 3건 MANUAL_REVIEW_REQUIRED (PII 마스킹 2건 + MCP 보안 아키텍처 1건)

### 2026-06-10 weekly 실행 요약

이번 실행(2026-06-10)에서 신규 키워드 추가 없음. Writer Agent 결과: 생성 1건, 업데이트 1건.
- other 도메인: 1건 CREATED (126124123 — 분산 추적/Microservices 디버깅 가이드), 1건 MANUAL_REVIEW_REQUIRED 이월 (프로덕션 API 에러 처리/PII 마스킹)
- claude 도메인: 1건 SECTION_UPDATE (119930898 — Claude Code vs Codex 심화 비교 ROI/팀별 도입 비용/마이그레이션 전략 섹션 추가)
- codex 도메인: 처리 0건 (갭 없음)
- Guide Synthesis: 조건 미충족 — 신규 page 타입 클러스터 3개 미만 (other 신규 1건 page 타입, 클러스터 형성 불가)
- Index 업데이트: Tool Index(87851100) — 126124123 링크 추가; Claude Code Index(66846748) — 119930898 기존 등록 확인(변경 없음)
- Manual Review 이월: gap-result.json 기준 11건 (security_sensitive 9건 + billing 1건 + PII 마스킹 1건)

### 2026-06-09 weekly 실행 요약

이번 실행(2026-06-09)에서 신규 키워드 추가 없음. Writer Agent 결과: 생성 0건, 업데이트 0건.
- other 도메인: 1건 SKIPPED (바이브코딩 시작하기 → 기존 99745908 커버 재확인), 1건 MANUAL_REVIEW_REQUIRED 신규 등록 (구조화된 로깅/PII 마스킹/에러 핸들링 아키텍처 → policy.md PII 자동 생성 금지)
- claude 도메인: 처리 0건 (갭 없음)
- codex 도메인: 처리 0건 (갭 없음)
- Guide Synthesis: 조건 미충족 — 신규 page 타입 클러스터 없음 (이번 주 신규 페이지 0건)
- Index 업데이트: 신규 페이지 없음, 업데이트 불필요
- Manual Review 이월: gap-result.json 기준 10건 (security_sensitive 8건 + billing 1건 + Legacy DB 보안 1건)

### 2026-06-08 weekly 실행 요약

이번 실행(2026-06-08)에서 신규 키워드 추가 없음. Writer Agent 결과: 생성 0건, 업데이트 0건 (모든 갭이 이전 실행에서 처리 완료됨).
- Index 검증: Tool Index(87851100)에서 이전 실행 이월 2건 등록 확인
  - 121503761 ([Guide] Confluence MCP 연동 및 인증 오류 해결 가이드) → Tool Index "AI 개념 문서" 및 "MCP 도구 탐색 흐름" 섹션에 등록 확인
  - 121667594 ([Guide] MCP 대용량 데이터 처리 및 배치 처리 최적화 가이드) → Tool Index "AI 개념 문서" 섹션에 등록 확인
- Guide Synthesis: 조건 미충족 — 신규 page 타입 클러스터 없음 (이번 주 신규 페이지 없음)
- Manual Review: gap-result.json에서 9건 확인 (security_sensitive 7건, billing 1건, legacy DB 보안 1건)
- wiki.metadata 미설정 2건(121503761, 121667594)은 Step 4.5(curl 기반) 별도 처리 예정

### 2026-06-07 weekly 실행 요약

이번 실행(2026-06-07)에서 신규 키워드 추가 없음. 오늘 Writer Agent 결과: 생성 0건, 업데이트 0건 (모든 갭이 2026-06-06에 이미 처리됨).
- Index 검증: 2026-06-06 생성/업데이트 6개 페이지 모두 해당 Index에 등록 확인 (추가 작업 불필요)
  - 121503807 → Claude Code Index (66846748) 등록 확인
  - 121503761 → Tool Index (87851100) 등록 확인
  - 121667594 → Tool Index (87851100) 등록 확인
  - 95780877 → Claude Code Index (66846748) 등록 확인
  - 119767058 → Claude Code Index (66846748) 등록 확인
  - 106791002 → Claude Code Index (66846748) 등록 확인
- Guide Synthesis: 조건 미충족 — 신규 page 타입 클러스터 없음 (이번 주 신규 페이지 전부 guide 타입)
- Approval Queue: 활성 항목 없음

### 2026-06-06 weekly 실행 요약

이번 실행(2026-06-06)에서 신규 키워드 추가 없음. playbook-analysis 기반 갭 처리:
- Claude Code: `hooks 디버깅` → 121503807 생성 ([Guide] Claude Code Hook 디버깅 및 초보자 문제 해결 가이드, 4회 반복 검색 해소)
- Claude Code: `worktrees` → 95780877 업데이트 (git worktree 비교 섹션 추가)
- Claude Code: `performance` → 119767058 업데이트 (배치처리/메모리 섹션 추가)
- Claude Code: `prompt caching` → 106791002 업데이트 (SDK 예시/비용 계산 추가)
- MCP: `confluence mcp` → 121503761 생성 ([Guide] Confluence MCP 연동 및 인증 오류 해결 가이드, 3회 반복 검색 해소)
- MCP: `mcp batch processing` → 121667594 생성 ([Guide] MCP 대용량 데이터 처리 및 배치 처리 최적화 가이드, 2회 반복 검색 해소)
- 스킵(기존 커버): 커스텀 MCP 서버 개발 (119799815), 바이브코딩 시작하기 (99745908)
- Guide Synthesis: 조건 미충족 — 신규 page 타입 문서 3개 중 관련 클러스터 3개 미만, MCP 심화 가이드(112853084) 이미 존재
- Index 업데이트: Claude Code Index(66846748) — 121503807 링크 추가 / Tool Index(87851100) — 121503761, 121667594 링크 추가

### 2026-06-05 weekly run2 실행 요약

이번 실행(2026-06-05 run2)에서 신규 키워드 추가 없음. playbook-analysis 기반 갭 처리:
- Claude Code: `테스트 자동화/커버리지 관리` → 120324116 생성 ([Guide] Claude Code 다중 테스트 프레임워크 관리 및 커버리지 전략, 3회 반복 검색 해소)
- Claude Code: `claude worktree / git worktree` → 95780877 업데이트 (git worktree 명령어 상세 설명 섹션 추가, 7회 반복 검색 해소)
- Guide Synthesis: 조건 미충족 — 이번 실행 신규 문서가 guide 타입이며 page 타입 클러스터 없음
- Index 업데이트: Claude Code Index (66846748) — 120324116 링크 추가

### 2026-06-05 weekly 실행 요약

이번 실행(2026-06-05)에서 신규 키워드 추가 없음. playbook-analysis 기반 갭 처리:
- Claude Code: `Claude Code vs Codex 비교` → 119930898 생성 (12회 반복 검색 해소)
- Claude Code: `Claude Code 성능 최적화` → 119767058 생성 (3회 반복 검색 해소)
- Claude Code: `Claude Code Worktrees` → 95780877 업데이트 (git worktree vs claude worktrees 비교 섹션 추가, 5회 반복 검색 해소)
- Claude Code: `프롬프트 캐싱 SDK 구현` → 106791002 업데이트 (TypeScript SDK 예시 및 hit rate 모니터링 추가)
- MCP: `MCP 커스텀 서버 개발` → 119799815 생성 (3회 반복 검색 해소)
- 바이브코딩: 기존 페이지로 커버 확인 (covered_by_existing: 99745908, 114229376, 114295062)
- Guide Synthesis: 조건 미충족 (이번 주 신규 문서 전부 guide 타입, page 타입 클러스터 없음)

### 2026-06-04 weekly 실행 요약

이번 실행(2026-06-04)에서 신규 키워드 추가 없음. 기존 키워드 상태 갱신:
- MCP: `MCP sampling` → DEPRECATED (프로토콜 버전 2026-07-28부터 폐기 예정 공식 확인)
- 바이브 코딩 / 앱 개발 패턴 8개 키워드 → SEARCHED (기존 페이지로 모두 커버 확인: 114229376, 114163769, 114131015, 114131046, 114163818, 114294946, 114295062)
- Codex CLI: v0.137.0 릴리스 노트 검토 완료. 신규 키워드 없음 (F13-F24 확장 키, 앱-서버 v2 RPCs는 기존 페이지 업데이트로 반영)
- Gemini CLI: gemini-cli 공식 문서 검토 완료. 신규 키워드 없음 (inactivityTimeout, maxCount, /chat 별칭은 기존 페이지 업데이트로 반영)

### 2026-05-29 weekly 실행 요약

이번 실행(2026-05-29)에서 신규 키워드 추가 없음. 기존 PENDING 키워드 상태 갱신:
- Codex: `reasoning effort` → SEARCHED (기존 페이지 99680336 커버 확인)
- Gemini: `memory` → SEARCHED (기존 페이지 98500657 커버 확인)
- Gemini: `checkpointing` → SEARCHED (기존 페이지 112361587 관련 커버 확인)
- Gemini: `model selection` → SEARCHED (기존 Gemini CLI 가이드에서 암묵적 커버 확인)
- AI 개발 공통: `embedding vector database`, `context management`, `system prompt`, `few shot prompting`, `structured output JSON mode`, `chain of thought`, `streaming response`, `batch API` → SEARCHED (기존 페이지들로 커버 확인: 106791034, 106889283, 106692684, 106889316, 106692653, 100040781, 98173006)
- MCP: `MCP sampling` → PENDING 유지 (기존 페이지 없음, 공식 소스 유효, 낮은 우선순위)
- 바이브 코딩 / 앱 개발 패턴 8개 키워드 → PENDING 유지 (전용 페이지 생성 필요)

## 에이전트 발견 주제 (Agent-Discovered Topics)

**이 섹션은 에이전트가 직접 관리하는 실행 로그다. 사람이 여기에 항목을 추가할 필요 없다.**

에이전트는 Gap Analysis 단계에서 발견한 주제를 이 섹션에 기록한다:
- `CREATED`: 이번 실행에서 페이지 생성 완료 (페이지 ID 포함)
- `PENDING`: 발견했지만 이번 실행에서 미처리 → 다음 실행에서 자동 처리
- `MANUAL_REVIEW_REQUIRED`: 자동 생성 불가, 수동 검토 필요
- `SKIPPED`: 범위 외로 판단해 제외

에이전트는 실행할 때마다 `PENDING` 항목을 먼저 처리한 뒤, 새 갭을 탐색한다.

| 주제 | 발견 날짜 | 소스 | Confluence 페이지 ID | 상태 |
|------|----------|------|---------------------|------|
| Claude Code Plugin Setup | 2026-05-12 | https://code.claude.com/docs/en/discover-plugins | 94601252 | CREATED |
| Claude Code Commands | 2026-05-12 | https://code.claude.com/docs/en/commands; https://code.claude.com/docs/en/slash-commands | 95191048 | CREATED |
| Claude Code Skills | 2026-05-12 | https://code.claude.com/docs/en/slash-commands | 95715350 | CREATED |
| Claude Code Subagents | 2026-05-12 | https://code.claude.com/docs/en/sub-agents | 95682566 | CREATED |
| Claude Code Memory | 2026-05-12 | https://code.claude.com/docs/en/memory | 95846403 | CREATED |
| Claude Code Hooks | 2026-05-12 | https://code.claude.com/docs/en/hooks | 95748098 | CREATED |
| Claude Code MCP | 2026-05-12 | https://code.claude.com/docs/en/mcp | 95682591 | CREATED |
| Claude Code Sessions | 2026-05-12 | https://code.claude.com/docs/en/sessions | 95715380 | CREATED |
| Claude Code Worktrees | 2026-05-12 | https://code.claude.com/docs/en/worktrees | 95780877 | CREATED |
| Claude Code Fullscreen Rendering | 2026-05-12 | https://code.claude.com/docs/en/fullscreen | 95748126 | CREATED |
| Claude Code Checkpointing | 2026-05-12 | https://code.claude.com/docs/en/checkpointing | 95846431 | CREATED |
| Claude Code Context Window | 2026-05-12 | https://code.claude.com/docs/en/context-window | 95387665 | CREATED |
| Codex CLI Authentication Guidance | 2026-05-12 | https://help.openai.com/en/articles/11096431-openai-codex-cli-getting-started; https://help.openai.com/en/articles/11381614 | | MANUAL_REVIEW_REQUIRED |
| Codex Plugin Management | 2026-05-12 | https://github.com/openai/codex/releases | | MANUAL_REVIEW_REQUIRED |
| AI 작업용 Node.js 개발 환경 준비하기 | 2026-05-12 | https://sfoodxproject.atlassian.net/wiki/spaces/AIAW/pages/90669057 | 95387778 | CREATED |
| 기본 개발 도구 준비 가이드 | 2026-05-12 | https://sfoodxproject.atlassian.net/wiki/spaces/AIAW/pages/90669057 | | SKIPPED — 기존 설정 가이드(Node.js, npm, Python 등)가 Tool Index에 충분히 커버됨. 범용 도구 준비 가이드로 추가 가치 낙음 (2026-05-14) |
| [Guide] Claude Code로 Pull Request 검토하기 | 2026-05-14 | https://docs.anthropic.com/en/docs/claude-code/github-actions | 98992134 | CREATED |
| [Guide] Codex remote-control로 헤드리스 에이전트 배포하기 | 2026-05-14 | https://github.com/openai/codex/releases; https://github.com/openai/codex/blob/main/codex-rs/app-server/README.md | 99090489 | CREATED |
| [Guide] Model Context Protocol (MCP) 개요 및 아키텍처 | 2026-05-14 | https://modelcontextprotocol.io/introduction; https://github.com/modelcontextprotocol/modelcontextprotocol | 98173006 | CREATED |
| [Guide] Gemini CLI 슬래시 명령 완전 가이드 | 2026-05-14 | https://github.com/google-gemini/gemini-cli/blob/main/docs/reference/commands.md | 99057689 | CREATED |
| [Guide] Gemini CLI Auto Memory와 /memory inbox 활용하기 | 2026-05-14 | https://github.com/google-gemini/gemini-cli/blob/main/docs/cli/auto-memory.md | 98500657 | CREATED |
| [Guide] Subagent 프로토콜: 로컬 실행과 원격 실행 | 2026-05-14 | https://github.com/google-gemini/gemini-cli/blob/main/docs/core/subagents.md | 99090454 | CREATED |
| [Guide] Claude Code로 장기 작업 컨텍스트 관리하기 (guide synthesis) | 2026-05-14 | Memory(95846403)+Sessions(95715380)+Checkpointing(95846431)+ContextWindow(95387665) 합성 | 98992182 | CREATED |
| [Guide] Claude Code 자동화 워크플로우 가이드 (guide synthesis candidate B) | 2026-05-14 | Hooks(95748098)+/goal(97124385)+AgentView(97386498)+Subagents(95682566) 클러스터 | | SKIPPED — 이번 실행에서 Candidate A 선택됨. 기존 페이지 99745989와 중복 확인됨 (2026-05-26) |
| [Guide] Claude Code Plugin URL Configuration | 2026-05-27 | https://docs.anthropic.com/en/docs/claude-code/settings | 107675805 | CREATED — 기존 페이지 [Guide] Claude Code --plugin-url 플래그로 플러그인 설치하기가 이미 커버함 |
| [Guide] Tool Use and Function Calling with Claude | 2026-05-27 | https://docs.anthropic.com/en/docs/agents-and-tools/tool-use/overview | 99680270 | CREATED — 기존 페이지 [Guide] Claude Code와 Tool Use: 함수 호출을 통한 확장이 이미 커버함 |
| [Guide] Computer Use Tool for Autonomous Interaction | 2026-05-27 | https://docs.anthropic.com/en/docs/build-with-claude/computer-use | 100040750 | CREATED — 기존 페이지 [Guide] Claude Code로 데스크톱 자동화: Computer Use 활용이 이미 커버함 |
| [Guide] Claude Code Integration with JetBrains IDEs | 2026-05-27 | https://code.claude.com/docs/en/jetbrains | 97222683 | CREATED — 기존 페이지 [Guide] Claude Code JetBrains 통합이 이미 커버함 |
| [Guide] Claude Code Permissions Model and Access Control | 2026-05-27 | https://docs.anthropic.com/en/docs/claude-code/settings | 99680303 | CREATED — 기존 페이지 [Guide] Claude Code 권한 모델: Ask/Allow/Deny 전략이 이미 커버함 |
| [Guide] Context Window Compaction for Long Sessions | 2026-05-27 | https://docs.anthropic.com/en/docs/build-with-claude/context-windows | 105775108 | CREATED — 기존 페이지 [Guide] Claude Code 컨텍스트 윈도우 압축 관리가 이미 커버함 |
| [Guide] Git Integration and GitHub Actions with Claude Code | 2026-05-27 | https://docs.anthropic.com/en/docs/claude-code/github-actions | 99745875 | CREATED — 기존 페이지 [Guide] Claude Code로 Git 작업 자동화: 커밋, PR, 병합이 이미 커버함 |
| [Guide] Bash Tool and Shell Command Execution | 2026-05-27 | https://docs.anthropic.com/en/docs/agents-and-tools/tool-use/bash-tool | 105775135 | CREATED — 기존 페이지 [Guide] Claude Code Bash 도구 완전 가이드가 이미 커버함 |
| [Guide] Customizing Keybindings in Claude Code | 2026-05-27 | https://docs.anthropic.com/en/docs/claude-code/settings | 105644048 | CREATED — 기존 페이지 [Guide] Claude Code 키바인딩 커스터마이징이 이미 커버함 |
| [Guide] Model Selection and Switching in Claude Code | 2026-05-27 | https://docs.anthropic.com/en/docs/claude-code/settings | 107708613 | CREATED — 기존 페이지 [Guide] Claude 모델 선택 가이드: Opus, Sonnet, Haiku 비교가 이미 커버함 |
| [Guide] Claude Code Settings and Configuration | 2026-05-27 | https://docs.anthropic.com/en/docs/claude-code/settings | 97124360 | CREATED — 기존 페이지 [Guide] Claude Code 환경 변수 및 settings.json 설정이 이미 커버함 |
| [Guide] Codex CLI 셸 명령 실행 가이드 | 2026-05-27 | https://github.com/openai/codex | 110690375 | CREATED |
| [Guide] Codex CLI 환경 변수 설정 가이드 | 2026-05-27 | https://github.com/openai/codex | 110559276 | CREATED |
| [Guide] MCP 서버 디렉터리와 서버 탐색 | 2026-05-27 | https://github.com/modelcontextprotocol/servers | 110395457 | CREATED |
| [Guide] MCP Resources: 데이터와 파일 접근 패턴 | 2026-05-27 | https://modelcontextprotocol.io/specification/2025-11-25/architecture | 110395496 | CREATED |
| [Guide] 프롬프트 엔지니어링 기초 | 2026-05-27 | https://docs.anthropic.com/en/docs/build-with-claude/prompt-engineering/overview | 110690410 | CREATED |
| [Guide] Codex CLI 명령 실행 환경 완전 설정: Sandbox부터 환경 변수까지 (guide synthesis) | 2026-05-27 | Sandbox(97419267)+Shell(110690375)+EnvVars(110559276) 합성 | 110592057 | CREATED |
| [Guide] MCP Prompt Templates and Automation | 2026-05-27 | https://modelcontextprotocol.io/specification/2025-06-18/server/prompts | 111804571 | CREATED |
| [Guide] MCP Transport Protocols: stdio and HTTP | 2026-05-27 | https://modelcontextprotocol.io/specification/2025-11-25/architecture | 112361624 | CREATED |
| [Guide] Gemini CLI Extensions and Plugins | 2026-05-27 | https://github.com/google-gemini/gemini-cli | 108462145 | CREATED — 기존 페이지 [Guide] Gemini CLI Extensions: 기능 확장 및 커스터마이징이 이미 커버함. 다음 사이클에서 중복 확인 |
| [Guide] Gemini CLI 멀티모달 파일 입력: 이미지, PDF, 문서 활용하기 | 2026-05-28 | https://github.com/google-gemini/gemini-cli/blob/main/docs/tools/file-system.md | 112590980 | CREATED |
| [Guide] Gemini CLI Google Search Grounding: 실시간 정보 검색 활용하기 | 2026-05-28 | https://github.com/google-gemini/gemini-cli/blob/main/docs/tools/web-search.md | 112591015 | CREATED |
| [Guide] Gemini CLI 코드 실행 및 셸 명령 활용하기 | 2026-05-28 | https://github.com/google-gemini/gemini-cli/blob/main/docs/tools/shell.md | 112361554 | CREATED |
| [Guide] Gemini CLI 컨텍스트 압축과 세션 관리 | 2026-05-28 | https://github.com/google-gemini/gemini-cli/blob/main/docs/cli/session-management.md | 112361587 | CREATED |
| [Guide] MCP 서버 디버깅과 문제 해결 가이드 | 2026-05-28 | https://modelcontextprotocol.io/docs/tools/debugging | 112591048 | CREATED |
| [Guide] Gemini CLI 핵심 기능 완전 정복 (guide synthesis) | 2026-05-28 | 멀티모달(112590980)+Google Search(112591015)+코드 실행(112361554)+세션 관리(112361587) 합성 | 112296101 | CREATED |
| [Guide] MCP 클러스터 guide synthesis (MCP 심화 워크플로우) | 2026-05-29 | Prompt Templates(111804571)+전송 프로토콜(112361624)+서버 디버깅(112591048) 클러스터 합성 | 112853084 | CREATED |
| [Guide] 바이브 코딩 / 앱 개발 패턴 (vibe coding personal app 등 8개 키워드) | 2026-05-29 | 다음 사이클 처리 예정 — 기존 암묵적 커버(99745908, 96403574, 99680270)로는 부족, 전용 가이드 필요 | | SKIPPED — 2026-06-04 확인: Claude Code Index "바이브 코딩 / 앱 개발 워크플로우" 섹션과 종합 가이드(114295062)로 모두 커버됨. 개별 페이지 114229376, 114163769, 114131015, 114131046, 114163818, 114294946 기존 존재 확인 |
| [Guide] Claude Code vs Codex 도구 비교 및 선택 가이드 | 2026-06-05 | playbook-analysis 2026-06-05: 12회 반복 검색 (06-02, 06-04, 06-05). 기능 차이·모델 성능·시나리오별 선택 기준 | 119930898 | CREATED |
| [Guide] Claude Code 성능 최적화 및 느린 응답 해결 가이드 | 2026-06-05 | playbook-analysis 2026-06-05: 3회 반복 검색 (06-02, 06-04). claude doctor→/compact→settings.json 트러블슈팅 흐름 | 119767058 | CREATED |
| [Guide] MCP 커스텀 서버 개발 가이드 (TypeScript/Python) | 2026-06-05 | playbook-analysis 2026-06-05: 3회 반복 검색 (06-02). MCP SDK 기반 TypeScript/Python 커스텀 서버 구현 | 119799815 | CREATED |
| [Guide] Claude Code Worktrees — git worktree 섹션 추가 | 2026-06-05 | playbook-analysis 2026-06-05: 7회 반복 실패 (06-04). git worktree vs Claude Code isolation worktree 구분 섹션 update_guide | 95780877 | CREATED |
| [Guide] Claude Code 다중 테스트 프레임워크 관리 및 커버리지 전략 | 2026-06-05 | playbook-analysis 2026-06-05: 3회 반복 실패 (06-05). Jest·pytest·Mocha 다중 프레임워크 통합 관리 및 커버리지 70% 유지 전략 create_guide | 120324116 | CREATED |
| [Guide] Claude Code Hook 디버깅 및 초보자 문제 해결 가이드 | 2026-06-06 | playbook-analysis 2026-06-06: 4회 반복 발생 (06-06). Hook 미실행·잘못된 이벤트 트리거 디버깅 절차 및 초보자 체크리스트 create_guide | 121503807 | CREATED |
| [Guide] Confluence MCP 연동 및 인증 오류 해결 가이드 | 2026-06-06 | playbook-analysis 2026-06-06: 3회 반복 발생 (06-02, 06-04). Confluence MCP Setup, API 토큰/OAuth 인증, 권한 오류 해결 create_guide | 121503761 | CREATED |
| [Guide] MCP 대용량 데이터 처리 및 배치 처리 최적화 가이드 | 2026-06-06 | playbook-analysis 2026-06-06: 2회 반복 발생 (06-05, 06-06). 배치 처리·스트리밍·메모리 효율화·페이지네이션 패턴 create_guide | 121667594 | CREATED |
| 커스텀 MCP 서버 개발 가이드 (TypeScript/Python) — 스킵 재확인 | 2026-06-06 | playbook-analysis 2026-06-06: 기존 119799815 ([Guide] MCP 커스텀 서버 개발 가이드)로 커버 확인 | 119799815 | SKIPPED — 2026-06-06: 기존 페이지 119799815로 커버됨. 신규 생성 불필요 |
| 바이브코딩 시작하기 — 스킵 재확인 | 2026-06-06 | playbook-analysis 2026-06-06: 기존 99745908 ([Guide] Vibe Coding 워크플로우)으로 커버 확인 | 99745908 | SKIPPED — 2026-06-06: 기존 페이지 99745908로 커버됨. 신규 생성 불필요. 2026-06-09 재확인: write-result-other.json 에서도 동일하게 SKIPPED 처리 확인. |
| 구조화된 로깅/PII 마스킹/에러 핸들링 아키텍처 통합 가이드 | 2026-06-09 | playbook-analysis 2026-06-09: 06-08, 06-09 2회 반복 (source: Playbook 121733401). PII 마스킹 구현 내용 포함. | | MANUAL_REVIEW_REQUIRED — PII 마스킹 포함, policy.md 보안·PII 자동 생성 금지. IT 아키텍트 및 보안 담당자 검토 선행 필요. 검토 범위: (1) 구조화된 로깅 포맷(JSON) 및 로그 수준 정책, (2) PII 자동 마스킹 구현 패턴, (3) 에러 코드 일관성 기준. |
| [Guide] 분산 추적과 Microservices 디버깅: Correlation ID 전파와 OpenTelemetry 통합 | 2026-06-10 | playbook-analysis 2026-06-10: source Playbook 125042714. 마이크로서비스 간 correlation ID 전파 및 OpenTelemetry 분산 추적 파이프라인 구성. source: https://opentelemetry.io/docs/languages/js/getting-started/nodejs/ | 126124123 | CREATED |
| 프로덕션 API 에러 처리 및 구조화 로깅 패턴 (PII 마스킹 포함) | 2026-06-10 | playbook-analysis 2026-06-10: source Playbook 123273217. PII 마스킹 구현 패턴 포함. 2026-06-09 이력 동일 주제 MANUAL_REVIEW_REQUIRED 이월. | | MANUAL_REVIEW_REQUIRED — PII 마스킹 포함, policy.md 보안·PII 자동 생성 금지. 보안 담당자 및 IT 아키텍트 검토 후 승인 시 생성. 검토 범위: (1) 구조화된 로깅 포맷(JSON), (2) PII 자동 마스킹 구현 패턴, (3) 레이어별 에러 처리 전략. Ops Approval Queue(120520705) 등록 권장. |
| MCP 엔터프라이즈 보안 아키텍처: zero-trust 런타임 권한 검증과 감사 로깅 | 2026-06-10 | playbook-analysis 2026-06-10: source Playbook 125042714. zero-trust 권한 검증, 금융/ISMS/GDPR 규정 준수 포함. HIGH priority. | | MANUAL_REVIEW_REQUIRED — safety_sensitive. IT 보안팀 또는 보안 아키텍트와 협의 후 작성. 규제 준수(ISMS/GDPR/금융보안법) 검토 필수. |
| [Guide] 구조화된 로깅 및 에러 핸들링 아키텍처 가이드 | 2026-06-11 | write-result-other.json 2026-06-11: source https://www.structlog.org/en/stable/, https://getpino.io/, https://datatracker.ietf.org/doc/html/rfc7807, https://opentelemetry.io/docs/concepts/signals/logs/ | 126779541 | CREATED |
| [Guide] Confluence MCP로 위키 페이지 자동 생성 및 유지보수하기 | 2026-06-11 | write-result-other.json 2026-06-11: source https://developer.atlassian.com/cloud/confluence/rest/v2/intro/, https://developer.atlassian.com/cloud/confluence/cql-fields/, https://modelcontextprotocol.io/introduction | 127893507 | CREATED |
| [Guide] Observability 통합 가이드 — 구조화 로깅·분산 추적·에러 핸들링 완전 정복 (guide synthesis candidate) | 2026-06-11 | 분산 추적(126124123)+구조화 로깅(126779541) 클러스터. 3번째 page 문서 추가 시 guide synthesis 가능. | | PENDING — 현재 page 타입 2건으로 조건 미충족(3개 이상 필요). 다음 실행 시 Observability 관련 page 문서 추가 여부 확인 후 재평가. |
| [Guide] Graph Engineering 개념 및 AI 개발 활용 가이드 — 중복 후보 재확인 | 2026-08-25 | playbook-analysis 2026-08-24 create_guide 후보. 기존 페이지와 Tool Index를 실시간 확인. | 202309789 | SKIPPED — 기존 정식 가이드가 이미 존재하며 2026-08-24에 업데이트됨. 신규 생성 불필요. 비공식 출처와 미래 시점 표현은 별도 출처 검토 필요. |
| [Guide] 생성형 AI 기초: LLM이 텍스트를 만드는 원리 | 2026-08-25 | https://ai.google/learn-ai-skills/; https://developers.google.com/machine-learning/crash-course/llm | 211714073 | CREATED — 2026-08-25 weekly 재실행에서 생성. Root Guide Index와 Tool Index에 등록. wiki.metadata 재시도 필요. |
| [Guide] ChatGPT 처음 시작하기: 대화·파일·웹 검색·이미지 활용 | 2026-08-25 | https://learn.chatgpt.com/docs/quickstart; https://learn.chatgpt.com/docs/artifacts-viewer; https://learn.chatgpt.com/docs/web-search; https://learn.chatgpt.com/docs/image-generation | 211746842 | CREATED — 2026-08-25 weekly 재실행에서 생성. Root Guide Index와 Tool Index에 등록. wiki.metadata 재시도 필요. |
| [Guide] Codex Hooks 비동기 실행과 MCP 도구 연동 | 2026-08-25 | https://github.com/openai/codex/releases/tag/rust-v0.148.0 | 211025987 | CREATED — 2026-08-25 weekly run3에서 생성. Codex Index 63995906에 직접 등록. wiki.metadata 재시도 필요. |
| [Guide] SFOOD 디자인 시스템 설치와 Claude Code 연결 | 2026-08-25 | https://www.npmjs.com/package/%40sfood/ui; https://github.com/sfood-it-dev-ax-org/SFOOD-DESIGN-SYSTEM/blob/main/docs/USAGE.md; https://code.claude.com/docs/en/discover-plugins | 211124313 | CREATED — 2026-08-25 weekly run3에서 생성. Tool Index 87851100에 직접 등록. Tailwind preset 상세 코드는 버전 문서 직접 확인 기준으로 유지. wiki.metadata 재시도 필요. |
| [Guide] ChatGPT Appshots 사용 가이드 | 2026-08-25 | https://learn.chatgpt.com/docs/appshots | | MANUAL_REVIEW_REQUIRED — 화면 및 시스템 오디오 기록, 접근성 권한, 민감한 창 공유를 포함하므로 보안·개인정보 검토 후 작성. |
| Claude Code에서 /usage와 /loop 사용량을 함께 읽는 방법 | 2026-08-25 | https://code.claude.com/docs/en/costs | | MANUAL_REVIEW_REQUIRED — billing/cost guidance 범위라 자동 가이드 생성 금지. human approval 후 wording 검토 필요. |
| ERP 접근 권한 신청 절차와 승인 방법 | 2026-08-25 | Playbook 207945729; Approval Queue AQ-2026-08-25-001 | | MANUAL_REVIEW_REQUIRED — Approval Queue blank status 항목으로 유지. 조직별 접근 권한·승인 정책은 담당자 승인 전 자동 처리 금지. |
| Codex Amazon Bedrock provider with AWS profile and region | 2026-08-25 | https://github.com/openai/codex/releases/tag/rust-v0.148.0 | | MANUAL_REVIEW_REQUIRED — AWS 인증, 권한, 과금 검토가 필요하므로 자동 문서화 금지. Approval Queue AQ-2026-08-12-001 rejected 상태를 유지한다. |
| Codex estimated thread credits and cost in /status | 2026-08-25 | https://github.com/openai/codex/releases/tag/rust-v0.148.0 | | MANUAL_REVIEW_REQUIRED — `/status`의 thread credits/cost는 billing-sensitive guidance라 human review 없이 자동 문서화하지 않는다. |
| 개발 환경 차이 진단과 컴퓨터 간 설정 동기화 | 2026-08-25 | Playbook 211058689 | | PENDING — 단일 반복 질문이며 전용 canonical guide가 없음. 추가 반복 여부와 공식 도구별 근거를 다음 실행에서 확인. |
| Graph Engineering 가이드 출처 정합성 검토 | 2026-08-25 | 기존 페이지 202309789 | 202309789 | MANUAL_REVIEW_REQUIRED — 비공식 출처와 2026년형 전망 표현이 포함되어 공식 1차 자료 기반 재검증 필요. |
| Playbook Index 최신 항목 복구 | 2026-08-25 | Playbook Index 63799321; 최신 Playbook 211058689 | 63799321 | MANUAL_REVIEW_REQUIRED — Index가 2026-06-05 이후 항목을 누락. 최신 페이지 직접 조회는 성공했지만 space-scoped CQL 열거가 0건을 반환해 데이터가 불일치하므로, 검색 경로를 복구한 뒤 누락 범위를 확정해 일괄 갱신 권장. |

## Initial Watch Targets

| Tool | Existing Page ID | Index Pages |
|---|---:|---|
| Codex CLI | <not confirmed> | Root Guide Index, Tool Index, Codex Index |
| Claude CLI | 88211499 | Root Guide Index, Tool Index, Claude Code Index |
| Gemini CLI | <not confirmed> | Root Guide Index, Tool Index, Gemini Index |
| Node.js | 64618497 | Root Guide Index, Tool Index |
| npm | 64290859 | Root Guide Index, Tool Index |
| npx | 64290887 | Root Guide Index, Tool Index |
| pnpm | 67928082 | Root Guide Index, Tool Index |
| Browser MCP | 84181346 | Root Guide Index, MCP Index |
| Desktop Control MCP | 84181326 | Root Guide Index, MCP Index |
| AnythingLLM | 87228417 | Root Guide Index, Tool Index |
