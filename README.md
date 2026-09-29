# SFOOD-LLM-WIKI-WORKFLOW

Codex CLI 기반 AI 개발 위키 자동 유지보수 에이전트.

Confluence에 저장된 AI 개발 가이드 문서를 스케줄에 따라 자동으로 점검하고, 새 주제를 발견해 문서를 생성하며, 기존 문서를 최신 상태로 유지합니다.

---

## 어떤 문제를 해결하는가

AI 개발 도구(Claude Code, Codex CLI, Gemini CLI, MCP 등)는 빠르게 업데이트됩니다.  
공식 문서가 바뀌어도 위키가 그대로 남아있으면 팀원들이 잘못된 정보를 따라가게 됩니다.  
이 에이전트는 사람이 직접 위키를 관리하지 않아도 최신 상태를 유지할 수 있게 합니다.

---

## 동작 흐름

```
스케줄(cron) 또는 수동 실행
  └─ wiki-update.sh
       └─ Codex CLI 에이전트 실행
            ├─ 1. Keyword Harvest      ← AI 뉴스·블로그·릴리스 노트 스캔 → 새 키워드 자동 추가
            ├─ 2. Gap Analysis         ← 키워드로 공식 문서 검색 → Confluence와 비교 → 갭 발견
            ├─ 3. Collect Sources      ← 각 대상 페이지의 최신 공식 소스 수집
            ├─ 4. Compare & Classify   ← 기존 페이지와 비교: NO_CHANGE / MINOR_UPDATE / RECOMPILE_REQUIRED / NEW_PAGE_REQUIRED 등
            ├─ 5. Check Page Scope     ← 제목과 내용 범위 일치 여부 점검 → 범위 초과 시 Auto Page Split
            ├─ 6. Update / Create      ← 페이지 업데이트 또는 신규 생성 + wiki.metadata 설정
            ├─ 7. Guide Synthesis      ← page 타입 문서가 3개 이상 쌓이면 guide 타입 문서 자동 합성
            ├─ 8. Update Index         ← 관련 Index 페이지에 새 페이지 링크 등록
            ├─ 9. Validate             ← 페이지·Index·metadata 검증
            └─ 10. Run Report          ← runs/ 폴더에 실행 결과 기록
```

---

## 스케줄 및 실행 모드

### 자동 실행 (스케줄)

Claude Code의 CronJob 기능으로 매일 자동 실행됩니다.

```
매일 지정 시각 → wiki-update.sh weekly 실행
```

### 수동 실행

```bash
# Weekly 전체 점검 (Keyword Harvest + Gap Analysis + 업데이트 + Guide Synthesis)
./wiki-update.sh weekly

# 특정 도구 관련 페이지만 업데이트
./wiki-update.sh tool claude
./wiki-update.sh tool codex
./wiki-update.sh tool gemini
./wiki-update.sh tool mcp

# Index 페이지 감사 (누락 링크, 중복, 고아 페이지 점검)
./wiki-update.sh index audit

# 특정 Confluence 페이지 리컴파일
./wiki-update.sh recompile page <page-id>

# page 타입 문서에서 guide 타입 문서 합성
./wiki-update.sh guide-synthesis
```

---

## 스킬 구성

에이전트의 행동은 `skills/confluence-guide-maintainer/` 아래의 마크다운 파일로 정의됩니다.

```
skills/confluence-guide-maintainer/
├─ SKILL.md                 에이전트 역할과 핵심 원칙 정의
├─ commands.md              실행 모드별 동작 명세
├─ workflow.md              전체 실행 루프 (10단계)
├─ policy.md                docType 정의, metadata 스키마, 업데이트/생성/에스컬레이션 기준
├─ source-roles.md          소스 신뢰도 계층 (공식 문서 > GitHub > 커뮤니티)
├─ indexing-rules.md        Index 페이지 구조와 링크 규칙
├─ recompile-rules.md       리컴파일 기준, 페이지 범위 강제, Auto Page Split 규칙
├─ guide-synthesis-rules.md page 타입 문서 → guide 타입 문서 자동 합성 규칙
├─ validation-checklist.md  실행 완료 전 검증 체크리스트 (metadata 포함)
├─ wiki-targets.md          확인된 페이지 ID, Discovery Keywords, Keyword Harvest Log
└─ templates/               런 리포트, 가이드, Index 항목, 수동 검토 템플릿
```

### 주요 스킬 설명

#### Keyword Harvest
AI 뉴스와 공식 릴리스 노트를 스캔해 새 키워드를 자동으로 발굴합니다.

- 스캔 소스: Anthropic Blog, OpenAI Blog, Google DeepMind Blog, Simon Willison's Blog, HuggingFace Blog, GitHub Releases (Claude Code / Codex CLI / Gemini CLI), MCP Servers
- 지난 7일 내 게시된 콘텐츠만 대상
- 위키 범위 기준(Scope Intent)으로 필터링 후 기존 키워드와 중복 제거
- 신규 키워드는 `wiki-targets.md` Discovery Keywords에 `PENDING` 상태로 추가
- 처리된 소스는 "마지막 확인일" 업데이트

#### Gap Analysis
Discovery Keywords를 기반으로 공식 문서를 검색하고 Confluence와 비교해 갭을 발견합니다.

- `PENDING` 상태 키워드부터 우선 처리
- 공식 문서에 있고 Confluence에 없으면 갭(gap)으로 분류
- 갭은 우선순위(독자 접근성, 기능 중요도, 공식 소스 충실도)로 순위 매김
- 조건 충족 시 자동 생성, 미충족 시 `PENDING`으로 기록 → 다음 실행에서 처리

#### Auto Page Split
페이지 제목과 내용의 범위가 맞지 않으면 자동으로 분리합니다.

- 예: "Claude CLI Setup" 페이지에 "Subagent 사용법" 섹션이 있으면 별도 페이지로 분리
- 분리된 페이지는 Index에 등록되고 원본 페이지에서 링크됨
- 정보 소실 없이 범위 기준을 유지

#### Guide Synthesis
누적된 `page` 타입 문서에서 스토리형 `guide` 타입 문서를 자동으로 생성합니다.

- 같은 도구/주제 영역의 page가 3개 이상이면 guide 후보로 분류
- 스토리 유형: 입문 여정, 기능 심화, 자동화 구성, 컨텍스트 관리, 앱 개발 여정
- 1회 실행당 최대 1개 생성, 나머지는 `PENDING`으로 기록

---

## 페이지 분류 체계 (docType)

모든 Confluence 페이지는 생성 시 `wiki.metadata` content property에 docType을 포함한 metadata를 설정합니다.

| docType | 정의 | Wiki 검색 | Wiki 노출 | 추천/관련 |
|---------|------|----------|----------|---------|
| `nav` | Index, Getting Started, 최상위 탐색 문서 | 내부 검색 사용 | 노출 안 함 | 제외 |
| `guide` | 목적을 가지고 따라가는 스토리형·단계형 문서 | 검색 가능 | 노출 | 추천 중심 |
| `page` | 설치, 설정, 실행, 설명이 있는 단위 문서 | 검색 가능 | 노출 가능 | 보조 연결 |
| `faq` | 자주 묻는 질문과 짧은 답변 | 검색 가능 | 노출 | 관련 FAQ 영역 |
| `policy` | AI 사용 정책, 보안 기준, 비용 처리 | 검색 가능 | 정책 영역 노출 | 관련 정책 영역 |
| `library` | 지침서, 템플릿, 참고 자료 모음 | 검색 가능 | 노출 | 참고 자료 영역 |
| `playbook` | 문제 해결 절차, 운영 시나리오 | 검색 제외 | 노출 안 함 | 제외 |
| `ops` | Wiki 운영, 런 리포트, 내부 규칙 | 검색 제외 | 노출 안 함 | 제외 |

### metadata 스키마

```json
{
  "docType": "page",
  "audience": "beginner",
  "status": "published",
  "prerequisites": [12345678],
  "next": [12345679],
  "related": [12345680],
  "lastReviewedAt": "2026-05-13",
  "reviewCycleDays": 90,
  "keywords": ["claude code", "setup", "install"]
}
```

---

## 파일 구성

```
SFOOD-LLM-WIKI-WORKFLOW/
├─ AGENTS.md                에이전트 역할 및 규칙 (Codex가 처음 읽는 파일)
├─ CLAUDE.md                Claude Code용 프로젝트 안내
├─ wiki-update.sh           실행 진입점 스크립트
├─ .codex/
│   └─ config.toml          Codex 설정 (reasoning_effort: high, approval: never)
├─ skills/
│   └─ confluence-guide-maintainer/   에이전트 스킬 정의 (위 스킬 구성 참조)
├─ scripts/
│   └─ update-confluence-wiki-metadata.js   Index 페이지 metadata 일괄 설정 유틸리티
├─ docs/
│   └─ product/prd.md       프로젝트 요구사항 문서
└─ runs/                    실행 결과 런 리포트 (gitignore)
```

---

## 설치 및 설정

### 요구사항

- [Codex CLI](https://github.com/openai/codex) 설치
- Confluence MCP 연결 설정
- OpenAI API 키 또는 ChatGPT 계정

### 환경 변수 설정

`.env.local` 파일을 생성하고 아래 변수를 설정합니다. (`.gitignore`에 포함되어 있음)

```bash
ATLASSIAN_SITE_URL=https://your-domain.atlassian.net
ATLASSIAN_USER_EMAIL=your-email@example.com
ATLASSIAN_API_TOKEN=your-api-token
OPENAI_API_KEY=sk-...        # 선택 사항: ChatGPT 계정 사용 시 불필요
```

### Confluence 페이지 ID 설정

`skills/confluence-guide-maintainer/wiki-targets.md`의 `Confirmed Index Pages` 항목에 사용할 Confluence 페이지 ID를 입력합니다.

### 실행

```bash
./wiki-update.sh weekly
```

---

## 자동화 원칙

- **Index-first**: 모든 페이지 탐색은 Index 페이지에서 시작. 고아 페이지 생성 금지.
- **Source grounding**: 모든 내용 변경은 공식 소스를 출처로 명시.
- **Recompile over append**: 구조가 낡은 페이지는 "As of 날짜…" 섹션 추가 대신 전체 재작성.
- **Conservative automation**: 보안·인증·결제 관련 변경은 자동 처리하지 않고 수동 검토 항목으로 기록.
- **Tone**: 친절한 블로그 글 형태. 공문서 문체 금지. 독자에게 설명하듯 쓴다.

---

## 기여

스킬 동작을 변경하려면 해당 파일을 수정합니다.

| 변경 목적 | 수정 파일 |
|----------|----------|
| 실행 루프 변경 | `skills/confluence-guide-maintainer/workflow.md` |
| 업데이트·생성 기준 변경 | `skills/confluence-guide-maintainer/policy.md` |
| Guide 합성 로직 변경 | `skills/confluence-guide-maintainer/guide-synthesis-rules.md` |
| 탐색 키워드 추가 | `skills/confluence-guide-maintainer/wiki-targets.md` |
| 리포트·페이지 구조 변경 | `skills/confluence-guide-maintainer/templates/` |
| Codex 실행 설정 변경 | `.codex/config.toml` |
