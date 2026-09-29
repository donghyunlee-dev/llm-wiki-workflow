# Confluence Guide Maintenance Workflow

## Start

Determine execution mode from the user command.

If no explicit mode is given, use safe review mode.

## Load Rules

Read these files before acting:

- SKILL.md
- commands.md
- policy.md
- source-roles.md
- indexing-rules.md
- recompile-rules.md
- guide-synthesis-rules.md
- validation-checklist.md
- tasks/playbook-expansion.md
- tasks/faq-promotion.md
- tasks/approval-queue.md

## Step: Resolve Index Entry Point

Start from the configured Confluence Index page.
All guide-page discovery must begin from Index pages, and guide pages should be selected through those Index links whenever possible.

Preferred Index order:

- Root Guide Index
- Tool Index
- Agent Index
- Setup Index
- OS-specific Index
- MCP Index

If the required Index page is unknown, ask the user for the page id or use the known page ids from prior context only when explicitly available.

Do not create or update guide pages without an Index entry point.

## Step: Read Existing Wiki Structure

Using Confluence MCP:

- Read the root Index page.
- For weekly mode, also read any related secondary Index pages before selecting targets so additions or renames are visible in the same run.
- Extract guide links.
- Identify canonical guide pages.
- Identify related Index pages.
- Identify metadata when available.

## Step: Select Target Pages

Select target pages according to command mode.

For weekly mode:

- Focus on active AI development guide pages.
- Include Playbook pages and FAQ pages as routine targets when they reveal reusable guide or answer gaps.
- Load the latest `playbook-analysis` artifact when available and treat its safe guide candidates as first-class weekly targets.
- Load the Approval Queue and treat `approved` items as first-class weekly targets.
- Prioritize CLI tools, MCP tools, LLM API tools, and local RAG tools.
- Avoid general news and opinion pages.
- Re-check the root Guide Index and any related Index pages before finishing the run if any page was added, renamed, recompiled, or otherwise materially changed.
- If a page is not reachable from an Index, treat the Index as incomplete and update it in the same run when safe.

For tool mode:

- Select only pages related to the requested tool.

## Step: Playbook and FAQ Routine

For weekly mode, read and process Playbook and FAQ pages before deciding the final update/create targets.

If a recent `playbook-analysis` artifact exists, read it before Gap Analysis and merge the safe guide candidates into the weekly target-selection queue.

## Step: Approval Queue Routine

For weekly mode, read and process the Approval Queue before Gap Analysis and writer execution.

Use `tasks/approval-queue.md`.

Rules:

1. Read the Approval Queue page first.
2. Read the usage section and state legend to interpret queue rows correctly.
3. Treat blank status and `pending` as not approved.
4. Treat `approved` rows as explicit weekly inputs.
5. After a successful weekly update/create action driven by an approved row, mark the row `done`.
6. If processing fails, keep the row in `approved` and append a short failure note.
7. Move stale `done` and `rejected` rows into the History section according to the queue cleanup rules.
8. Preserve a single-page operating model; do not create a new queue page for each run.

### Playbook Expansion

Run `tasks/playbook-expansion.md` when a playbook page contains an incomplete, weak, or unsupported answer that should be turned into a canonical guide or install page.

**금지 사항 (절대 위반 금지):**
- "Playbook Expansion 처리 결과", "처리 결과", "실행 결과" 등 작업 요약 페이지를 Confluence에 생성하지 않는다.
- 런 요약은 로컬 `runs/` 디렉토리에만 기록한다. Confluence에는 정식 가이드/설치 페이지만 생성한다.
- 생성하는 모든 Confluence 페이지 제목은 반드시 `[Guide]` 또는 `[Install]` 접두사로 시작해야 한다.

Workflow:

1. Read the relevant Playbook page first.
2. Read the related Playbook / FAQ Index pages.
3. Search Confluence for an existing canonical guide or install page.
4. Search official documentation.
5. Update the canonical page or create a new guide/install page when safe.
6. Set `wiki.metadata` on every created or updated page.
7. Update every relevant Index page.
8. If official sources conflict or the page should not be automated, create a manual review item instead.
9. Record the result in a structured `playbook-analysis` artifact so weekly mode can reuse the decision without reclassifying the same Playbook row.
10. If the item requires IT or policy approval, add it to the Approval Queue instead of leaving it as an untracked manual-review note.

### FAQ Promotion

Run `tasks/faq-promotion.md` when repeated playbook questions cross the configured promotion threshold and should become a reusable FAQ answer.

Workflow:

1. Read the relevant FAQ page or FAQ Index first.
2. Read the playbook pages that contain the repeated question.
3. Find the canonical guide and install pages that answer the question.
4. Synthesize a short answer from those canonical pages.
5. Update an existing FAQ page or create a new FAQ page when safe.
6. Set `wiki.metadata` with `docType: "page"`.
7. Update every relevant Index page.
8. If the source pages are missing or the answer is still ambiguous, create a manual review item instead.
9. Record FAQ candidates and guide candidates separately in the structured `playbook-analysis` artifact.

## Step: Keyword Harvest

Gap Analysis 전에 실행한다. 최신 AI 뉴스·블로그·릴리스 노트를 스캔해 새 키워드를 Discovery Keywords에 자동으로 추가하는 단계다.

**이 단계의 목적:** Discovery Keywords 목록을 사람의 개입 없이 지속적으로 확장해, 새 기능이나 워크플로우가 등장하는 즉시 다음 Gap Analysis에서 자동으로 탐지·문서화되도록 한다.

### 1. 소스 스캔

`wiki-targets.md`의 "Keyword Harvest Sources" 테이블을 읽는다. "교육 사이트 (Education Sites)" 섹션의 커리큘럼 커버리지 로그에서 발견된 주제도 같은 방식으로 Discovery Keywords에 유입될 수 있다(카테고리: "AI 개발 공통 개념" 또는 신규 "AI 리터러시" 카테고리).

각 소스에 대해:
1. 해당 URL을 fetch한다.
2. **지난 7일 이내에 게시된** 포스트·릴리스·변경사항만 대상으로 한다. GitHub Releases는 최신 릴리스 1개를 기준으로 한다.
3. 제목·헤딩·기능 이름을 추출한다.

한 번의 실행에서 모든 소스를 처리하기 어려우면, 공식 블로그와 GitHub Releases를 우선 처리하고 나머지는 다음 실행으로 미룬다.

### 2. 키워드 추출

각 소스의 내용에서 아래 유형의 항목을 후보 키워드로 추출한다:
- 신규 기능명 (예: `extended thinking`, `web search tool`)
- 워크플로우 이름 (예: `agentic loop`, `parallel tool use`)
- 개념·용어 (예: `context caching`, `computer use`)
- CLI 명령어·옵션 (예: `--dangerously-skip-permissions`)
- MCP 서버 이름 (예: `filesystem MCP`, `GitHub MCP`)

### 3. 범위 필터링

`wiki-targets.md`의 "범위 기준(Scope Intent)"을 기준으로 각 후보 키워드를 평가한다.

통과 조건 (하나 이상 충족):
- AI CLI 도구(Claude Code, Codex, Gemini CLI) 기능
- MCP 서버 설정 또는 활용
- 에이전트 개념 (subagent, multi-agent, tool use, memory, hooks 등)
- 바이브 코딩 워크플로우
- 개인 앱 개발에 쓸 수 있는 AI 활용 패턴
- LLM API 활용 (Claude, OpenAI, Gemini)
- 개발 환경 설정
- 학습 목적의 AI 개념 설명

제외 조건 (하나라도 해당하면 건너뜀):
- 뉴스·의견·트렌드 분석
- 엔터프라이즈 전용 기능
- 보안·인증·결제 관련 (MANUAL_REVIEW_REQUIRED로 분류)

### 4. 중복 제거

필터를 통과한 키워드에 대해:
1. 기존 Discovery Keywords에 동일하거나 매우 유사한 항목이 있으면 건너뛴다.
2. "에이전트 발견 주제" 로그에 이미 `CREATED` 상태인 주제와 중복이면 건너뛴다.

### 5. 카테고리 및 우선순위 배정

`wiki-targets.md`의 "카테고리 배정 기준"과 "우선순위 배정 기준"을 참조한다.

### 6. Discovery Keywords 업데이트

새 키워드를 `wiki-targets.md`의 Discovery Keywords 해당 카테고리에 **PENDING** 상태로 추가한다.

### 7. 수확 로그 업데이트

`wiki-targets.md`의 "Keyword Harvest Log"에 이번에 추가한 키워드를 기록한다.
"Keyword Harvest Sources" 테이블의 "마지막 확인일"을 오늘 날짜로 업데이트한다.

새로 추가된 키워드가 없을 경우에도 "마지막 확인일"은 업데이트하고, 런 리포트에 "Keyword Harvest: 신규 키워드 없음"으로 명시한다.

---

## Step: Gap Analysis

이 단계는 목록을 참조하지 않는다. 공식 문서 전체 구조와 현재 Confluence 위키를 직접 비교해 무엇이 빠졌는지 스스로 판단한다.

### 0. PENDING 항목 먼저 처리

`wiki-targets.md`의 "에이전트 발견 주제" 로그에서 상태가 `PENDING`인 항목을 확인한다.
PENDING 항목은 이전 실행에서 발견했지만 처리하지 못한 갭이다. 새 갭 탐색보다 먼저 처리한다.

각 PENDING 항목에 대해:
- 공식 소스가 여전히 유효한지 확인한다.
- 조건이 충족되면 이번 실행에서 페이지를 생성하고 상태를 `CREATED`로 업데이트한다.
- 조건 미충족 시 사유를 기록하고 상태를 유지하거나 `MANUAL_REVIEW_REQUIRED`로 변경한다.

### 1. 위키 목적 이해

`wiki-targets.md`의 "Wiki Purpose"와 "범위 기준(Scope Intent)"을 읽는다.
질문: "이 위키의 독자(바이브 코딩, 학습, 개인 앱 개발을 하는 사람)가 지금 위키에서 찾지 못하는 것은 무엇인가?"

### 2. 키워드 기반 문서 탐색

고정된 URL 목록을 사용하지 않는다. `wiki-targets.md`의 "Discovery Keywords" 섹션에 있는 키워드를 기반으로 **웹 검색**을 수행해 관련 공식 문서 페이지를 동적으로 발견한다.

**탐색 절차:**
1. `wiki-targets.md`의 Discovery Keywords에서 키워드를 읽는다.
2. 각 키워드에 대해 아래 패턴으로 검색한다:
   - `site:docs.anthropic.com <keyword>`
   - `site:github.com/openai/codex <keyword>`
   - `site:github.com/google-gemini/gemini-cli <keyword>`
   - `<keyword> Claude Code official documentation`
   - `<keyword> Codex CLI guide`
3. 검색 결과에서 공식 문서 페이지를 식별한다.
4. 해당 페이지의 내용을 fetch해서 실제 주제와 내용을 파악한다.
5. 발견된 주제가 Confluence에 대응하는 페이지가 없으면 갭으로 분류한다.

**중요:** 키워드 전체를 한 실행에서 다 소진하려 하지 않는다. 우선순위가 높은 키워드부터 처리하고, 처리한 키워드는 `wiki-targets.md` Discovery Keywords의 상태를 `SEARCHED`로 표시한다. 다음 실행에서 `SEARCHED`가 아닌 키워드를 이어서 처리한다.

### 3. 위키 커버리지 비교

현재 Confluence 위키가 다루는 페이지 목록(Index에서 수집한 것)과 공식 문서 목차를 나란히 놓는다.

- 공식 문서에 있지만 Confluence에 대응하는 페이지가 없는 항목 = 갭(gap)
- 이미 발견한 적 있는 항목은 `wiki-targets.md`의 "에이전트 발견 주제" 로그를 확인해 중복을 피한다.

### 4. 갭 우선순위 결정

발견한 갭을 아래 기준으로 순위를 매긴다. 점수가 높은 항목부터 이번 실행에서 처리한다.

| 기준 | 높은 우선순위 | 낮은 우선순위 |
|------|------------|------------|
| 위키 목적 관련성 | 바이브 코딩·학습·앱 개발에 직결 | 간접적이거나 고급 주제 |
| 기능 중요도 | 핵심 기능(슬래시 명령어, subagent 등) | 부가 기능 |
| 독자 진입 가능성 | 초보자도 바로 쓸 수 있음 | 사전 지식 필요 |
| 공식 소스 충실도 | 공식 문서가 충분히 설명함 | 문서가 빈약하거나 불완전 |

### 5. 이번 실행에서 처리할 갭 선택

우선순위 상위 항목 중 아래 조건을 모두 만족하는 항목을 **이번 실행에서 생성**한다:
- 공식 문서가 충분히 존재한다.
- 범위 기준에 명확히 부합한다.
- 동일 주제의 Confluence 페이지가 없다.

한 번의 실행에서 처리할 수 있는 만큼 생성한다. 남은 갭은 다음 실행에서 계속 채운다.

### 6. 갭 로그 업데이트

실행 후 `wiki-targets.md`의 "에이전트 발견 주제" 섹션에 기록한다:
- 이번에 생성한 항목: 페이지 ID와 함께 기록
- 발견했지만 이번에 못 만든 항목: 상태를 `PENDING`으로 기록 → 다음 실행에서 자동으로 처리
- 수동 검토가 필요한 항목: `MANUAL_REVIEW_REQUIRED`로 기록

**이 단계를 건너뛰지 않는다.** 갭이 없는 경우에도 "커버리지 평가 완료, 갭 없음"을 런 리포트에 명시한다.

## Step: Collect Sources

For each target (existing and newly discovered):

- Search official documentation.
- Search official GitHub release notes when relevant.
- Search official package registry pages when relevant.
- Use trusted sources only when official sources are insufficient.
- Record all source URLs.

## Step: Compare Existing Page With Latest Sources

Classify the result as:

- NO_CHANGE
- MINOR_UPDATE
- SECTION_UPDATE
- TONE_REWRITE: content is current but writing style is stiff, summary-like, or hard to read → rewrite tone following Tone Policy without changing facts
- RECOMPILE_REQUIRED
- NEW_PAGE_REQUIRED
- INDEX_UPDATE_REQUIRED
- MANUAL_REVIEW_REQUIRED

When comparing, also evaluate tone. If the page reads like a formal reference doc or bullet-point summary rather than a friendly guide, classify as at least TONE_REWRITE regardless of content freshness.

## Step: Decide Action

Use policy.md to decide whether to modify automatically or report for manual review.

Safe automatic actions:

- Fix broken or missing Index entries.
- Add source references.
- Update small command or version changes from official sources.
- Update verification steps from official sources.
- Improve keywords and use cases in Index entries.

Manual review required:

- Authentication model changed.
- Security guidance changed.
- Pricing or billing changed.
- Conflicting sources exist.
- Major page restructuring is required.
- New page creation is not explicitly allowed.

## Step: Check Page Scope

Before updating or recompiling, check whether the current page content matches its title's scope.

- Read the page title and identify the scope it defines.
- Read `recompile-rules.md` Page Scope Enforcement table.
- Scan each section of the page and mark any section that falls outside the title's scope.
- If out-of-scope sections are found:
  - Classify the page as `RECOMPILE_REQUIRED` (if not already).
  - Plan to apply the Auto Page Split Rule during recompile.
- If the page is a Setup page, verify it covers all items in the Setup Page Depth Rule. Missing items are gaps to fill.

## Step: Update Existing Guide

When updating a page:

- Preserve the page intent defined by its title.
- Remove outdated instructions.
- Remove or split out any content that falls outside the title's scope.
- Avoid append-only update sections.
- Use current official source information.
- Follow Tone Policy: write like a friendly blog post, not a formal reference doc.
- Include verification steps.
- Include common issues when supported by sources.
- Include related pages.
- Include source references.

## Step: Create New Guide

Create a new guide only when:

- No canonical page exists.
- The topic is within scope.
- The tool has official documentation.
- The guide is useful for AI development workflows.
- A parent page and Index page are known.

Before creating a page:

- Normalize the title using `policy.md` Title Prefix Normalization Policy.
- Always use the `[Guide]` title prefix.
- Do not create pages with `[Concept]`, `[Concept & Workflow]`, `[Workflow]`, `[Reference]`, `[Setup]`, or `[Usage]` prefixes.
- Decide `wiki.metadata.docType` using only `guide` or `page`.

After creating a page:

- Set `wiki.metadata` content property using `policy.md` docType Policy. `docType` must be either `guide` or `page`.
- Add it to the relevant Index pages.
- Add keywords and use cases.
- Add source references.
- Write it in the run report.

Do not defer or skip page creation just because the Content Properties write path is unavailable or fails (see `policy.md` "페이지 생성 시 metadata 설정"). Create the page, then record any metadata-write failure as a Manual Review item with the page ID for a follow-up retry.

## Step: Guide Synthesis

`page` 타입 문서가 충분히 쌓였을 때 `guide` 타입 문서를 생성한다.
`guide-synthesis-rules.md`의 규칙을 따른다.

**weekly 모드**: 이 단계를 실행한다. 단, 1회 실행에서 guide 생성은 최대 1개로 제한한다.
**guide-synthesis 모드**: 이 단계만 실행한다 (Keyword Harvest, Gap Analysis 생략).
**다른 모드**: 이 단계를 생략한다.

절차:

1. Index 페이지에서 `page` 타입 문서 목록을 수집한다.
2. `guide-synthesis-rules.md` 클러스터링 기준으로 연관 page 그룹을 찾는다.
3. 이미 해당 흐름을 다루는 `guide` 타입 문서가 있으면 건너뛴다.
4. 후보 우선순위 기준으로 가장 가치 있는 후보 1개를 선택한다.
5. 선택한 후보로 guide 페이지를 생성한다 (`guide-synthesis-rules.md` 문서 구조 따름).
6. 제목은 `[Guide]` 접두사로 정규화하고 `wiki.metadata`를 `policy.md` 기준으로 설정한다 (`docType: "guide"`).
7. 나머지 후보는 `wiki-targets.md` 에이전트 발견 주제 로그에 `PENDING`으로 기록한다.
8. 생성된 guide 페이지를 관련 Index에 등록한다.

후보가 없으면 "Guide Synthesis: 조건 미충족, 생성 없음"을 런 리포트에 명시한다.

## Step: Update Index

After every meaningful guide update or new guide creation:

- Update related Index pages.
- Ensure every affected guide page is directly linked from at least one Index page.
- Add page link.
- Add doc type.
- Add use case.
- Add keywords.
- Add tool name.
- Add OS or environment if relevant.
- Remove duplicates only when safe.
- For weekly runs, review the Index again after updates to confirm newly added or modified pages are represented.

## Step: Validate

Run validation-checklist.md.

## Step: Report

Write a run report using:

`templates/run-report-template.md`

The report must include:

- Execution mode
- Pages read
- Pages updated
- Pages created
- Index pages updated
- Sources used
- Manual review items
- Validation result

## Step: Post-Run Log

If the shared Ops log page exists, append a concise entry to:

`[Ops] Knowledge Change Log` (`63111673`)

Keep the log entry short and factual. Include:

- Execution mode
- Pages updated or created
- Index pages updated
- Notable source or structure changes
- A reference to the completed run report
